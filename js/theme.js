(() => {
    "use strict";

    const STORAGE_KEY = "moriUiTheme";
    const NOVA = "nova";
    const LEGACY = "legacy";

    function bacaTema() {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return value === LEGACY ? LEGACY : NOVA;
        } catch (_) {
            return NOVA;
        }
    }

    function simpanTema(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (_) {}
    }

    function temaSekarang() {
        return document.body?.dataset.uiTheme === LEGACY ? LEGACY : NOVA;
    }

    function updateMeta(theme) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) return;
        meta.setAttribute("content", theme === NOVA ? "#07111f" : "#eef4fb");
    }

    function updateButton(button, theme) {
        if (!button) return;
        const targetLegacy = theme === NOVA;
        button.innerHTML = targetLegacy
            ? '<span class="theme-switch-icon" aria-hidden="true">◐</span><span class="theme-switch-text">Tema Lama</span>'
            : '<span class="theme-switch-icon" aria-hidden="true">✦</span><span class="theme-switch-text">Tema Nova</span>';
        button.setAttribute(
            "aria-label",
            targetLegacy ? "Gunakan desain lama" : "Gunakan desain Nova"
        );
        button.title = targetLegacy ? "Kembali ke desain lama" : "Gunakan desain Nova";
    }

    function terapkanTema(theme, animasi = false) {
        if (!document.body) return;
        const finalTheme = theme === LEGACY ? LEGACY : NOVA;

        if (animasi) {
            document.documentElement.classList.add("theme-is-switching");
            window.setTimeout(() => {
                document.documentElement.classList.remove("theme-is-switching");
            }, 650);
        }

        document.body.dataset.uiTheme = finalTheme;
        document.documentElement.dataset.uiTheme = finalTheme;
        updateMeta(finalTheme);
        updateButton(document.getElementById("themeSwitchBtn"), finalTheme);

        window.dispatchEvent(new CustomEvent("mori-theme-change", {
            detail: { theme: finalTheme }
        }));
    }

    function buatTombol() {
        if (document.getElementById("themeSwitchBtn")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.id = "themeSwitchBtn";
        button.className = "theme-switch-btn";
        button.innerHTML = '<span class="theme-switch-icon" aria-hidden="true">◐</span><span class="theme-switch-text">Tema Lama</span>';

        button.addEventListener("click", () => {
            const next = temaSekarang() === NOVA ? LEGACY : NOVA;
            simpanTema(next);
            terapkanTema(next, true);
        });

        document.body.appendChild(button);
        updateButton(button, temaSekarang());
    }

    function init() {
        terapkanTema(bacaTema(), false);
        buatTombol();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
