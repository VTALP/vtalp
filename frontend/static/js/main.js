document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles();
    initErrorFocus();
    initPasswordMatchFeedback();

    const isHomepage = document.body.classList.contains("homepage");

    if (!isHomepage) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const featureCards = Array.from(document.querySelectorAll("[data-feature-card]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal-item]"));

    if (prefersReducedMotion) {
        featureCards.forEach((card) => card.classList.add("is-visible"));
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    let ticking = false;
    const updateHeroState = () => {
        const hasScrolled = window.scrollY > 24;
        document.body.classList.toggle("hero-compact", hasScrolled);
        document.body.classList.toggle("nav-scrolled", hasScrolled);
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeroState);
                ticking = true;
            }
        },
        { passive: true }
    );
    updateHeroState();

    if ("IntersectionObserver" in window) {
        const cardObserver = new IntersectionObserver(
            (entries, entryObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const card = entry.target;
                    card.style.transitionDelay = `${featureCards.indexOf(card) * 90}ms`;
                    card.classList.add("is-visible");
                    entryObserver.unobserve(card);
                });
            },
            { threshold: 0.2 }
        );

        const revealObserver = new IntersectionObserver(
            (entries, entryObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const item = entry.target;
                    item.style.transitionDelay = `${revealItems.indexOf(item) * 80}ms`;
                    item.classList.add("is-visible");
                    entryObserver.unobserve(item);
                });
            },
            { threshold: 0.18 }
        );

        featureCards.forEach((card) => cardObserver.observe(card));
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        featureCards.forEach((card) => card.classList.add("is-visible"));
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }
});

function initPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
        const inputId = toggle.getAttribute("aria-controls");
        const input = inputId ? document.getElementById(inputId) : null;

        if (!input) {
            return;
        }

        toggle.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggle.textContent = isPassword ? "Hide" : "Show";
            toggle.setAttribute(
                "aria-label",
                `${isPassword ? "Hide" : "Show"} ${inputId === "confirm_password" ? "confirm password" : "password"}`
            );
        });
    });
}

function initErrorFocus() {
    const target = document.querySelector("[data-error-focus='true']");

    if (!target) {
        return;
    }

    window.requestAnimationFrame(() => {
        target.focus({ preventScroll: true });
    });
}

function initPasswordMatchFeedback() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");
    const message = document.querySelector("[data-password-match-message]");

    if (!password || !confirmPassword || !message) {
        return;
    }

    const updateMessage = () => {
        const hasConfirmValue = confirmPassword.value.length > 0;
        const matches = password.value === confirmPassword.value;

        message.classList.toggle("is-visible", hasConfirmValue);
        message.classList.toggle("is-match", hasConfirmValue && matches);
        message.classList.toggle("is-mismatch", hasConfirmValue && !matches);

        if (!hasConfirmValue) {
            message.textContent = "";
        } else {
            message.textContent = matches ? "✓ Passwords match" : "✕ Passwords do not match";
        }
    };

    password.addEventListener("input", updateMessage);
    confirmPassword.addEventListener("input", updateMessage);
}
