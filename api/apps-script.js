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


    const actionLogin =
        action === "login" ||
        action === "loginAdmin";


    const batasWaktu =
        actionLogin
            ? 15000
            : 30000;


    const controller =
        new AbortController();


    const timer =
        setTimeout(function() {
            controller.abort();
        }, batasWaktu);


    try {
        const response =
            await fetch(
                APPS_SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(body),

                    signal:
                        controller.signal,

                    cache:
                        "no-store"
                }
            );


        const text =
            await response.text();


        let data;


        try {
            data =
                JSON.parse(text);

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


        return res
            .status(200)
            .json(data);


    } catch (error) {
        console.error(
            "Proxy Apps Script error:",
            error
        );


        if (
            error.name === "AbortError"
        ) {
            return res.status(504).json({
                berhasil: false,
                pesan:
                    actionLogin
                        ? "Login sedang lambat. Silakan coba lagi."
                        : "Server sedang lambat memuat data. Silakan coba lagi."
            });
        }


        return res.status(502).json({
            berhasil: false,
            pesan:
                "Koneksi ke server terganggu. Silakan coba lagi."
        });


    } finally {
        clearTimeout(timer);
    }
}
