
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
});
