"""
Lightweight API scaffold to demo the Network Sniffer without shipping raw Scapy CLI.

Endpoints:
- GET /sniffer/sample -> plain text sample log (for front-end fallback/demo)
- POST /sniffer/parse -> upload a PCAP file, returns parsed log lines (HTTP/DNS/TLS)

Run locally:
  uvicorn demo-api.main:app --reload --port 8000
Front-end can call /sniffer/sample for demo or /sniffer/parse with FormData (file).
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import PlainTextResponse
from scapy.all import rdpcap, Raw, TCP, UDP, DNS, IP, IPv6, load_layer
from scapy.layers.tls.handshake import TLSClientHello
from datetime import datetime
from typing import List

app = FastAPI(title="Network Sniffer Demo API")

# Ensure TLS layer is available
load_layer("tls")


@app.get("/sniffer/sample", response_class=PlainTextResponse)
def sample():
    """Static sample log for front-end demos."""
    return (
        "2024-05-01 10:05:21.123456 HTTP 10.0.0.5:52311 -> 93.184.216.34:80 example.com GET /index.html\n"
        "2024-05-01 10:05:21.567890 DNS 10.0.0.5:53318 -> 8.8.8.8:53 api.github.com.\n"
        "2024-05-01 10:05:22.045612 TLS 10.0.0.5:52312 -> 172.217.11.142:443 www.google.com\n"
        "2024-05-01 10:05:22.445612 HTTP 10.0.0.5:52312 -> 172.217.11.142:443 www.google.com GET /search?q=scapy"
    )


@app.post("/sniffer/parse", response_class=PlainTextResponse)
async def parse_pcap(file: UploadFile = File(...)):
    """Upload a PCAP and return parsed HTTP/DNS/TLS lines."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    content = await file.read()
    try:
        lines = parse_packets(content)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Failed to parse: {exc}") from exc
    return "\n".join(lines) if lines else "No HTTP/DNS/TLS packets found."


def parse_packets(content: bytes) -> List[str]:
    packets = rdpcap(io_bytes(content))
    results: List[str] = []
    for pkt in packets:
        line = handle_packet(pkt)
        if line:
            results.append(line)
    return results


def handle_packet(packet):
    if packet.haslayer(Raw) and (packet.haslayer(TCP) or packet.haslayer(UDP)):
        return http_handler(packet)
    if packet.haslayer(TLSClientHello):
        return tls_handler(packet)
    if packet.haslayer(UDP) and packet.haslayer(DNS) and packet[DNS].qd:
        return dns_handler(packet)
    return None


def common_info(packet, protocol: str):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
    if packet.haslayer(IP):
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
    elif packet.haslayer(IPv6):
        src_ip = packet[IPv6].src
        dst_ip = packet[IPv6].dst
    else:
        return None

    if packet.haslayer(TCP):
        src_port = packet[TCP].sport
        dst_port = packet[TCP].dport
    elif packet.haslayer(UDP):
        src_port = packet[UDP].sport
        dst_port = packet[UDP].dport
    else:
        return None

    return f"{now} {protocol} {src_ip}:{src_port} -> {dst_ip}:{dst_port}"


def http_handler(packet):
    payload = packet[Raw].load.decode(errors="ignore")
    if payload.startswith(("GET", "POST")):
        lines = payload.split("\r\n")
        method, uri = lines[0].split()[:2]
        host = "Unknown"
        for line in lines:
            if line.lower().startswith("host:"):
                host = line.split(": ", 1)[1]
                break
        base = common_info(packet, "HTTP")
        return f"{base} {host} {method} {uri}" if base else None
    return None


def tls_handler(packet):
    if packet.haslayer(TLSClientHello):
        client_hello = packet[TLSClientHello]
        for ext in getattr(client_hello, "ext", []):
            if getattr(ext, "type", None) == 0 and getattr(ext, "servernames", None):
                hostname = ext.servernames[0].servername.decode()
                base = common_info(packet, "TLS")
                return f"{base} {hostname}" if base else None
    return None


def dns_handler(packet):
    dns = packet[DNS]
    if dns and dns.qd and dns.qd.qtype == 1:
        query = dns.qd.qname.decode()
        base = common_info(packet, "DNS")
        return f"{base} {query}" if base else None
    return None


def io_bytes(content: bytes):
    """Utility to feed bytes into rdpcap without touching disk."""
    from io import BytesIO
    return BytesIO(content)
