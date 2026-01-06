
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

});
