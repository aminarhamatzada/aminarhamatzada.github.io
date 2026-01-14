
document.addEventListener("DOMContentLoaded", () => {
    // Typewriter intro
    const typeEl = document.getElementById("typewriter-text");
    const messages = [
        "Hi, I'm Amina!",
        "I study Computer Science and Applied Math at Stony Brook University.",
        "I build with security, design, and engineering in mind.",
        "I am actively seeking full-time roles after graduating this Spring."
    ];
    let msgIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeSpeed = 60;
    const pauseTime = 1400;

    function type() {
        if (!typeEl) return;
        const current = messages[msgIndex];
        if (!deleting) {
            typeEl.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(type, pauseTime);
                return;
            }
        } else {
            typeEl.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                msgIndex = (msgIndex + 1) % messages.length;
            }
        }
        setTimeout(type, deleting ? 35 : typeSpeed);
    }

    type();

    // Scroll spy for nav
    const navLinks = document.querySelectorAll(".nav a");
    const sections = document.querySelectorAll("section, .header");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(section => observer.observe(section));

    // Experience filters
    const filterBtns = document.querySelectorAll(".filter-btn");
    const expCards = document.querySelectorAll(".experience-block");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            expCards.forEach(card => {
                const category = card.dataset.category;
                const show = filter === "all" || category === filter;
                card.classList.toggle("hidden", !show);
            });
        });
    });

    // Expandable experience details
    document.querySelectorAll(".expand-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".experience-block");
            const expanded = card.classList.toggle("expanded");
            btn.setAttribute("aria-expanded", expanded ? "true" : "false");
            btn.textContent = expanded ? "Show less" : "Read more";
        });
    });

    // Dark mode toggle with persistence
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeToggle) themeToggle.textContent = "☀";
    }
    themeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.textContent = isDark ? "☀" : "☾";
    });

    // Demo modal
    const modal = document.getElementById("demo-modal");
    const modalTitle = document.getElementById("demo-title");
    const modalTag = document.getElementById("demo-tag");
    const modalSub = document.getElementById("demo-sub");
    const modalHow = document.getElementById("demo-how");
    const modalTry = document.getElementById("demo-try");
    const modalLog = document.getElementById("demo-log");
    const modalGithub = document.getElementById("demo-github");
    const closeBtn = document.querySelector(".modal-close");
    const uploadInput = document.getElementById("pcap-upload");
    const uploadBtn = document.getElementById("upload-btn");
    const uploadStatus = document.getElementById("upload-status");
    let currentDemo = null;

    const demoContent = {
        sniffer: {
            title: "Network Sniffer",
            tag: "Python · Scapy",
            sub: "Captures HTTP, DNS, and TLS traffic from live interfaces or PCAP files.",
            how: "Uses Scapy to sniff packets, classifies by protocol, and prints hostnames/queries (HTTP headers, DNS A records, TLS SNI).",
            try: "In a real deployment, you’d upload a PCAP or listen on an interface. Here’s a sample capture log:",
            log: `2024-05-01 10:05:21.123456 HTTP 10.0.0.5:52311 -> 93.184.216.34:80 example.com GET /index.html
2024-05-01 10:05:21.567890 DNS 10.0.0.5:53318 -> 8.8.8.8:53 api.github.com.
2024-05-01 10:05:22.045612 TLS 10.0.0.5:52312 -> 172.217.11.142:443 www.google.com
2024-05-01 10:05:22.445612 HTTP 10.0.0.5:52312 -> 172.217.11.142:443 www.google.com GET /search?q=scapy`,
            github: "https://github.com/aminarhamatzada/Network-Sniffer"
        },
        plm: {
            title: "PLM Image Analysis Pipeline",
            tag: "ImageJ / Fiji",
            sub: "Automates polarized light microscopy gel analysis with batch particle metrics to CSV.",
            how: "Runs Fiji macros to batch-process images, extract particle size/shape metrics, and export CSV summaries for comparisons.",
            try: "A live demo would process uploaded TIFFs and return a CSV. Sample output rows:",
            log: `file,particle_count,mean_size,aspect_ratio,crystal_count
gel_A.tif,124,3.1,1.24,18
gel_B.tif,97,2.6,1.12,11
gel_C.tif,188,3.8,1.31,25`,
            github: "https://github.com/aminarhamatzada" // update to exact repo path
        }
    };

    function openDemo(key) {
        currentDemo = key;
        const data = demoContent[key];
        if (!data || !modal) return;
        modalTitle.textContent = data.title;
        modalTag.textContent = data.tag;
        modalSub.textContent = data.sub;
        modalHow.textContent = data.how;
        modalTry.textContent = data.try;
        modalLog.textContent = data.log;
        modalGithub.href = data.github;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");

        // For sniffer, try to fetch sample log from backend if available
        if (key === "sniffer") {
            modalLog.textContent = "Loading sample log...";
            fetch("/sniffer/sample")
                .then(resp => resp.ok ? resp.text() : Promise.reject(resp.status))
                .then(text => { modalLog.textContent = text; })
                .catch(() => { modalLog.textContent = data.log; });
        }
    }

    document.querySelectorAll(".demo-trigger").forEach(btn => {
        btn.addEventListener("click", () => openDemo(btn.dataset.demo));
    });

    closeBtn?.addEventListener("click", () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    });

    modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        }
    });

    // Upload handler for PCAP parsing
    uploadBtn?.addEventListener("click", () => {
        if (currentDemo !== "sniffer") {
            uploadStatus.textContent = "Uploads only apply to the Network Sniffer demo.";
            return;
        }
        const file = uploadInput?.files?.[0];
        if (!file) {
            uploadStatus.textContent = "Please choose a PCAP file first.";
            return;
        }
        uploadStatus.textContent = "Uploading and parsing…";
        const formData = new FormData();
        formData.append("file", file, file.name);
        fetch("/sniffer/parse", {
            method: "POST",
            body: formData
        })
        .then(resp => resp.ok ? resp.text() : resp.text().then(t => Promise.reject(t)))
        .then(text => {
            modalLog.textContent = text;
            uploadStatus.textContent = "Parsed!";
        })
        .catch(err => {
            modalLog.textContent = modalLog.textContent || "Error parsing file.";
            uploadStatus.textContent = `Error: ${err}`;
        });
    });
});
