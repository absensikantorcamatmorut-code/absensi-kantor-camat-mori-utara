const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwy1siAVLLsWqtnTaL4yHfgsMuKP_CsZOLMpxvfmrYg4YHZSwzgpJ1RAOlFc5xTbXlSug/exec";

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            berhasil: false,
            pesan: "Method tidak diizinkan."
        });
    }

    const controller = new AbortController();

    const timer = setTimeout(function() {
        controller.abort();
    }, 15000);

    try {
        const response = await fetch(
            APPS_SCRIPT_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    typeof req.body === "string"
                        ? req.body
                        : JSON.stringify(req.body || {}),

                signal: controller.signal
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);

        } catch (error) {
            console.error(
                "Respons Apps Script:",
                text
            );

            return res.status(502).json({
                berhasil: false,
                pesan:
                    "Respons backend tidak valid."
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(
            "Proxy Apps Script error:",
            error
        );

        if (error.name === "AbortError") {
            return res.status(504).json({
                berhasil: false,
                pesan:
                    "Backend terlalu lama merespons."
            });
        }

        return res.status(502).json({
            berhasil: false,
            pesan:
                "Koneksi ke backend gagal."
        });

    } finally {
        clearTimeout(timer);
    }
};