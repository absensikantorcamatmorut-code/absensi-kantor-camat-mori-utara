/* =====================================================
   REKAP SAYA - PEGAWAI
===================================================== */

(function () {
    const rekapSection = document.getElementById("rekapPegawaiSection");
    if (!rekapSection) return;

    const absensiSection = document.getElementById("absensiPegawaiSection");

    const navAbsensi = document.getElementById("navAbsensiPegawaiBtn");
    const navRekap = document.getElementById("navRekapPegawaiBtn");

    const bulanSelect = document.getElementById("rekapPegawaiBulan");
    const tahunSelect = document.getElementById("rekapPegawaiTahun");
    const periodeText = document.getElementById("rekapPegawaiPeriode");
    const hariKerjaText = document.getElementById("rekapPegawaiHariKerja");

    const loading = document.getElementById("rekapPegawaiLoading");
    const kosong = document.getElementById("rekapPegawaiKosong");
    const riwayatContainer = document.getElementById("riwayatRekapPegawai");

    const pegawaiToken = localStorage.getItem("pegawaiToken");

    const namaBulan = [
        "Januari", "Februari", "Maret", "April",
        "Mei", "Juni", "Juli", "Agustus",
        "September", "Oktober", "November", "Desember"
    ];

    let rekapPernahDibuka = false;


    /* =====================================================
       SESSION
    ===================================================== */

    if (!pegawaiToken) {
        kembaliKeLogin();
        return;
    }


    /* =====================================================
       WAKTU WITA
    ===================================================== */

    function ambilTanggalWITA() {
        const bagian = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Makassar",
            year: "numeric",
            month: "numeric",
            day: "numeric"
        }).formatToParts(new Date());

        const ambil = tipe =>
            bagian.find(item => item.type === tipe)?.value || "";

        return {
            tahun: Number(ambil("year")),
            bulan: Number(ambil("month")),
            tanggal: Number(ambil("day"))
        };
    }


    /* =====================================================
       TAHUN
    ===================================================== */

    function isiPilihanTahun() {
        if (!tahunSelect) return;

        const sekarang = ambilTanggalWITA();
        const tahunAwal = 2026;

        tahunSelect.innerHTML = "";

        for (let tahun = sekarang.tahun; tahun >= tahunAwal; tahun--) {
            const option = document.createElement("option");

            option.value = tahun;
            option.textContent = tahun;

            tahunSelect.appendChild(option);
        }

        bulanSelect.value = String(sekarang.bulan);
        tahunSelect.value = String(sekarang.tahun);

        updatePeriode();
    }


    /* =====================================================
       NAVIGASI
    ===================================================== */

    function bukaAbsensi() {
        if (absensiSection) absensiSection.hidden = false;
        rekapSection.hidden = true;

        navAbsensi?.classList.add("active");
        navRekap?.classList.remove("active");
    }


    async function bukaRekap() {
        if (absensiSection) absensiSection.hidden = true;
        rekapSection.hidden = false;

        navAbsensi?.classList.remove("active");
        navRekap?.classList.add("active");

        if (!rekapPernahDibuka) {
            rekapPernahDibuka = true;
            await ambilRekap();
        }
    }


    navAbsensi?.addEventListener("click", bukaAbsensi);
    navRekap?.addEventListener("click", bukaRekap);


    /* =====================================================
       FILTER
    ===================================================== */

    bulanSelect?.addEventListener("change", async function () {
        updatePeriode();
        await ambilRekap();
    });


    tahunSelect?.addEventListener("change", async function () {
        updatePeriode();
        await ambilRekap();
    });


    function updatePeriode() {
        if (!periodeText || !bulanSelect || !tahunSelect) return;

        const bulan = Number(bulanSelect.value);
        const tahun = Number(tahunSelect.value);

        periodeText.textContent =
            (namaBulan[bulan - 1] || "-") + " " + tahun;
    }


    /* =====================================================
       AMBIL REKAP
    ===================================================== */

    async function ambilRekap() {
        const token = localStorage.getItem("pegawaiToken");

        if (!token) {
            kembaliKeLogin();
            return;
        }

        const bulan = Number(bulanSelect?.value);
        const tahun = Number(tahunSelect?.value);

        if (!bulan || !tahun) return;

        tampilkanLoading();

        try {
            const hasil = await postDataRekapPegawai({
                action: "ambilRekapSaya",
                pegawaiToken: token,
                bulan: bulan,
                tahun: tahun
            });

            if (!hasil.berhasil) {
                if (sesiTidakValid(hasil.pesan)) {
                    kembaliKeLogin();
                    return;
                }

                throw new Error(
                    hasil.pesan || "Rekap gagal dimuat."
                );
            }

            renderRekap(hasil);

        } catch (error) {
            console.error(error);

            if (sesiTidakValid(error.message)) {
                kembaliKeLogin();
                return;
            }

            sembunyikanLoading();

            if (riwayatContainer) {
                riwayatContainer.innerHTML = `
                    <div class="rekap-pegawai-error">
                        <span>!</span>
                        <strong>Rekap gagal dimuat</strong>
                        <p>${escapeHTML(error.message || "Terjadi kesalahan.")}</p>
                    </div>
                `;
            }
        }
    }


    /* =====================================================
       RENDER REKAP
    ===================================================== */

    function renderRekap(hasil) {
        sembunyikanLoading();

        const rekap = hasil.rekap || {};

        updateNilai("rekapSayaH", rekap.H);
        updateNilai("rekapSayaTAP", rekap.TAP);
        updateNilai("rekapSayaS", rekap.S);
        updateNilai("rekapSayaCT", rekap.CT);
        updateNilai("rekapSayaTK", rekap.TK);
        updateNilai("rekapSayaDD", rekap.DD);
        updateNilai("rekapSayaDL", rekap.DL);
        updateNilai("rekapSayaIM", rekap.IM);
        updateNilai("rekapSayaWFH", rekap.WFH);
        updateNilai("rekapSayaMPP", rekap.MPP);

        updateNilai(
            "rekapSayaHariTerlambat",
            Number(rekap.hariTerlambat || 0) + " Hari"
        );

        updateNilai(
            "rekapSayaTotalTerlambat",
            rekap.totalTerlambat || "-"
        );

        if (hariKerjaText) {
            hariKerjaText.textContent =
                Number(hasil.hariKerja || 0) + " Hari";
        }

        if (hasil.namaBulan && periodeText) {
            periodeText.textContent =
                hasil.namaBulan + " " + hasil.tahun;
        }

        renderRiwayat(hasil.riwayat || []);
    }


    /* =====================================================
       RIWAYAT HARIAN
    ===================================================== */

    function renderRiwayat(riwayat) {
        if (!riwayatContainer || !kosong) return;

        riwayatContainer.innerHTML = "";

        if (!riwayat.length) {
            kosong.hidden = false;
            return;
        }

        kosong.hidden = true;

        riwayat.forEach(item => {
            const card = document.createElement("article");

            card.className = "riwayat-rekap-item";

            const status = String(item.status || "TK");

            card.innerHTML = `
                <div class="riwayat-rekap-top">
                    <div>
                        <small>Tanggal</small>
                        <strong>${escapeHTML(item.tanggalTampil || item.tanggal || "-")}</strong>
                    </div>

                    <span class="riwayat-status ${kelasStatus(status)}">
                        ${escapeHTML(status)}
                    </span>
                </div>

                <div class="riwayat-rekap-detail">
                    <div>
                        <small>Masuk</small>
                        <strong>${escapeHTML(item.jamMasuk || "-")}</strong>
                    </div>

                    <div>
                        <small>Keluar</small>
                        <strong>${escapeHTML(item.jamKeluar || "-")}</strong>
                    </div>

                    <div>
                        <small>Terlambat</small>
                        <strong class="${item.terlambat ? "terlambat" : ""}">
                            ${escapeHTML(item.durasiTerlambat || "-")}
                        </strong>
                    </div>
                </div>
            `;

            riwayatContainer.appendChild(card);
        });
    }


    /* =====================================================
       STATUS
    ===================================================== */

    function kelasStatus(status) {
        const daftar = {
            H: "status-h",
            TAP: "status-tap",
            S: "status-s",
            CT: "status-ct",
            TK: "status-tk",
            DD: "status-dd",
            DL: "status-dl",
            IM: "status-im",
            WFH: "status-wfh",
            MPP: "status-mpp"
        };

        return daftar[status] || "";
    }


    /* =====================================================
       LOADING
    ===================================================== */

    function tampilkanLoading() {
        if (loading) loading.hidden = false;
        if (kosong) kosong.hidden = true;

        if (riwayatContainer) {
            riwayatContainer.innerHTML = "";
        }
    }


    function sembunyikanLoading() {
        if (loading) loading.hidden = true;
    }


    /* =====================================================
       HELPER
    ===================================================== */

    function updateNilai(id, nilai) {
        const element = document.getElementById(id);
        if (!element) return;

        element.textContent =
            nilai === undefined ||
            nilai === null ||
            nilai === ""
                ? "0"
                : nilai;
    }


    function sesiTidakValid(pesan) {
        const teks = String(pesan || "").toLowerCase();

        return (
            teks.includes("sesi pegawai") ||
            teks.includes("sesi telah berakhir") ||
            teks.includes("akses pegawai tidak valid") ||
            teks.includes("akun pegawai sudah tidak aktif")
        );
    }


    function kembaliKeLogin() {
        localStorage.removeItem("nama");
        localStorage.removeItem("nip");
        localStorage.removeItem("role");
        localStorage.removeItem("pegawaiToken");
        localStorage.removeItem("adminToken");

        window.location.href = "index.html";
    }


    function escapeHTML(teks) {
        return String(teks ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       REQUEST
    ===================================================== */

    async function postDataRekapPegawai(data, timeout = 45000) {
        const controller = new AbortController();

        const timer = setTimeout(
            () => controller.abort(),
            timeout
        );

        try {
            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            const text = await response.text();

            let hasil;

            try {
                hasil = JSON.parse(text);
            } catch {
                throw new Error(
                    "Respons server tidak valid."
                );
            }

            return hasil;

        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error(
                    "Server terlalu lama merespons. Silakan coba lagi."
                );
            }

            throw error;

        } finally {
            clearTimeout(timer);
        }
    }


    /* =====================================================
       MULAI
    ===================================================== */

    isiPilihanTahun();
    bukaAbsensi();

})();
