const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwy1siAVLLsWqtnTaL4yHfgsMuKP_CsZOLMpxvfmrYg4YHZSwzgpJ1RAOlFc5xTbXlSug/exec";

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            berhasil: false,
            pesan: "Method tidak diizinkan."
        });
    }

    let body;

    try {
        body = typeof req.body === "string"
            ? JSON.parse(req.body)
            : req.body || {};
    } catch {
        return res.status(400).json({
            berhasil: false,
            pesan: "Data request tidak valid."
        });
    }

    const action = String(body.action || "");
    const actionLogin = action === "login" || action === "loginAdmin";
    const batasWaktu = actionLogin ? 45000 : 55000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), batasWaktu);

    res.setHeader("Cache-Control", "no-store");

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
                "Accept": "application/json,text/plain,*/*"
            },
            body: JSON.stringify(body),
            signal: controller.signal,
            redirect: "follow",
            cache: "no-store"
        });

        const text = await response.text();

        if (!response.ok) {
            console.error("Apps Script HTTP", response.status, text.slice(0, 300));
            return res.status(502).json({
                berhasil: false,
                pesan: "Server absensi sedang sibuk. Silakan coba lagi."
            });
        }

        try {
            return res.status(200).json(JSON.parse(text));
        } catch {
            console.error("Respons Apps Script bukan JSON:", text.slice(0, 300));
            return res.status(502).json({
                berhasil: false,
                pesan: "Respons server absensi tidak valid. Silakan coba lagi."
            });
        }
    } catch (error) {
        console.error("Proxy Apps Script error:", error);

        return res.status(error?.name === "AbortError" ? 504 : 502).json({
            berhasil: false,
            pesan: error?.name === "AbortError"
                ? "Server absensi terlalu lama merespons. Silakan coba lagi."
                : "Koneksi ke server absensi terganggu. Silakan coba lagi."
        });
    } finally {
        clearTimeout(timer);
    }
};
