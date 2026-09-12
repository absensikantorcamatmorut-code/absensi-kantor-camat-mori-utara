(() => {
    "use strict";

    // Tema tunggal: gunakan struktur/layout NOVA, tanpa pilihan mode gelap.
    const applySingleTheme = () => {
        document.documentElement.dataset.uiTheme = "nova";
        if (document.body) document.body.dataset.uiTheme = "nova";

        try {
            localStorage.removeItem("moriUiTheme");
        } catch (_) {}

        const oldButtons = document.querySelectorAll(
            ".theme-switch-btn, #themeSwitchBtn, [data-theme-switch]"
        );
        oldButtons.forEach((button) => button.remove());

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#f4f8ff");
    };

    applySingleTheme();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applySingleTheme, { once: true });
    } else {
        applySingleTheme();
    }
})();
