(() => {
    "use strict";

    const mapEl = document.getElementById("officeRadiusMap");
    if (!mapEl) return;

    const settingsSection = document.getElementById("adminPengaturanSection");
    const latInput = document.getElementById("settingLatitude");
    const lngInput = document.getElementById("settingLongitude");
    const radiusInput = document.getElementById("settingRadius");
    const radiusSlider = document.getElementById("settingRadiusSlider");
    const radiusPreview = document.getElementById("settingRadiusPreview");
    const radiusBadge = document.getElementById("mapRadiusBadge");
    const statusEl = document.getElementById("officeMapStatus");
    const searchInput = document.getElementById("settingCariAlamat");
    const searchBtn = document.getElementById("settingCariAlamatBtn");

    const fallback = {
        lat: -1.9246196360760033,
        lng: 120.96947352100753,
        radius: 150
    };

    let map = null;
    let marker = null;
    let radiusCircle = null;
    let searchController = null;
    let mapCreated = false;

    function asNumber(input, fallbackValue) {
        const raw = String(input?.value ?? "").trim();
        if (raw === "") return fallbackValue;
        const value = Number(raw);
        return Number.isFinite(value) ? value : fallbackValue;
    }

    function state() {
        return {
            lat: asNumber(latInput, fallback.lat),
            lng: asNumber(lngInput, fallback.lng),
            radius: Math.min(2000, Math.max(20, asNumber(radiusInput, fallback.radius)))
        };
    }

    function zoomForRadius(radius) {
        if (radius <= 50) return 18;
        if (radius <= 100) return 17;
        if (radius <= 250) return 16;
        if (radius <= 500) return 15;
        if (radius <= 1000) return 14;
        return 13;
    }

    function setStatus(text, kind = "") {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.dataset.kind = kind;
    }

    function updateRadiusUI(radius) {
        const r = Math.min(2000, Math.max(20, Number(radius) || fallback.radius));

        if (radiusInput && Number(radiusInput.value) !== r) {
            radiusInput.value = String(r);
        }
        if (radiusSlider && Number(radiusSlider.value) !== r) {
            radiusSlider.value = String(r);
        }
        if (radiusPreview) radiusPreview.textContent = `${Math.round(r)} meter`;
        if (radiusBadge) radiusBadge.textContent = `${Math.round(r)} m`;

        radiusCircle?.setRadius(r);
    }

    function updatePoint(lat, lng, pan = true) {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        if (latInput) latInput.value = lat.toFixed(7);
        if (lngInput) lngInput.value = lng.toFixed(7);

        marker?.setLatLng([lat, lng]);
        radiusCircle?.setLatLng([lat, lng]);

        if (pan && map) {
            map.setView([lat, lng], zoomForRadius(state().radius), { animate: true });
        }
    }

    function refreshMap() {
        if (!map) return;
        setTimeout(() => {
            map.invalidateSize({ pan: false });
            const s = state();
            marker?.setLatLng([s.lat, s.lng]);
            radiusCircle?.setLatLng([s.lat, s.lng]);
            radiusCircle?.setRadius(s.radius);
            map.setView([s.lat, s.lng], zoomForRadius(s.radius), { animate: false });
        }, 120);
    }

    function createMap() {
        if (mapCreated) {
            refreshMap();
            return;
        }

        if (!window.L) {
            setStatus(
                "Peta gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.",
                "error"
            );
            return;
        }

        const s = state();
        mapEl.querySelector(".map-loading-state")?.remove();

        map = L.map(mapEl, {
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: false,
            tap: true
        });

        const primaryTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap"
        });

        const fallbackTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd",
            maxZoom: 20,
            attribution: "&copy; OpenStreetMap &copy; CARTO"
        });

        let switchedToFallback = false;

        primaryTiles.on("tileerror", () => {
            if (switchedToFallback) return;
            switchedToFallback = true;
            try {
                map.removeLayer(primaryTiles);
            } catch (_) {}
            fallbackTiles.addTo(map);
            setStatus("Peta memakai server cadangan.", "warning");
        });

        primaryTiles.addTo(map);

        let tileLoaded = false;
        primaryTiles.once("tileload", () => {
            tileLoaded = true;
        });

        setTimeout(() => {
            if (tileLoaded || switchedToFallback || !map) return;
            switchedToFallback = true;
            try {
                map.removeLayer(primaryTiles);
            } catch (_) {}
            fallbackTiles.addTo(map);
            setStatus("Peta memakai server cadangan.", "warning");
        }, 4500);

        radiusCircle = L.circle([s.lat, s.lng], {
            radius: s.radius,
            color: "#11805f",
            weight: 3,
            opacity: 1,
            fillColor: "#34c895",
            fillOpacity: .20
        }).addTo(map);

        const pin = L.divIcon({
            className: "office-map-pin-wrap",
            html: '<span class="office-map-pin"><i></i></span>',
            iconSize: [40, 50],
            iconAnchor: [20, 46]
        });

        marker = L.marker([s.lat, s.lng], {
            draggable: true,
            autoPan: true,
            icon: pin
        }).addTo(map);

        marker.on("dragend", () => {
            const pos = marker.getLatLng();
            updatePoint(pos.lat, pos.lng, false);
            setStatus("Titik kantor diperbarui.", "success");
        });

        map.on("click", event => {
            updatePoint(event.latlng.lat, event.latlng.lng);
            setStatus("Titik kantor dipindahkan ke lokasi yang dipilih.", "success");
        });

        updateRadiusUI(s.radius);
        mapCreated = true;
        refreshMap();

        primaryTiles.once("tileload", () => {
            setStatus("Peta siap. Geser pin atau ketuk peta untuk mengubah titik.", "success");
        });
    }

    async function searchAddress() {
        const query = String(searchInput?.value || "").trim();

        if (!query) {
            setStatus("Masukkan nama gedung atau alamat terlebih dahulu.", "warning");
            searchInput?.focus();
            return;
        }

        searchController?.abort();
        searchController = new AbortController();

        const originalText = searchBtn?.textContent || "Cari";
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.textContent = "Mencari...";
        }

        try {
            const url =
                "https://nominatim.openstreetmap.org/search" +
                `?format=jsonv2&limit=5&countrycodes=id&q=${encodeURIComponent(query)}`;

            const response = await fetch(url, {
                headers: { Accept: "application/json" },
                signal: searchController.signal
            });

            if (!response.ok) throw new Error("Pencarian alamat gagal.");

            const results = await response.json();
            if (!Array.isArray(results) || results.length === 0) {
                setStatus("Alamat tidak ditemukan.", "warning");
                return;
            }

            const result = results[0];
            const lat = Number(result.lat);
            const lng = Number(result.lon);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                throw new Error("Koordinat hasil pencarian tidak valid.");
            }

            createMap();
            updatePoint(lat, lng);
            setStatus(`Lokasi ditemukan: ${result.display_name || query}`, "success");
        } catch (error) {
            if (error?.name !== "AbortError") {
                setStatus(error?.message || "Pencarian lokasi tidak tersedia.", "error");
            }
        } finally {
            if (searchBtn) {
                searchBtn.disabled = false;
                searchBtn.textContent = originalText;
            }
        }
    }

    searchBtn?.addEventListener("click", searchAddress);

    searchInput?.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        searchAddress();
    });

    latInput?.addEventListener("change", () => {
        createMap();
        const s = state();
        updatePoint(s.lat, s.lng);
    });

    lngInput?.addEventListener("change", () => {
        createMap();
        const s = state();
        updatePoint(s.lat, s.lng);
    });

    radiusInput?.addEventListener("input", () => {
        createMap();
        const s = state();
        updateRadiusUI(s.radius);
        refreshMap();
    });

    radiusSlider?.addEventListener("input", () => {
        if (radiusInput) radiusInput.value = radiusSlider.value;
        createMap();
        updateRadiusUI(radiusSlider.value);
        refreshMap();
    });

    // Existing settings loader writes lat/lng/radius after the page is ready.
    // Watch the values so the map never stays at fallback coordinates.
    let lastKnown = "";
    setInterval(() => {
        const s = state();
        const signature = `${s.lat}|${s.lng}|${s.radius}`;
        if (signature === lastKnown) return;
        lastKnown = signature;

        updateRadiusUI(s.radius);

        if (mapCreated && marker && radiusCircle) {
            marker.setLatLng([s.lat, s.lng]);
            radiusCircle.setLatLng([s.lat, s.lng]);
            radiusCircle.setRadius(s.radius);
            map.setView([s.lat, s.lng], zoomForRadius(s.radius), { animate: false });
            refreshMap();
        }
    }, 700);

    // Important: admin sections are display:none until opened.
    // Build/refresh the map exactly when Settings becomes visible.
    if (settingsSection) {
        const observer = new MutationObserver(() => {
            if (settingsSection.classList.contains("active")) {
                createMap();
                refreshMap();
            }
        });

        observer.observe(settingsSection, {
            attributes: true,
            attributeFilter: ["class"]
        });

        if (settingsSection.classList.contains("active")) {
            createMap();
        }
    } else {
        createMap();
    }

    window.addEventListener("resize", refreshMap);
    window.addEventListener("orientationchange", refreshMap);

    window.syncOfficeMapFromSettings = function () {
        createMap();
        const s = state();
        updatePoint(s.lat, s.lng, false);
        updateRadiusUI(s.radius);
        refreshMap();
    };
})();


/* Simple geofencing UI: presentation only; existing map logic/listeners stay intact. */
document.addEventListener("DOMContentLoaded", () => {
    const form =
        document.getElementById("lokasiKantorForm") ||
        document.querySelector("[data-geofence-form]") ||
        document.querySelector(".geofence-form");

    if (!form) return;

    // Remove visual clutter while retaining functional elements in DOM for compatibility.
    const searchInput =
        form.querySelector("#mapSearchInput") ||
        form.querySelector("#lokasiSearch") ||
        form.querySelector('input[placeholder*="gedung"]') ||
        form.querySelector('input[placeholder*="alamat"]');

    if (searchInput) {
        const row = searchInput.closest(".map-search-row, .search-row, .geofence-search, .input-action-row, .form-row");
        if (row) row.style.display = "none";
        else searchInput.style.display = "none";
    }

    form.querySelectorAll("small, .helper-text, .map-help, .map-instruction, .geofence-instruction").forEach(el => {
        const t = (el.textContent || "").toLowerCase();
        if (t.includes("pin merah") || t.includes("ketuk peta") || t.includes("pindahkan pin")) {
            el.style.display = "none";
        }
    });

    const radiusLabel = [...form.querySelectorAll("label")].find(el =>
        /radius maksimal|radius toleransi|radius absensi/i.test(el.textContent || "")
    );
    if (radiusLabel) radiusLabel.childNodes[0].textContent = "Radius Absensi (meter)";

    const locationBtn =
        form.querySelector("#gunakanLokasiBtn") ||
        [...form.querySelectorAll("button")].find(el => /lokasi saya|lokasi sekarang/i.test(el.textContent || ""));
    if (locationBtn) locationBtn.innerHTML = "📍 Gunakan Lokasi Saya";

    const saveBtn =
        form.querySelector("#simpanPengaturanBtn") ||
        form.querySelector("#simpanLokasiBtn") ||
        [...form.querySelectorAll("button")].find(el => /simpan.*(lokasi|titik|radius)/i.test(el.textContent || ""));
    if (saveBtn) saveBtn.textContent = "Simpan Lokasi & Radius";
});

