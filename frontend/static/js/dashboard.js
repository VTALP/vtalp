// Dashboard JavaScript handles small interface behavior without any framework.
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("dashboardSidebar");
    const toggleButton = document.getElementById("sidebarToggle");

    if (!sidebar || !toggleButton) {
        return;
    }

    // Open and close the sidebar on smaller screens.
    toggleButton.addEventListener("click", () => {
        const sidebarIsOpen = sidebar.classList.toggle("open");
        toggleButton.setAttribute("aria-expanded", String(sidebarIsOpen));
    });

    // Close the sidebar after selecting a link on mobile.
    sidebar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("open");
            toggleButton.setAttribute("aria-expanded", "false");
        });
    });
});
