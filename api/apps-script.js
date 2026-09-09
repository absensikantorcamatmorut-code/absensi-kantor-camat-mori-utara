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
        body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body || {};

    } catch (error) {
        return res.status(400).json({
            berhasil: false,
            pesan: "Data request tidak valid."
        });
    }

    const action = String(body.action || "");

    const bolehRetry =
        action === "login" ||
        action === "loginAdmin";

    const maksimalPercobaan =
        bolehRetry ? 2 : 1;

    let errorTerakhir = null;


    for (
        let percobaan = 1;
        percobaan <= maksimalPercobaan;
        percobaan++
    ) {
        const controller = new AbortController();

        const timer = setTimeout(function() {
            controller.abort();
        }, 7000);

        try {
            const response = await fetch(
                APPS_SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(body),

                    signal: controller.signal,

                    cache: "no-store"
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);

            } catch (error) {
                console.error(
                    "Respons Apps Script tidak valid:",
                    text
                );

                throw new Error(
                    "Respons backend tidak valid."
                );
            }

            clearTimeout(timer);

            return res.status(200).json(data);

        } catch (error) {
            clearTimeout(timer);

            errorTerakhir = error;

            console.error(
                "Percobaan backend " +
                percobaan +
                " gagal:",
                error.message
            );

            if (
                !bolehRetry ||
                percobaan >= maksimalPercobaan
            ) {
                break;
            }

            await tunggu(400);
        }
    }


    if (
        errorTerakhir &&
        errorTerakhir.name === "AbortError"
    ) {
        return res.status(504).json({
            berhasil: false,
            pesan:
                "Koneksi ke server sedang lambat. Silakan coba lagi."
        });
    }


    return res.status(502).json({
        berhasil: false,
        pesan:
            "Koneksi ke server sedang terganggu. Silakan coba lagi."
    });
};


function tunggu(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}
