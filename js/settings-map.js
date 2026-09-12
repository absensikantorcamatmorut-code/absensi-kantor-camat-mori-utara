(() => {
    "use strict";

    const mapEl = document.getElementById("officeRadiusMap");
    if (!mapEl) return;

    const latInput = document.getElementById("settingLatitude");
    const lngInput = document.getElementById("settingLongitude");
    const radiusInput = document.getElementById("settingRadius");
    const radiusSlider = document.getElementById("settingRadiusSlider");
    const radiusPreview = document.getElementById("settingRadiusPreview");
    const radiusBadge = document.getElementById("mapRadiusBadge");
    const mapStatus = document.getElementById("officeMapStatus");
    const searchInput = document.getElementById("settingCariAlamat");
    const searchBtn = document.getElementById("settingCariAlamatBtn");

    let map = null;
    let marker = null;
    let circle = null;
    let searchController = null;

    const fallback = {
        lat: -1.9246196360760033,
        lng: 120.96947352100753,
        radius: 150
    };

    function num(input, fallbackValue) {
        const n = Number(input?.value);
        return Number.isFinite(n) ? n : fallbackValue;
    }

    function state() {
        return {
            lat: num(latInput, fallback.lat),
            lng: num(lngInput, fallback.lng),
            radius: Math.min(2000, Math.max(20, num(radiusInput, fallback.radius)))
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

    function updateRadiusLabels(radius) {
        const rounded = Math.round(radius);
        if (radiusPreview) radiusPreview.textContent = `${rounded} meter`;
        if (radiusBadge) radiusBadge.textContent = `${rounded} m`;
    }

    function updateRadius(radius, fit = false) {
        const safe = Math.min(2000, Math.max(20, Number(radius) || fallback.radius));

        if (radiusInput && String(radiusInput.value) !== String(safe)) {
            radiusInput.value = String(safe);
        }

        if (radiusSlider && String(radiusSlider.value) !== String(safe)) {
            radiusSlider.value = String(safe);
        }

        updateRadiusLabels(safe);

        if (circle) circle.setRadius(safe);

        if (fit && map && marker) {
            map.setView(marker.getLatLng(), zoomForRadius(safe), { animate: true });
        }
    }

    function updatePoint(lat, lng, pan = true) {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        if (latInput) latInput.value = lat.toFixed(7);
        if (lngInput) lngInput.value = lng.toFixed(7);

        marker?.setLatLng([lat, lng]);
        circle?.setLatLng([lat, lng]);

        if (pan && map) {
            map.setView([lat, lng], zoomForRadius(state().radius), { animate: true });
        }
    }

    function message(text, kind = "") {
        if (!mapStatus) return;
        mapStatus.textContent = text;
        mapStatus.dataset.kind = kind;
    }

    function buildMap() {
        if (!window.L) {
            message("Peta gagal dimuat. Latitude, longitude, dan radius tetap bisa diubah manual.", "error");
            return;
        }

        const s = state();

        map = L.map(mapEl, {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([s.lat, s.lng], zoomForRadius(s.radius));

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap"
        }).addTo(map);

        circle = L.circle([s.lat, s.lng], {
            radius: s.radius,
            color: "#138a67",
            weight: 3,
            opacity: 1,
            fillColor: "#27c695",
            fillOpacity: .17
        }).addTo(map);

        const pin = L.divIcon({
            className: "office-map-pin-wrap",
            html: '<span class="office-map-pin"><i></i></span>',
            iconSize: [42, 52],
            iconAnchor: [21, 48]
        });

        marker = L.marker([s.lat, s.lng], {
            draggable: true,
            autoPan: true,
            icon: pin
        }).addTo(map);

        marker.on("dragend", () => {
            const p = marker.getLatLng();
            updatePoint(p.lat, p.lng, false);
            circle?.setLatLng(p);
            message("Titik kantor diperbarui dari pin.", "success");
        });

        map.on("click", e => {
            updatePoint(e.latlng.lat, e.latlng.lng);
            message("Titik kantor dipindahkan ke lokasi yang dipilih.", "success");
        });

        updateRadiusLabels(s.radius);

        setTimeout(() => map?.invalidateSize(), 150);
        window.addEventListener("resize", () => setTimeout(() => map?.invalidateSize(), 100));
    }

    async function searchAddress() {
        const q = String(searchInput?.value || "").trim();
        if (!q) {
            message("Masukkan nama gedung atau alamat terlebih dahulu.", "warning");
            searchInput?.focus();
            return;
        }

        searchController?.abort();
        searchController = new AbortController();

        const oldText = searchBtn?.textContent || "Cari";
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.textContent = "Mencari...";
        }

        try {
            const url =
                "https://nominatim.openstreetmap.org/search" +
                `?format=jsonv2&limit=5&countrycodes=id&q=${encodeURIComponent(q)}`;

            const res = await fetch(url, {
                headers: { "Accept": "application/json" },
                signal: searchController.signal
            });

            if (!res.ok) throw new Error("Pencarian alamat gagal.");

            const results = await res.json();
            if (!Array.isArray(results) || !results.length) {
                message("Alamat tidak ditemukan. Coba kata pencarian yang lebih lengkap.", "warning");
                return;
            }

            const first = results[0];
            const lat = Number(first.lat);
            const lng = Number(first.lon);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                throw new Error("Koordinat hasil pencarian tidak valid.");
            }

            updatePoint(lat, lng);
            message(`Lokasi ditemukan: ${first.display_name || q}`, "success");
        } catch (error) {
            if (error?.name !== "AbortError") {
                message(error?.message || "Pencarian lokasi tidak tersedia.", "error");
            }
        } finally {
            if (searchBtn) {
                searchBtn.disabled = false;
                searchBtn.textContent = oldText;
            }
        }
    }

    searchBtn?.addEventListener("click", searchAddress);
    searchInput?.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        searchAddress();
    });

    latInput?.addEventListener("change", () => {
        const s = state();
        updatePoint(s.lat, s.lng);
    });

    lngInput?.addEventListener("change", () => {
        const s = state();
        updatePoint(s.lat, s.lng);
    });

    radiusInput?.addEventListener("input", () => updateRadius(radiusInput.value, true));

    radiusSlider?.addEventListener("input", () => {
        if (radiusInput) radiusInput.value = radiusSlider.value;
        updateRadius(radiusSlider.value, false);
    });

    buildMap();
    updateRadius(state().radius, false);

    window.syncOfficeMapFromSettings = () => {
        const s = state();
        if (marker) marker.setLatLng([s.lat, s.lng]);
        if (circle) {
            circle.setLatLng([s.lat, s.lng]);
            circle.setRadius(s.radius);
        }
        if (radiusSlider) radiusSlider.value = String(s.radius);
        updateRadiusLabels(s.radius);
        map?.setView([s.lat, s.lng], zoomForRadius(s.radius));
        setTimeout(() => map?.invalidateSize(), 100);
    };
})();
