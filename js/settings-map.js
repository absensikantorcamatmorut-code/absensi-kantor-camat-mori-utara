(function () {
    "use strict";

    const latInput = document.getElementById("settingLatitude");
    const lngInput = document.getElementById("settingLongitude");
    const radiusInput = document.getElementById("settingRadius");
    const radiusSlider = document.getElementById("settingRadiusSlider");
    const radiusPreview = document.getElementById("settingRadiusPreview");
    const radiusBadge = document.getElementById("mapRadiusBadge");
    const mapEl = document.getElementById("officeRadiusMap");
    const mapStatus = document.getElementById("officeMapStatus");
    const navSettings = document.getElementById("navPengaturanAdminBtn");

    if (!mapEl || !latInput || !lngInput || !radiusInput) return;

    let map = null;
    let marker = null;
    let circle = null;
    let lastLat = null;
    let lastLng = null;

    function numberValue(el, fallback) {
        const value = Number(el?.value);
        return Number.isFinite(value) ? value : fallback;
    }

    function clampRadius(value) {
        return Math.min(2000, Math.max(20, Number(value) || 150));
    }

    function currentValues() {
        return {
            lat: numberValue(latInput, -1.9246196),
            lng: numberValue(lngInput, 120.9694735),
            radius: clampRadius(radiusInput.value)
        };
    }

    function setRadiusUI(radius) {
        const rounded = Math.round(clampRadius(radius));
        radiusInput.value = rounded;
        if (radiusSlider) radiusSlider.value = rounded;
        if (radiusPreview) radiusPreview.textContent = rounded.toLocaleString("id-ID") + " meter";
        if (radiusBadge) radiusBadge.textContent = rounded.toLocaleString("id-ID") + " m";
        if (circle) circle.setRadius(rounded);
    }

    function setCoordinates(lat, lng, source) {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        latInput.value = lat.toFixed(7);
        lngInput.value = lng.toFixed(7);
        lastLat = lat;
        lastLng = lng;

        if (marker) marker.setLatLng([lat, lng]);
        if (circle) circle.setLatLng([lat, lng]);
        if (map && source !== "drag") map.panTo([lat, lng], { animate: true, duration: .35 });
        if (mapStatus) mapStatus.textContent = "Titik kantor: " + lat.toFixed(6) + ", " + lng.toFixed(6) + ". Radius diperbarui langsung pada peta.";
    }

    function buildMarkerIcon() {
        return L.divIcon({
            className: "office-location-marker-wrap",
            html: '<div class="office-location-marker"><span></span></div>',
            iconSize: [34, 42],
            iconAnchor: [17, 39]
        });
    }

    function initMap() {
        if (map || !window.L) {
            if (!window.L && mapStatus) mapStatus.textContent = "Peta belum dapat dimuat. Periksa koneksi internet; latitude, longitude, dan radius tetap bisa diedit manual.";
            return;
        }

        const { lat, lng, radius } = currentValues();
        mapEl.innerHTML = "";
        map = L.map(mapEl, { zoomControl: true, attributionControl: true }).setView([lat, lng], 17);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        circle = L.circle([lat, lng], {
            radius,
            color: "#2368f2",
            weight: 2,
            opacity: .9,
            fillColor: "#2368f2",
            fillOpacity: .13
        }).addTo(map);

        marker = L.marker([lat, lng], {
            draggable: true,
            icon: buildMarkerIcon(),
            title: "Titik kantor"
        }).addTo(map);

        marker.bindPopup("<strong>Titik Kantor</strong><br>Geser penanda untuk mengubah lokasi.");
        marker.on("drag", function (event) {
            const pos = event.target.getLatLng();
            if (circle) circle.setLatLng(pos);
        });
        marker.on("dragend", function (event) {
            const pos = event.target.getLatLng();
            setCoordinates(pos.lat, pos.lng, "drag");
        });

        map.on("click", function (event) {
            setCoordinates(event.latlng.lat, event.latlng.lng, "click");
        });

        setRadiusUI(radius);
        lastLat = lat;
        lastLng = lng;
        setTimeout(() => map.invalidateSize(), 80);
    }

    function syncMap(options) {
        const { lat, lng, radius } = currentValues();
        setRadiusUI(radius);
        if (!map) initMap();
        if (!map) return;

        const coordsChanged = lat !== lastLat || lng !== lastLng;
        if (coordsChanged) setCoordinates(lat, lng, options?.source);
        else {
            if (marker) marker.setLatLng([lat, lng]);
            if (circle) circle.setLatLng([lat, lng]).setRadius(radius);
        }
        setTimeout(() => map.invalidateSize(), 50);
    }

    radiusInput.addEventListener("input", function () {
        setRadiusUI(radiusInput.value);
    });
    radiusSlider?.addEventListener("input", function () {
        setRadiusUI(radiusSlider.value);
    });
    [latInput, lngInput].forEach(input => input.addEventListener("input", function () {
        const lat = Number(latInput.value);
        const lng = Number(lngInput.value);
        if (Number.isFinite(lat) && Number.isFinite(lng)) setCoordinates(lat, lng, "typing");
    }));

    navSettings?.addEventListener("click", function () {
        setTimeout(() => syncMap({ source: "nav" }), 120);
    });
    window.addEventListener("settings-map-sync", function () {
        setTimeout(() => syncMap({ source: "settings" }), 30);
    });
    window.addEventListener("resize", function () {
        if (map) map.invalidateSize();
    });

    setRadiusUI(radiusInput.value || 150);
})();
