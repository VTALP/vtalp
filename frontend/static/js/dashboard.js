document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("dashboardSidebar");
    const shell = document.querySelector("[data-dashboard-shell]");
    const trigger = document.querySelector("[data-dashboard-trigger]");
    const closeButton = document.querySelector("[data-sidebar-close]");
    const backdrop = document.querySelector("[data-dashboard-backdrop]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!sidebar || !shell) {
        return;
    }

    let pinned = shell.dataset.sidebarDefault === "expanded";
    let closeTimer = null;
    let lastTrigger = null;

    const isMobile = () => window.matchMedia("(max-width: 960px)").matches;
    const setExpanded = (isExpanded, { pin = pinned, restoreFocus = false } = {}) => {
        pinned = pin;
        shell.classList.toggle("sidebar-expanded", isExpanded);
        shell.classList.toggle("sidebar-hidden", !isExpanded);
        sidebar.classList.toggle("open", isExpanded);
        if (trigger) {
            trigger.hidden = isExpanded && pinned;
            trigger.setAttribute("aria-expanded", String(isExpanded));
        }

        if (backdrop) {
            backdrop.hidden = !isExpanded || !isMobile();
            backdrop.classList.toggle("is-visible", isExpanded && isMobile());
        }

        document.body.classList.toggle("dashboard-drawer-open", isExpanded && isMobile());

        if (isExpanded && isMobile()) {
            closeButton?.focus({ preventScroll: true });
        }

        if (!isExpanded && restoreFocus && lastTrigger) {
            lastTrigger.focus({ preventScroll: true });
        }
    };

    const scheduleClose = () => {
        if (pinned || isMobile()) {
            return;
        }

        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => setExpanded(false, { pin: false }), 220);
    };

    const cancelClose = () => window.clearTimeout(closeTimer);

    trigger?.addEventListener("pointerenter", () => {
        if (isMobile()) {
            return;
        }

        lastTrigger = trigger;
        cancelClose();
        setExpanded(true, { pin: false });
    });

    trigger?.addEventListener("pointerleave", scheduleClose);
    trigger?.addEventListener("click", () => {
        lastTrigger = trigger;
        cancelClose();
        setExpanded(true, { pin: true });
    });

    trigger?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            lastTrigger = trigger;
            setExpanded(true, { pin: true });
        }
    });

    setExpanded(pinned, { pin: pinned });

    sidebar.addEventListener("pointerenter", cancelClose);
    sidebar.addEventListener("pointerleave", scheduleClose);
    closeButton?.addEventListener("click", () => setExpanded(false, { pin: false, restoreFocus: true }));
    backdrop?.addEventListener("click", () => setExpanded(false, { pin: false, restoreFocus: true }));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && shell.classList.contains("sidebar-expanded")) {
            setExpanded(false, { pin: false, restoreFocus: true });
            return;
        }

        if (event.key === "Tab" && isMobile() && shell.classList.contains("sidebar-expanded")) {
            trapSidebarFocus(event, sidebar);
        }
    });

    document.addEventListener("click", (event) => {
        if (pinned || isMobile() || !shell.classList.contains("sidebar-expanded")) {
            return;
        }

        if (!sidebar.contains(event.target) && !trigger?.contains(event.target)) {
            setExpanded(false, { pin: false });
        }
    });

    sidebar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (isMobile()) {
                setExpanded(false, { pin: false });
            }
        });
    });

    initDashboardReveal(prefersReducedMotion);
    initProgressRings(prefersReducedMotion);
    initAutoDismissSuccess(prefersReducedMotion);
});

function initDashboardReveal(prefersReducedMotion) {
    const items = Array.from(document.querySelectorAll("[data-dashboard-reveal]"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, entryObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const item = entry.target;
                item.style.transitionDelay = `${items.indexOf(item) * 55}ms`;
                item.classList.add("is-visible");
                entryObserver.unobserve(item);
            });
        },
        { threshold: 0.14 }
    );

    items.forEach((item) => observer.observe(item));
}

function initProgressRings(prefersReducedMotion) {
    const rings = Array.from(document.querySelectorAll("[data-progress-ring]"));

    const finishRing = (ring) => {
        const target = Number(ring.dataset.progress || 0);
        ring.style.setProperty("--progress", `${target}%`);
        ring.querySelector("[data-progress-value]").textContent = `${target}%`;
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        rings.forEach(finishRing);
        return;
    }

    rings.forEach((ring) => {
        ring.style.setProperty("--progress", "0%");
        ring.querySelector("[data-progress-value]").textContent = "0%";
    });

    const observer = new IntersectionObserver(
        (entries, entryObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const ring = entry.target;
                const target = Number(ring.dataset.progress || 0);
                const value = ring.querySelector("[data-progress-value]");
                const start = performance.now();
                const duration = 850;

                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(target * eased);
                    ring.style.setProperty("--progress", `${current}%`);
                    value.textContent = `${current}%`;

                    if (progress < 1) {
                        window.requestAnimationFrame(animate);
                    }
                };

                window.requestAnimationFrame(animate);
                entryObserver.unobserve(ring);
            });
        },
        { threshold: 0.4 }
    );

    rings.forEach((ring) => observer.observe(ring));
}

function initAutoDismissSuccess(prefersReducedMotion) {
    document.querySelectorAll(".dashboard-page .flash-message.success").forEach((message) => {
        window.setTimeout(() => {
            if (prefersReducedMotion) {
                message.remove();
                return;
            }

            message.classList.add("is-dismissing");
            message.addEventListener("transitionend", () => message.remove(), { once: true });
        }, 3600);
    });
}

function trapSidebarFocus(event, sidebar) {
    const focusable = Array.from(
        sidebar.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")
    );

    if (!focusable.length) {
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}
