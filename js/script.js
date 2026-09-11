const WEB_APP_URL = "/api/apps-script";

const KANTOR = {
    latitude: -1.9246196360760033,
    longitude: 120.96947352100753,
    radius: 150
};

const JAM_ABSENSI = {
    masukMulai: "06:30:00",
    tepatWaktuSampai: "08:00:00",
    masukSelesai: "09:00:00",
    keluarMulai: "15:45:00",
    keluarSelesai: "16:30:00"
};


/* =====================================================
   CUSTOM DIALOG - FINAL LIGHT
===================================================== */

function pastikanCustomDialog() {
    if (document.getElementById("customDialogOverlay")) return;

    const style = document.createElement("style");

    style.textContent = `
        .custom-dialog-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(15, 23, 42, 0.46);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            opacity: 0;
            visibility: hidden;
            transition:
                opacity .18s ease,
                visibility .18s ease;
        }

        .custom-dialog-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .custom-dialog-box {
            width: min(430px, 100%);
            padding: 27px;
            overflow: hidden;
            text-align: center;
            border: 1px solid #dbe5ef;
            border-radius: 22px;
            background: #ffffff;
            box-shadow: 0 24px 70px rgba(15, 23, 42, .20);
            transform: translateY(14px) scale(.98);
            transition: transform .18s ease;
        }

        .custom-dialog-overlay.show .custom-dialog-box {
            transform: translateY(0) scale(1);
        }

        .custom-dialog-icon {
            width: 62px;
            height: 62px;
            margin: 0 auto 17px;
            display: grid;
            place-items: center;
            color: #2563eb;
            font-size: 27px;
            font-weight: 800;
            border: 1px solid #bfdbfe;
            border-radius: 18px;
            background: #eff6ff;
        }

        .custom-dialog-icon.success {
            color: #047857;
            border-color: #bbf7d0;
            background: #ecfdf5;
        }

        .custom-dialog-icon.danger {
            color: #b91c1c;
            border-color: #fecaca;
            background: #fef2f2;
        }

        .custom-dialog-title {
            margin: 0 0 9px;
            color: #172033;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.3;
        }

        .custom-dialog-message {
            margin: 0;
            color: #64748b;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            white-space: pre-line;
            overflow-wrap: anywhere;
        }

        .custom-dialog-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 23px;
        }

        .custom-dialog-btn {
            min-width: 125px;
            min-height: 48px;
            padding: 10px 18px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.2;
            cursor: pointer;
            border-radius: 12px;
            transition:
                background-color .15s ease,
                border-color .15s ease,
                box-shadow .15s ease,
                transform .15s ease;
        }

        .custom-dialog-btn:hover {
            transform: translateY(-1px);
        }

        .custom-dialog-btn:focus-visible {
            outline: 3px solid rgba(59, 130, 246, .22);
            outline-offset: 2px;
        }

        .custom-dialog-cancel {
            color: #475569;
            border: 1px solid #dbe3ec;
            background: #f8fafc;
        }

        .custom-dialog-cancel:hover {
            color: #334155;
            border-color: #cbd5e1;
            background: #f1f5f9;
        }

        .custom-dialog-confirm {
            color: #ffffff;
            border: 1px solid transparent;
            background: linear-gradient(90deg, #2563eb, #0ea5e9);
            box-shadow: 0 8px 20px rgba(37, 99, 235, .18);
        }

        .custom-dialog-confirm:hover {
            box-shadow: 0 10px 24px rgba(37, 99, 235, .22);
        }

        .custom-dialog-confirm.danger {
            color: #ffffff;
            background: #dc2626;
            box-shadow: 0 8px 20px rgba(220, 38, 38, .17);
        }

        .custom-dialog-confirm.danger:hover {
            background: #b91c1c;
            box-shadow: 0 10px 24px rgba(220, 38, 38, .20);
        }

        @media (max-width: 520px) {
            .custom-dialog-overlay {
                padding: 14px;
                align-items: flex-end;
            }

            .custom-dialog-box {
                width: 100%;
                padding: 23px 18px calc(18px + env(safe-area-inset-bottom));
                border-radius: 22px;
            }

            .custom-dialog-icon {
                width: 58px;
                height: 58px;
                margin-bottom: 15px;
                font-size: 25px;
                border-radius: 17px;
            }

            .custom-dialog-title {
                font-size: 21px;
            }

            .custom-dialog-message {
                font-size: 16px;
                line-height: 1.55;
            }

            .custom-dialog-actions {
                flex-direction: column-reverse;
                gap: 8px;
                margin-top: 20px;
            }

            .custom-dialog-btn {
                width: 100%;
                min-height: 50px;
                font-size: 16px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .custom-dialog-overlay,
            .custom-dialog-box,
            .custom-dialog-btn {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "customDialogOverlay";
    overlay.className = "custom-dialog-overlay";

    overlay.innerHTML = `
        <div
            class="custom-dialog-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customDialogTitle"
            aria-describedby="customDialogMessage"
        >
            <div
                class="custom-dialog-icon"
                id="customDialogIcon"
                aria-hidden="true"
            >
                ?
            </div>

            <h3
                class="custom-dialog-title"
                id="customDialogTitle"
            >
                Konfirmasi
            </h3>

            <p
                class="custom-dialog-message"
                id="customDialogMessage"
            ></p>

            <div class="custom-dialog-actions">
                <button
                    type="button"
                    class="custom-dialog-btn custom-dialog-cancel"
                    id="customDialogCancel"
                >
                    Batal
                </button>

                <button
                    type="button"
                    class="custom-dialog-btn custom-dialog-confirm"
                    id="customDialogConfirm"
                >
                    Ya, Lanjutkan
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}


function tampilkanDialogKonfirmasi(pesan, opsi = {}) {
    pastikanCustomDialog();

    return new Promise(function(resolve) {
        const overlay =
            document.getElementById("customDialogOverlay");

        const icon =
            document.getElementById("customDialogIcon");

        const title =
            document.getElementById("customDialogTitle");

        const message =
            document.getElementById("customDialogMessage");

        const cancelBtn =
            document.getElementById("customDialogCancel");

        const confirmBtn =
            document.getElementById("customDialogConfirm");

        const bahaya = Boolean(opsi.bahaya);

        icon.textContent =
            opsi.icon || (bahaya ? "!" : "?");

        icon.className =
            "custom-dialog-icon" +
            (bahaya ? " danger" : "");

        title.textContent =
            opsi.judul || "Konfirmasi";

        message.textContent =
            String(
                pesan ||
                "Apakah Anda yakin?"
            );

        cancelBtn.textContent =
            opsi.teksBatal || "Batal";

        confirmBtn.textContent =
            opsi.teksKonfirmasi ||
            "Ya, Lanjutkan";

        confirmBtn.className =
            "custom-dialog-btn custom-dialog-confirm" +
            (bahaya ? " danger" : "");

        cancelBtn.hidden = false;

        let selesaiDipanggil = false;

        function selesai(nilai) {
            if (selesaiDipanggil) return;

            selesaiDipanggil = true;

            overlay.classList.remove("show");

            document.removeEventListener(
                "keydown",
                tekanEscape
            );

            setTimeout(function() {
                resolve(nilai);
            }, 160);
        }

        function tekanEscape(event) {
            if (event.key === "Escape") {
                selesai(false);
            }
        }

        cancelBtn.onclick = function() {
            selesai(false);
        };

        confirmBtn.onclick = function() {
            selesai(true);
        };

        overlay.onclick = function(event) {
            if (event.target === overlay) {
                selesai(false);
            }
        };

        document.addEventListener(
            "keydown",
            tekanEscape
        );

        requestAnimationFrame(function() {
            overlay.classList.add("show");
            confirmBtn.focus();
        });
    });
}


function tampilkanDialogInfo(pesan, opsi = {}) {
    pastikanCustomDialog();

    const teks =
        String(pesan || "Informasi");

    const teksKecil =
        teks.toLowerCase();

    const gagal =
        /gagal|wajib|tidak|harus|error|ditolak|ditutup|belum dibuka/
            .test(teksKecil);

    const sukses =
        /berhasil|disetujui|tersimpan|selesai/
            .test(teksKecil) &&
        !gagal;

    return new Promise(function(resolve) {
        const overlay =
            document.getElementById("customDialogOverlay");

        const icon =
            document.getElementById("customDialogIcon");

        const title =
            document.getElementById("customDialogTitle");

        const message =
            document.getElementById("customDialogMessage");

        const cancelBtn =
            document.getElementById("customDialogCancel");

        const confirmBtn =
            document.getElementById("customDialogConfirm");

        icon.textContent =
            sukses
                ? "✓"
                : gagal
                    ? "!"
                    : "i";

        icon.className =
            "custom-dialog-icon" +
            (
                sukses
                    ? " success"
                    : gagal
                        ? " danger"
                        : ""
            );

        title.textContent =
            opsi.judul ||
            (
                sukses
                    ? "Berhasil"
                    : gagal
                        ? "Perhatian"
                        : "Informasi"
            );

        message.textContent = teks;

        cancelBtn.hidden = true;

        confirmBtn.textContent =
            opsi.teksTombol || "Oke";

        confirmBtn.className =
            "custom-dialog-btn custom-dialog-confirm";

        let selesaiDipanggil = false;

        function selesai() {
            if (selesaiDipanggil) return;

            selesaiDipanggil = true;

            overlay.classList.remove("show");

            document.removeEventListener(
                "keydown",
                tekanEscape
            );

            setTimeout(
                resolve,
                160
            );
        }

        function tekanEscape(event) {
            if (
                event.key === "Escape" ||
                event.key === "Enter"
            ) {
                selesai();
            }
        }

        confirmBtn.onclick = selesai;

        overlay.onclick = function(event) {
            if (event.target === overlay) {
                selesai();
            }
        };

        document.addEventListener(
            "keydown",
            tekanEscape
        );

        requestAnimationFrame(function() {
            overlay.classList.add("show");
            confirmBtn.focus();
        });
    });
}

/* =====================================================
   LOGIN PEGAWAI + ADMIN
===================================================== */

const loginPegawaiPage = document.getElementById("loginPegawaiPage");
const loginAdminPage = document.getElementById("loginAdminPage");

if (loginPegawaiPage && loginAdminPage) {
    const loginForm = document.getElementById("loginForm");
    const loginNip = document.getElementById("loginNip");
    const loginButton = document.getElementById("loginButton");
    const loginStatus = document.getElementById("loginStatus");

    const bukaLoginAdminBtn = document.getElementById("bukaLoginAdminBtn");
    const kembaliPegawaiBtn = document.getElementById("kembaliPegawaiBtn");

    const adminLoginForm = document.getElementById("adminLoginForm");
    const adminLoginNip = document.getElementById("adminLoginNip");
    const adminLoginPassword = document.getElementById("adminLoginPassword");
    const adminLoginButton = document.getElementById("adminLoginButton");
    const adminLoginStatus = document.getElementById("adminLoginStatus");

    bersihkanSesiLogin();

    bukaLoginAdminBtn.addEventListener("click", function() {
        loginPegawaiPage.hidden = true;
        loginAdminPage.hidden = false;

        loginStatus.textContent = "";
        adminLoginStatus.textContent = "";

        setTimeout(() => adminLoginNip.focus(), 50);
    });

    kembaliPegawaiBtn.addEventListener("click", function() {
        loginAdminPage.hidden = true;
        loginPegawaiPage.hidden = false;

        adminLoginForm.reset();
        adminLoginStatus.textContent = "";

        setTimeout(() => loginNip.focus(), 50);
    });


    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nip = loginNip.value.trim();

        if (!nip) {
            loginStatus.textContent = "NIP wajib diisi.";
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Memeriksa...";
        loginStatus.textContent = "Memeriksa akun...";

        try {
            const hasil = await postData({
                action: "login",
                nip: nip
            });

            if (hasil.butuhPassword) {
                throw new Error(
                    "Akun ini adalah akun admin. Gunakan tombol Login Admin."
                );
            }

            if (!hasil.berhasil) {
                throw new Error(hasil.pesan || "NIP tidak ditemukan.");
            }

            if (String(hasil.role || "").toLowerCase() === "admin") {
                throw new Error("Gunakan halaman Login Admin.");
            }

            if (!hasil.token) {
    throw new Error("Token sesi pegawai tidak diterima. Silakan coba login kembali.");
}

localStorage.setItem("nama", hasil.nama || "");
localStorage.setItem("nip", hasil.nip || nip);
localStorage.setItem("role", "pegawai");
localStorage.setItem("pegawaiToken", hasil.token);
localStorage.removeItem("adminToken");

            loginStatus.textContent = "Login berhasil ✓";
            window.location.href = "absensi.html";

        } catch (error) {
            console.error(error);
            loginStatus.textContent = error.message || "Login gagal.";

        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
    });


    adminLoginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nip = adminLoginNip.value.trim();
        const password = adminLoginPassword.value;

        if (!nip || !password) {
            adminLoginStatus.textContent =
                "ID Admin dan password wajib diisi.";
            return;
        }

        adminLoginButton.disabled = true;
        adminLoginButton.textContent = "Memverifikasi...";
        adminLoginStatus.textContent = "Memverifikasi admin...";

        try {
            const hasil = await postData({
                action: "loginAdmin",
                nip: nip,
                password: password
            });

            if (!hasil.berhasil || !hasil.token) {
                throw new Error(hasil.pesan || "Login admin gagal.");
            }

            localStorage.setItem("nama", hasil.nama || "Admin");
            localStorage.setItem("nip", hasil.nip || nip);
            localStorage.setItem("role", "admin");
            localStorage.setItem("adminToken", hasil.token);

            adminLoginPassword.value = "";
            adminLoginStatus.textContent = "Login admin berhasil ✓";

            window.location.href = "admin.html";

        } catch (error) {
            console.error(error);
            adminLoginStatus.textContent = error.message || "Login admin gagal.";

        } finally {
            adminLoginButton.disabled = false;
            adminLoginButton.textContent = "Login Admin";
        }
    });


    function bersihkanSesiLogin() {
    localStorage.removeItem("nama");
    localStorage.removeItem("nip");
    localStorage.removeItem("role");
    localStorage.removeItem("pegawaiToken");
    localStorage.removeItem("adminToken");
}
}


/* =====================================================
   ABSENSI PEGAWAI
===================================================== */

const absensiForm = document.getElementById("absensiForm");

if (absensiForm) {
    const namaLogin = localStorage.getItem("nama");
    const nipLogin = localStorage.getItem("nip");
    const roleLogin = localStorage.getItem("role");

    if (!namaLogin || !nipLogin || roleLogin !== "pegawai") {
        window.location.href = "index.html";
    }

    const namaPegawai = document.getElementById("namaPegawai");
    const nipPegawai = document.getElementById("nipPegawai");
    const avatarHuruf = document.getElementById("avatarHuruf");

    const tanggalSekarang = document.getElementById("tanggalSekarang");
    const jamSekarang = document.getElementById("jamSekarang");
    const detikSekarang = document.getElementById("detikSekarang");
    const statusHariText = document.getElementById("statusHariText");

    const keteranganAktifCard =
        document.getElementById("keteranganAktifCard");

    const keteranganAktifJenis =
        document.getElementById("keteranganAktifJenis");

    const keteranganAktifStatus =
        document.getElementById("keteranganAktifStatus");

    const statusKeteranganBadge =
        document.getElementById("statusKeteranganBadge");

    const batalkanKeteranganBtn =
        document.getElementById("batalkanKeteranganBtn");

    const modeHadirBtn = document.getElementById("modeHadirBtn");
    const modeKeteranganBtn = document.getElementById("modeKeteranganBtn");
    const modeOptions = document.querySelectorAll(".mode-option");

    const hadirContainer = document.getElementById("hadirContainer");
    const keteranganContainer =
        document.getElementById("keteranganContainer");

    const jenisAbsenInput = document.getElementById("jenisAbsen");
    const attendanceOptions =
        document.querySelectorAll(".attendance-option");

    const masukOption = document.querySelector(".masuk-option");
    const keluarOption = document.querySelector(".keluar-option");

    const lokasiBtn = document.getElementById("lokasiBtn");
    const statusLokasi = document.getElementById("statusLokasi");
    const akurasiLokasi = document.getElementById("akurasiLokasi");

    const cameraLiveContainer =
        document.getElementById("cameraLiveContainer");

    const cameraVideo = document.getElementById("cameraVideo");
    const cameraPlaceholder =
        document.getElementById("cameraPlaceholder");

    const aktifkanKameraBtn =
        document.getElementById("aktifkanKameraBtn");

    const ambilFotoBtn = document.getElementById("ambilFotoBtn");
    const cameraCanvas = document.getElementById("cameraCanvas");
    const previewFoto = document.getElementById("previewFoto");

    const photoPreviewWrapper =
        document.getElementById("photoPreviewWrapper");

    const ulangFotoBtn = document.getElementById("ulangFotoBtn");

    const checkJenis = document.getElementById("checkJenis");
    const checkLokasi = document.getElementById("checkLokasi");
    const checkFoto = document.getElementById("checkFoto");

    const submitAbsensi = document.getElementById("submitAbsensi");
    const submitText = document.getElementById("submitText");
    /* =====================================================
   ALUR ABSENSI BERTAHAP
===================================================== */

const bagianJenisAbsensi =
    attendanceOptions[0]?.closest(".form-section");

const bagianLokasi =
    lokasiBtn?.closest(".form-section");

const bagianKamera =
    cameraLiveContainer?.closest(".form-section");

const bagianKirim =
    submitAbsensi?.closest(".submit-section");

    const keteranganForm = document.getElementById("keteranganForm");
    const jenisKeterangan = document.getElementById("jenisKeterangan");

    const keteranganOptions =
        document.querySelectorAll(".keterangan-option");

    const keteranganText = document.getElementById("keteranganText");
    const jumlahKarakter = document.getElementById("jumlahKarakter");

    const checkJenisKeterangan =
        document.getElementById("checkJenisKeterangan");

    const checkIsiKeterangan =
        document.getElementById("checkIsiKeterangan");

    const submitKeterangan =
        document.getElementById("submitKeterangan");

    const submitKeteranganText =
        document.getElementById("submitKeteranganText");

    const logoutBtn = document.getElementById("logoutBtn");

    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toastIcon");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");


    let latitude = null;
    let longitude = null;
    let accuracy = null;
    let jarakKantor = null;
    let fotoBase64 = null;
    let cameraStream = null;

    let sudahMasuk = false;
    let sudahKeluar = false;

    let adaKeterangan = false;
    let jenisKeteranganHariIni = "";
    let statusKeteranganHariIni = "";
    let bisaBatalkanKeterangan = false;

    let toastTimer;


    if (namaPegawai) namaPegawai.textContent = namaLogin;
    if (nipPegawai) nipPegawai.textContent = nipLogin;

    if (avatarHuruf) {
        avatarHuruf.textContent =
            namaLogin.charAt(0).toUpperCase();
    }


    /* =====================================================
       WAKTU WITA + JAM ABSENSI
    ===================================================== */

    function ambilWaktuWITA() {
        const bagian = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Makassar",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).formatToParts(new Date());

        const ambil = tipe =>
            bagian.find(item => item.type === tipe)?.value || "00";

        return {
            jam: ambil("hour"),
            menit: ambil("minute"),
            detik: ambil("second"),
            lengkap:
                ambil("hour") +
                ":" +
                ambil("minute") +
                ":" +
                ambil("second")
        };
    }


    function statusWaktuAbsensi() {
        const sekarang = ambilWaktuWITA().lengkap;

        return {
            sekarang: sekarang,

            masukDibuka:
                sekarang >= JAM_ABSENSI.masukMulai &&
                sekarang <= JAM_ABSENSI.masukSelesai,

            masukTepatWaktu:
                sekarang >= JAM_ABSENSI.masukMulai &&
                sekarang <= JAM_ABSENSI.tepatWaktuSampai,

            masukLambat:
                sekarang > JAM_ABSENSI.tepatWaktuSampai &&
                sekarang <= JAM_ABSENSI.masukSelesai,

            keluarDibuka:
                sekarang >= JAM_ABSENSI.keluarMulai &&
                sekarang <= JAM_ABSENSI.keluarSelesai
        };
    }


    function updateJam() {
        const sekarang = new Date();

        if (tanggalSekarang) {
            tanggalSekarang.textContent =
                new Intl.DateTimeFormat("id-ID", {
                    timeZone: "Asia/Makassar",
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }).format(sekarang);
        }

        const waktu = ambilWaktuWITA();

        if (jamSekarang) {
            jamSekarang.textContent =
                waktu.jam + ":" + waktu.menit;
        }

        if (detikSekarang) {
            detikSekarang.textContent = waktu.detik;
        }

        updateKontrolWaktu();
    }


    function updateKontrolWaktu() {
        const waktu = statusWaktuAbsensi();

        const masukBoleh =
            !sudahMasuk &&
            !adaKeterangan &&
            waktu.masukDibuka;

        const keluarBoleh =
            sudahMasuk &&
            !sudahKeluar &&
            waktu.keluarDibuka;

        if (masukOption) {
            masukOption.disabled = !masukBoleh;
        }

        if (keluarOption) {
            keluarOption.disabled = !keluarBoleh;
        }

        const jenisTerpilih = jenisAbsenInput?.value || "";

        if (
            (jenisTerpilih === "Masuk" && !masukBoleh) ||
            (jenisTerpilih === "Keluar" && !keluarBoleh)
        ) {
            if (jenisAbsenInput) jenisAbsenInput.value = "";

            attendanceOptions.forEach(button => {
                button.classList.remove("active");
            });

            updateStatusForm();
        }

        updateStatusHariDenganWaktu(waktu);
    }


    function updateStatusHariDenganWaktu(waktu) {
        if (!statusHariText || adaKeterangan) return;

        if (sudahMasuk && sudahKeluar) {
            statusHariText.textContent =
                "Absensi hari ini sudah selesai";
            return;
        }

        if (sudahMasuk && !sudahKeluar) {
            if (waktu.sekarang < JAM_ABSENSI.keluarMulai) {
                statusHariText.textContent =
                    "Masuk tercatat · Keluar mulai 15.45 WITA";

            } else if (waktu.keluarDibuka) {
                statusHariText.textContent =
                    "Masuk tercatat · Absensi Keluar tersedia";

            } else {
                statusHariText.textContent =
                    "Masuk tercatat · Absensi Keluar sudah ditutup";
            }

            return;
        }

        if (waktu.sekarang < JAM_ABSENSI.masukMulai) {
            statusHariText.textContent =
                "Absensi Masuk dibuka pukul 06.30 WITA";

        } else if (waktu.masukTepatWaktu) {
            statusHariText.textContent =
                "Absensi Masuk tersedia · Tepat waktu";

        } else if (waktu.masukLambat) {
            statusHariText.textContent =
                "Absensi Masuk tersedia · Status Lambat";

        } else {
            statusHariText.textContent =
                "Absensi Masuk sudah ditutup pukul 09.00 WITA";
        }
    }


    updateJam();
    setInterval(updateJam, 1000);


    /* =====================================================
       STATUS HARI INI
    ===================================================== */

    async function cekStatusHariIni() {
        if (statusHariText) {
            statusHariText.textContent = "Memeriksa status...";
        }

        try {
            const hasil = await postData({
                action: "statusAbsensi",
                nip: nipLogin
            });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan || "Status gagal diperiksa."
                );
            }

            sudahMasuk = Boolean(hasil.sudahMasuk);
            sudahKeluar = Boolean(hasil.sudahKeluar);
            adaKeterangan = Boolean(hasil.adaKeterangan);

            jenisKeteranganHariIni =
                String(hasil.jenisKeterangan || "");

            statusKeteranganHariIni =
                String(hasil.statusKeterangan || "");

            bisaBatalkanKeterangan =
                Boolean(hasil.bisaBatalkanKeterangan);

            updatePilihanAbsensi();

        } catch (error) {
            console.error(error);

            if (statusHariText) {
                statusHariText.textContent =
                    "Status tidak dapat diperiksa";
            }
        }
    }


    function updatePilihanAbsensi() {
        updateKeteranganAktifCard();

        if (adaKeterangan) {
            if (modeHadirBtn) modeHadirBtn.disabled = true;
            if (modeKeteranganBtn) modeKeteranganBtn.disabled = true;

            if (statusHariText) {
                statusHariText.textContent =
                    "Keterangan " +
                    namaJenisKeterangan(jenisKeteranganHariIni) +
                    " · " +
                    (statusKeteranganHariIni || "Menunggu");
            }

            tutupSemuaMode();
            updateKontrolWaktu();
            return;
        }

        if (!sudahMasuk && !sudahKeluar) {
            if (modeHadirBtn) modeHadirBtn.disabled = false;
            if (modeKeteranganBtn) modeKeteranganBtn.disabled = false;
        }

        if (sudahMasuk && !sudahKeluar) {
            if (modeHadirBtn) modeHadirBtn.disabled = false;
            if (modeKeteranganBtn) modeKeteranganBtn.disabled = true;

            pilihMode("hadir");
        }

        if (sudahMasuk && sudahKeluar) {
            if (modeHadirBtn) modeHadirBtn.disabled = true;
            if (modeKeteranganBtn) modeKeteranganBtn.disabled = true;

            tutupSemuaMode();
        }

        updateKontrolWaktu();
    }


    function updateKeteranganAktifCard() {
        if (!keteranganAktifCard) return;

        if (!adaKeterangan) {
            keteranganAktifCard.hidden = true;
            return;
        }

        keteranganAktifCard.hidden = false;

        if (keteranganAktifJenis) {
            keteranganAktifJenis.textContent =
                namaJenisKeterangan(jenisKeteranganHariIni);
        }

        const status =
            statusKeteranganHariIni || "Menunggu";

        if (statusKeteranganBadge) {
            statusKeteranganBadge.textContent = status;
        }

        if (keteranganAktifStatus) {
            if (status === "Menunggu") {
                keteranganAktifStatus.textContent =
                    "Menunggu verifikasi admin";

            } else if (status === "Disetujui") {
                keteranganAktifStatus.textContent =
                    "Keterangan sudah disetujui admin";

            } else {
                keteranganAktifStatus.textContent =
                    "Status keterangan: " + status;
            }
        }

        if (batalkanKeteranganBtn) {
            batalkanKeteranganBtn.hidden =
                !bisaBatalkanKeterangan;

            batalkanKeteranganBtn.disabled = false;
            batalkanKeteranganBtn.textContent =
                "Batalkan Keterangan";
        }
    }


    if (batalkanKeteranganBtn) {
        batalkanKeteranganBtn.addEventListener(
            "click",
            async function() {
                if (!bisaBatalkanKeterangan) return;

                const yakin =
                    await tampilkanDialogKonfirmasi(
                        "Keterangan yang masih menunggu verifikasi akan dibatalkan. Setelah dibatalkan, Anda dapat memilih Hadir kembali.",
                        {
                            judul: "Batalkan Keterangan?",
                            icon: "!",
                            bahaya: true,
                            teksKonfirmasi: "Ya, Batalkan",
                            teksBatal: "Kembali"
                        }
                    );

                if (!yakin) return;

                batalkanKeteranganBtn.disabled = true;
                batalkanKeteranganBtn.textContent =
                    "Membatalkan...";

                try {
                    const hasil = await postData({
                        action: "batalKeterangan",
                        nip: nipLogin
                    });

                    if (!hasil.berhasil) {
                        throw new Error(
                            hasil.pesan ||
                            "Keterangan gagal dibatalkan."
                        );
                    }

                    tampilkanToast(
                        "success",
                        "Keterangan dibatalkan ✓",
                        hasil.pesan ||
                        "Anda dapat melakukan absensi."
                    );

                    await cekStatusHariIni();

                } catch (error) {
                    console.error(error);

                    tampilkanToast(
                        "error",
                        "Pembatalan gagal",
                        error.message
                    );

                    await cekStatusHariIni();
                }
            }
        );
    }


    /* =====================================================
       PILIH MODE
    ===================================================== */

    if (modeHadirBtn) {
        modeHadirBtn.addEventListener("click", function() {
            if (!modeHadirBtn.disabled) pilihMode("hadir");
        });
    }

    if (modeKeteranganBtn) {
        modeKeteranganBtn.addEventListener("click", function() {
            if (!modeKeteranganBtn.disabled) {
                pilihMode("keterangan");
            }
        });
    }


    function pilihMode(mode) {
        modeOptions.forEach(button => {
            button.classList.remove("active");
        });

        if (mode === "hadir") {
    modeHadirBtn?.classList.add("active");

    if (hadirContainer) {
        hadirContainer.hidden = false;
    }

    if (keteranganContainer) {
        keteranganContainer.hidden = true;
    }

    resetFormKeterangan();
    updateStatusForm();
    updateKontrolWaktu();
}

        if (mode === "keterangan") {
            modeKeteranganBtn?.classList.add("active");

            if (hadirContainer) hadirContainer.hidden = true;
            if (keteranganContainer) {
                keteranganContainer.hidden = false;
            }

            hentikanKamera();
            resetFormAbsensi();
        }
    }


    function tutupSemuaMode() {
        modeOptions.forEach(button => {
            button.classList.remove("active");
        });

        if (hadirContainer) hadirContainer.hidden = true;
        if (keteranganContainer) {
            keteranganContainer.hidden = true;
        }

        hentikanKamera();
    }


    attendanceOptions.forEach(function(button) {
    button.addEventListener("click", function() {
        if (button.disabled) return;

        attendanceOptions.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        if (jenisAbsenInput) {
            jenisAbsenInput.value =
                button.dataset.value || "";
        }

        /* Data tahap berikutnya harus diambil ulang
           jika jenis absensi diganti */
        latitude = null;
        longitude = null;
        accuracy = null;
        jarakKantor = null;
        fotoBase64 = null;

        if (statusLokasi) {
            statusLokasi.textContent =
                "Periksa Lokasi";
        }

        if (akurasiLokasi) {
            akurasiLokasi.textContent =
                "Lokasi belum diperiksa";
        }

        if (lokasiBtn) {
            lokasiBtn.classList.remove(
                "location-success",
                "location-error"
            );
        }

        if (previewFoto) {
            previewFoto.src = "";
        }

        if (photoPreviewWrapper) {
            photoPreviewWrapper.classList.remove("active");
        }

        hentikanKamera();
        updateStatusForm();
    });
});

    cekStatusHariIni();


    /* =====================================================
       GPS
    ===================================================== */

    if (lokasiBtn) {
        lokasiBtn.addEventListener("click", function() {
            if (!navigator.geolocation) {
                tampilkanToast(
                    "error",
                    "GPS tidak tersedia",
                    "Browser tidak mendukung GPS."
                );

                return;
            }

            lokasiBtn.disabled = true;

            if (statusLokasi) {
                statusLokasi.textContent =
                    "Mencari lokasi...";
            }

            if (akurasiLokasi) {
                akurasiLokasi.textContent =
                    "Mohon tunggu";
            }

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    accuracy = position.coords.accuracy;

                    jarakKantor = hitungJarakMeter(
                        latitude,
                        longitude,
                        KANTOR.latitude,
                        KANTOR.longitude
                    );

                    lokasiBtn.disabled = false;

                    if (jarakKantor <= KANTOR.radius) {
                        lokasiBtn.classList.remove(
                            "location-error"
                        );

                        lokasiBtn.classList.add(
                            "location-success"
                        );

                        if (statusLokasi) {
                            statusLokasi.textContent =
                                "Lokasi sesuai ✓";
                        }

                        if (akurasiLokasi) {
                            akurasiLokasi.textContent =
                                "Jarak ±" +
                                Math.round(jarakKantor) +
                                " m · Akurasi GPS ±" +
                                Math.round(accuracy) +
                                " m";
                        }

                        tampilkanToast(
                            "success",
                            "Lokasi sesuai",
                            "Anda berada dalam radius kantor."
                        );

                    } else {
                        lokasiBtn.classList.remove(
                            "location-success"
                        );

                        lokasiBtn.classList.add(
                            "location-error"
                        );

                        if (statusLokasi) {
                            statusLokasi.textContent =
                                "Di luar area absensi";
                        }

                        if (akurasiLokasi) {
                            akurasiLokasi.textContent =
                                "Jarak ±" +
                                Math.round(jarakKantor) +
                                " m · Maksimal " +
                                KANTOR.radius +
                                " m";
                        }

                        tampilkanToast(
                            "error",
                            "Di luar radius",
                            "Anda sekitar " +
                            Math.round(jarakKantor) +
                            " meter dari kantor."
                        );
                    }

                    updateStatusForm();
                },

                function(error) {
                    latitude = null;
                    longitude = null;
                    accuracy = null;
                    jarakKantor = null;

                    lokasiBtn.disabled = false;

                    lokasiBtn.classList.remove(
                        "location-success"
                    );

                    lokasiBtn.classList.add(
                        "location-error"
                    );

                    if (statusLokasi) {
                        statusLokasi.textContent =
                            "Lokasi gagal diambil";
                    }

                    if (akurasiLokasi) {
                        akurasiLokasi.textContent =
                            error.code === 1
                                ? "Izin lokasi ditolak"
                                : "Silakan coba kembali";
                    }

                    tampilkanToast(
                        "error",
                        "Lokasi gagal",
                        error.code === 1
                            ? "Izinkan akses lokasi pada browser."
                            : "Lokasi tidak dapat diambil."
                    );

                    updateStatusForm();
                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });
    }


    /* =====================================================
       KAMERA
    ===================================================== */

    if (aktifkanKameraBtn) {
        aktifkanKameraBtn.addEventListener(
            "click",
            aktifkanKamera
        );
    }


    async function aktifkanKamera() {
        if (!navigator.mediaDevices?.getUserMedia) {
            tampilkanToast(
                "error",
                "Kamera tidak tersedia",
                "Browser tidak mendukung akses kamera."
            );

            return;
        }

        try {
            hentikanKamera();

            cameraStream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                        width: { ideal: 720 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });

            if (cameraLiveContainer) {
                cameraLiveContainer.style.display = "flex";
            }

            if (cameraVideo) {
                cameraVideo.srcObject = cameraStream;
                cameraVideo.classList.add("active");
            }

            if (cameraPlaceholder) {
                cameraPlaceholder.style.display = "none";
            }

            if (aktifkanKameraBtn) {
                aktifkanKameraBtn.hidden = true;
            }

            if (ambilFotoBtn) {
                ambilFotoBtn.hidden = false;
            }

            if (photoPreviewWrapper) {
                photoPreviewWrapper.classList.remove(
                    "active"
                );
            }

            fotoBase64 = null;
            updateStatusForm();

        } catch (error) {
            console.error(error);

            tampilkanToast(
                "error",
                "Kamera gagal dibuka",
                "Izinkan akses kamera pada browser."
            );
        }
    }


    if (ambilFotoBtn) {
        ambilFotoBtn.addEventListener("click", function() {
            if (!cameraStream || !cameraVideo || !cameraCanvas) {
                return;
            }

            const videoWidth = cameraVideo.videoWidth;
            const videoHeight = cameraVideo.videoHeight;

            if (!videoWidth || !videoHeight) {
                tampilkanToast(
                    "error",
                    "Kamera belum siap",
                    "Tunggu sebentar lalu coba lagi."
                );

                return;
            }

            const maxSize = 720;

            let width = videoWidth;
            let height = videoHeight;

            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(
                    maxSize / width,
                    maxSize / height
                );

                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            cameraCanvas.width = width;
            cameraCanvas.height = height;

            const context =
                cameraCanvas.getContext("2d");

            context.save();
            context.translate(width, 0);
            context.scale(-1, 1);

            context.drawImage(
                cameraVideo,
                0,
                0,
                width,
                height
            );

            context.restore();

            const fotoData =
                cameraCanvas.toDataURL(
                    "image/jpeg",
                    0.65
                );

            fotoBase64 = fotoData.split(",")[1];

            if (previewFoto) {
                previewFoto.src = fotoData;
            }

            if (photoPreviewWrapper) {
                photoPreviewWrapper.classList.add(
                    "active"
                );
            }

            if (cameraLiveContainer) {
                cameraLiveContainer.style.display = "none";
            }

            if (ambilFotoBtn) {
                ambilFotoBtn.hidden = true;
            }

            if (aktifkanKameraBtn) {
                aktifkanKameraBtn.hidden = true;
            }

            hentikanKamera();
            updateStatusForm();

            tampilkanToast(
                "success",
                "Foto siap",
                "Foto absensi berhasil diambil."
            );
        });
    }


    if (ulangFotoBtn) {
        ulangFotoBtn.addEventListener("click", function() {
            fotoBase64 = null;

            if (previewFoto) previewFoto.src = "";

            if (photoPreviewWrapper) {
                photoPreviewWrapper.classList.remove(
                    "active"
                );
            }

            if (cameraLiveContainer) {
                cameraLiveContainer.style.display = "flex";
            }

            if (aktifkanKameraBtn) {
                aktifkanKameraBtn.hidden = false;
            }

            updateStatusForm();
            aktifkanKamera();
        });
    }


    function hentikanKamera() {
        if (cameraStream) {
            cameraStream
                .getTracks()
                .forEach(track => track.stop());

            cameraStream = null;
        }

        if (cameraVideo) {
            cameraVideo.srcObject = null;
            cameraVideo.classList.remove("active");
        }
    }


    /* =====================================================
       FORM ABSENSI
    ===================================================== */
function updateAlurAbsensi() {
    const jenisSiap = Boolean(jenisAbsenInput?.value);

    const lokasiSiap =
        latitude !== null &&
        longitude !== null &&
        jarakKantor !== null &&
        jarakKantor <= KANTOR.radius;

    const fotoSiap = Boolean(fotoBase64);

    if (bagianJenisAbsensi) {
        bagianJenisAbsensi.hidden = false;
    }

    if (bagianLokasi) {
        bagianLokasi.hidden = !jenisSiap;
    }

    if (bagianKamera) {
        bagianKamera.hidden =
            !jenisSiap ||
            !lokasiSiap;
    }

    if (bagianKirim) {
        bagianKirim.hidden =
            !jenisSiap ||
            !lokasiSiap ||
            !fotoSiap;
    }
}
    function updateStatusForm() {
    const jenisSiap =
        Boolean(jenisAbsenInput?.value);

    const lokasiSiap =
        latitude !== null &&
        longitude !== null &&
        jarakKantor !== null &&
        jarakKantor <= KANTOR.radius;

    const fotoSiap =
        Boolean(fotoBase64);

    const waktu = statusWaktuAbsensi();
    const jenis = jenisAbsenInput?.value || "";

    const waktuSiap =
        jenis === "Masuk"
            ? waktu.masukDibuka
            : jenis === "Keluar"
                ? waktu.keluarDibuka
                : false;

    updateRequirement(checkJenis, jenisSiap);
    updateRequirement(checkLokasi, lokasiSiap);
    updateRequirement(checkFoto, fotoSiap);

    const siap =
        jenisSiap &&
        lokasiSiap &&
        fotoSiap &&
        waktuSiap;

    if (submitAbsensi) {
        submitAbsensi.disabled = !siap;
    }

    if (submitText) {
        if (!jenisSiap) {
            submitText.textContent =
                "Lengkapi Absensi";

        } else if (!waktuSiap) {
            submitText.textContent =
                "Waktu Absensi Tidak Tersedia";

        } else {
            submitText.textContent =
                siap
                    ? "Kirim Absensi"
                    : "Lengkapi Absensi";
        }
    }

    updateAlurAbsensi();
}

    absensiForm.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const jenisDikirim =
                jenisAbsenInput?.value || "";

            const waktu = statusWaktuAbsensi();

            if (
                jenisDikirim === "Masuk" &&
                !waktu.masukDibuka
            ) {
                tampilkanToast(
                    "error",
                    "Waktu Masuk tidak tersedia",
                    waktu.sekarang < JAM_ABSENSI.masukMulai
                        ? "Absensi Masuk dibuka pukul 06.30 WITA."
                        : "Absensi Masuk sudah ditutup pukul 09.00 WITA."
                );

                updateKontrolWaktu();
                return;
            }

            if (
                jenisDikirim === "Keluar" &&
                !waktu.keluarDibuka
            ) {
                tampilkanToast(
                    "error",
                    "Waktu Keluar tidak tersedia",
                    waktu.sekarang < JAM_ABSENSI.keluarMulai
                        ? "Absensi Keluar dibuka pukul 15.45 WITA."
                        : "Absensi Keluar sudah ditutup pukul 16.30 WITA."
                );

                updateKontrolWaktu();
                return;
            }

            if (
                !jenisDikirim ||
                latitude === null ||
                longitude === null ||
                jarakKantor === null ||
                jarakKantor > KANTOR.radius ||
                !fotoBase64
            ) {
                tampilkanToast(
                    "error",
                    "Belum lengkap",
                    "Lengkapi absensi terlebih dahulu."
                );

                return;
            }

            submitAbsensi.disabled = true;

            if (submitText) {
                submitText.textContent =
                    "Mengirim absensi...";
            }

            try {
                const hasil = await postData(
                    {
                        action: "absensi",
                        nip: nipLogin,
                        jenisAbsen: jenisDikirim,
                        latitude: latitude,
                        longitude: longitude,
                        fotoBase64: fotoBase64,
                        fotoType: "image/jpeg"
                    },
                    30000
                );

                if (!hasil.berhasil) {
                    throw new Error(
                        hasil.pesan ||
                        "Absensi gagal."
                    );
                }

                tampilkanToast(
                    "success",
                    "Absensi berhasil 🎉",
                    hasil.pesan ||
                    "Absensi berhasil."
                );

                if (jenisDikirim === "Masuk") {
                    sudahMasuk = true;
                }

                if (jenisDikirim === "Keluar") {
                    sudahKeluar = true;
                }

                resetFormAbsensi();
                await cekStatusHariIni();

            } catch (error) {
                console.error(error);

                tampilkanToast(
                    "error",
                    "Absensi gagal",
                    error.message
                );

                updateStatusForm();
            }
        }
    );


    /* =====================================================
       KETERANGAN PEGAWAI
    ===================================================== */

    keteranganOptions.forEach(function(button) {
        button.addEventListener("click", function() {
            keteranganOptions.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (jenisKeterangan) {
                jenisKeterangan.value =
                    button.dataset.value || "";
            }

            updateStatusKeterangan();
        });
    });


    if (keteranganText) {
        keteranganText.addEventListener(
            "input",
            function() {
                if (jumlahKarakter) {
                    jumlahKarakter.textContent =
                        String(
                            keteranganText.value.length
                        );
                }

                updateStatusKeterangan();
            }
        );
    }


    function updateStatusKeterangan() {
        const jenisSiap =
            Boolean(jenisKeterangan?.value);

        const isiSiap =
            Boolean(
                keteranganText?.value.trim()
            );

        updateRequirement(
            checkJenisKeterangan,
            jenisSiap
        );

        updateRequirement(
            checkIsiKeterangan,
            isiSiap
        );

        const siap =
            jenisSiap && isiSiap;

        if (submitKeterangan) {
            submitKeterangan.disabled = !siap;
        }

        if (submitKeteranganText) {
            submitKeteranganText.textContent =
                siap
                    ? "Kirim Keterangan"
                    : "Lengkapi Keterangan";
        }
    }


    if (keteranganForm) {
        keteranganForm.addEventListener(
            "submit",
            async function(event) {
                event.preventDefault();

                const jenis =
                    jenisKeterangan?.value.trim();

                const isi =
                    keteranganText?.value.trim();

                if (!jenis || !isi) {
                    tampilkanToast(
                        "error",
                        "Belum lengkap",
                        "Pilih jenis dan isi keterangan."
                    );

                    return;
                }

                submitKeterangan.disabled = true;

                if (submitKeteranganText) {
                    submitKeteranganText.textContent =
                        "Mengirim keterangan...";
                }

                try {
                    const hasil = await postData({
                        action: "keterangan",
                        nip: nipLogin,
                        jenis: jenis,
                        keterangan: isi
                    });

                    if (!hasil.berhasil) {
                        throw new Error(
                            hasil.pesan ||
                            "Keterangan gagal dikirim."
                        );
                    }

                    tampilkanToast(
                        "success",
                        "Keterangan terkirim ✓",
                        hasil.pesan ||
                        "Menunggu verifikasi admin."
                    );

                    resetFormKeterangan();
                    await cekStatusHariIni();

                } catch (error) {
                    console.error(error);

                    tampilkanToast(
                        "error",
                        "Keterangan gagal",
                        error.message
                    );

                    updateStatusKeterangan();
                }
            }
        );
    }


    /* =====================================================
       RESET FORM
    ===================================================== */

    function resetFormAbsensi() {
        if (jenisAbsenInput) {
            jenisAbsenInput.value = "";
        }

        attendanceOptions.forEach(button => {
            button.classList.remove("active");
        });

        latitude = null;
        longitude = null;
        accuracy = null;
        jarakKantor = null;
        fotoBase64 = null;

        if (statusLokasi) {
            statusLokasi.textContent =
                "Ambil lokasi sekarang";
        }

        if (akurasiLokasi) {
            akurasiLokasi.textContent =
                "Lokasi belum diperiksa";
        }

        if (lokasiBtn) {
            lokasiBtn.classList.remove(
                "location-success",
                "location-error"
            );
        }

        if (previewFoto) previewFoto.src = "";

        if (photoPreviewWrapper) {
            photoPreviewWrapper.classList.remove(
                "active"
            );
        }

        if (cameraLiveContainer) {
            cameraLiveContainer.style.display = "flex";
        }

        if (cameraPlaceholder) {
            cameraPlaceholder.style.display = "flex";
        }

        if (aktifkanKameraBtn) {
            aktifkanKameraBtn.hidden = false;
        }

        if (ambilFotoBtn) {
            ambilFotoBtn.hidden = true;
        }

        hentikanKamera();
        updateStatusForm();
        updateKontrolWaktu();
    }


    function resetFormKeterangan() {
        if (jenisKeterangan) {
            jenisKeterangan.value = "";
        }

        keteranganOptions.forEach(button => {
            button.classList.remove("active");
        });

        if (keteranganText) {
            keteranganText.value = "";
        }

        if (jumlahKarakter) {
            jumlahKarakter.textContent = "0";
        }

        updateStatusKeterangan();
    }


    function updateRequirement(element, selesai) {
        if (!element) return;

        const icon =
            element.querySelector("span");

        element.classList.toggle(
            "done",
            selesai
        );

        if (icon) {
            icon.textContent =
                selesai ? "✓" : "○";
        }
    }


    function namaJenisKeterangan(kode) {
        const daftar = {
            S: "Sakit",
            CT: "Cuti",
            DD: "Dinas Dalam",
            DL: "Dinas Luar",
            IM: "Isolasi Mandiri",
            WFH: "Work from Home",
            MPP: "Masa Persiapan Pensiun"
        };

        return daftar[kode] || kode || "Keterangan";
    }


    function tampilkanToast(tipe, judul, pesan) {
        if (!toast) {
            tampilkanDialogInfo(
                pesan,
                { judul: judul }
            );

            return;
        }

        clearTimeout(toastTimer);

        if (toastTitle) {
            toastTitle.textContent = judul;
        }

        if (toastMessage) {
            toastMessage.textContent = pesan;
        }

        if (toastIcon) {
            toastIcon.textContent =
                tipe === "success" ? "✓" : "!";
        }

        toast.classList.add("show");

        toastTimer = setTimeout(function() {
            toast.classList.remove("show");
        }, 4000);
    }


    if (logoutBtn) {
        logoutBtn.addEventListener(
            "click",
            function() {
                hentikanKamera();
                logoutUser();
            }
        );
    }

    window.addEventListener(
        "beforeunload",
        hentikanKamera
    );

    updateStatusForm();
    updateStatusKeterangan();
    updateKontrolWaktu();
}

/* =====================================================
   ADMIN
===================================================== */

const adminAbsensiSection = document.getElementById("adminAbsensiSection");
const adminPegawaiSection = document.getElementById("adminPegawaiSection");
const adminKeteranganSection = document.getElementById("adminKeteranganSection");
const adminAkunSection = document.getElementById("adminAkunSection");

if (
    adminAbsensiSection ||
    adminPegawaiSection ||
    adminKeteranganSection ||
    adminAkunSection
) {
    const role = localStorage.getItem("role");
    const adminToken = localStorage.getItem("adminToken");

    if (role !== "admin" || !adminToken) {
        window.location.href = "index.html";
    }

    const logoutAdminBtn = document.getElementById("logoutAdminBtn");

    const navAbsensiBtn = document.getElementById("navAbsensiBtn");
    const navPegawaiBtn = document.getElementById("navPegawaiBtn");
    const navKeteranganBtn = document.getElementById("navKeteranganBtn");
    const navAkunAdminBtn = document.getElementById("navAkunAdminBtn");


    /* =====================================================
       ABSENSI ADMIN
    ===================================================== */

    const dataAbsensi = document.getElementById("dataAbsensi");
    const filterTanggal = document.getElementById("filterTanggal");
    const filterJenis = document.getElementById("filterJenis");
    const filterCari = document.getElementById("filterCari");
    const filterContainer = document.getElementById("filterContainer");
    const toggleFilterBtn = document.getElementById("toggleFilterBtn");
    const resetFilterBtn = document.getElementById("resetFilterBtn");

    const totalAbsensi = document.getElementById("totalAbsensi");
    const totalMasuk = document.getElementById("totalMasuk");
    const totalKeluar = document.getElementById("totalKeluar");
    const jumlahDataText = document.getElementById("jumlahDataText");

    const absensiManualBtn = document.getElementById("absensiManualBtn");


    /* =====================================================
       PEGAWAI ADMIN
    ===================================================== */

    const dataPegawai = document.getElementById("dataPegawai");
    const totalPegawai = document.getElementById("totalPegawai");
    const totalPegawaiAktif = document.getElementById("totalPegawaiAktif");

    const totalPegawaiTidakAktif =
        document.getElementById("totalPegawaiTidakAktif");

    const tambahPegawaiBtn = document.getElementById("tambahPegawaiBtn");
    const cariPegawaiAdmin = document.getElementById("cariPegawaiAdmin");

    const filterStatusPegawai =
        document.getElementById("filterStatusPegawai");


    /* =====================================================
       KETERANGAN ADMIN
    ===================================================== */

    const dataKeteranganAdmin =
        document.getElementById("dataKeteranganAdmin");

    const totalKeteranganAdmin =
        document.getElementById("totalKeteranganAdmin");

    const totalKeteranganMenunggu =
        document.getElementById("totalKeteranganMenunggu");

    const totalKeteranganDisetujui =
        document.getElementById("totalKeteranganDisetujui");

    const totalKeteranganDitolak =
        document.getElementById("totalKeteranganDitolak");

    const cariKeteranganAdmin =
        document.getElementById("cariKeteranganAdmin");

    const filterStatusKeterangan =
        document.getElementById("filterStatusKeterangan");

    const jumlahKeteranganText =
        document.getElementById("jumlahKeteranganText");


    /* =====================================================
       AKUN ADMIN
    ===================================================== */

    const akunAdminNama = document.getElementById("akunAdminNama");
    const akunAdminNip = document.getElementById("akunAdminNip");

    const gantiPasswordAdminForm =
        document.getElementById("gantiPasswordAdminForm");

    const passwordAdminLama =
        document.getElementById("passwordAdminLama");

    const passwordAdminBaru =
        document.getElementById("passwordAdminBaru");

    const konfirmasiPasswordAdmin =
        document.getElementById("konfirmasiPasswordAdmin");

    const passwordAdminStatus =
        document.getElementById("passwordAdminStatus");

    const simpanPasswordAdminBtn =
        document.getElementById("simpanPasswordAdminBtn");


    let dataTanggalAktif = [];
    let daftarPegawaiAdmin = [];
    let daftarKeteranganAdmin = [];
    let requestAdminId = 0;


/* =====================================================
   ADMIN START + CACHE
===================================================== */
const CACHE_ADMIN_MS = 60000;
const cacheAdmin = {
    absensi: { waktu: 0, kunci: "" },
    pegawai: { waktu: 0 },
    keterangan: { waktu: 0 }
};

function cacheMasihFresh(nama, kunci = "") {
    const cache = cacheAdmin[nama];
    if (!cache || Date.now() - cache.waktu >= CACHE_ADMIN_MS) return false;
    return !kunci || cache.kunci === kunci;
}

function setCacheAdmin(nama, kunci = "") {
    if (!cacheAdmin[nama]) return;
    cacheAdmin[nama].waktu = Date.now();
    if (kunci) cacheAdmin[nama].kunci = kunci;
}

function hapusCacheAdmin(...nama) {
    nama.forEach(key => {
        if (!cacheAdmin[key]) return;
        cacheAdmin[key].waktu = 0;
        if ("kunci" in cacheAdmin[key]) cacheAdmin[key].kunci = "";
    });
}

mulaiAdmin();

async function mulaiAdmin() {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") return keluarAdminLokal();

    const nama = localStorage.getItem("nama") || "Admin";
    const nip = localStorage.getItem("nip") || "";
    if (akunAdminNama) akunAdminNama.textContent = nama;
    if (akunAdminNip) akunAdminNip.textContent = nip;
    if (filterTanggal) filterTanggal.value = tanggalWITAHariIni();

    tampilkanHalamanAdmin("absensi");

    try {
        await ambilAbsensiAdmin();
    } catch (error) {
        console.error(error);
    }
}

/* =====================================================
   NAVIGASI ADMIN
===================================================== */
navAbsensiBtn?.addEventListener("click", async function() {
    tampilkanHalamanAdmin("absensi");
    const tanggal = filterTanggal?.value || "";
    if (!cacheMasihFresh("absensi", tanggal)) await ambilAbsensiAdmin();
});

navPegawaiBtn?.addEventListener("click", async function() {
    tampilkanHalamanAdmin("pegawai");
    if (cacheMasihFresh("pegawai")) {
        tampilkanPegawaiAdmin();
        isiPilihanPegawaiManual();
        return;
    }
    await ambilPegawaiAdmin();
});

navKeteranganBtn?.addEventListener("click", async function() {
    tampilkanHalamanAdmin("keterangan");
    if (cacheMasihFresh("keterangan")) {
        tampilkanKeteranganAdmin();
        return;
    }
    await ambilKeteranganAdmin();
});

navAkunAdminBtn?.addEventListener("click", function() {
    tampilkanHalamanAdmin("akun");
});

    function tampilkanHalamanAdmin(halaman) {
        [
            adminAbsensiSection,
            adminPegawaiSection,
            adminKeteranganSection,
            adminAkunSection
        ].forEach(function(section) {
            section?.classList.remove("active");
        });

        [
            navAbsensiBtn,
            navPegawaiBtn,
            navKeteranganBtn,
            navAkunAdminBtn
        ].forEach(function(button) {
            button?.classList.remove("active");
        });

        if (halaman === "absensi") {
            adminAbsensiSection?.classList.add("active");
            navAbsensiBtn?.classList.add("active");
        }

        if (halaman === "pegawai") {
            adminPegawaiSection?.classList.add("active");
            navPegawaiBtn?.classList.add("active");
        }

        if (halaman === "keterangan") {
            adminKeteranganSection?.classList.add("active");
            navKeteranganBtn?.classList.add("active");
        }

        if (halaman === "akun") {
            adminAkunSection?.classList.add("active");
            navAkunAdminBtn?.classList.add("active");
        }
    }


    /* =====================================================
       AMBIL ABSENSI ADMIN
    ===================================================== */

    async function ambilAbsensiAdmin() {
    const idRequest = ++requestAdminId;
    const tanggal = filterTanggal?.value || "";

    if (dataAbsensi) dataAbsensi.innerHTML =
        '<tr><td colspan="11" class="loading-cell">Memuat data absensi...</td></tr>';

    try {
        const hasil = await postAdmin({ action: "ambilAbsensi", tanggal });
        if (idRequest !== requestAdminId) return;
        if (!hasil.berhasil) throw new Error(hasil.pesan || "Data absensi gagal dimuat.");

        dataTanggalAktif = Array.isArray(hasil.data) ? hasil.data : [];
        setCacheAdmin("absensi", tanggal);
        tampilkanAbsensiAdmin();
    } catch (error) {
        console.error(error);
        if (dataAbsensi) dataAbsensi.innerHTML =
            '<tr><td colspan="11" class="empty-cell">' + escapeHTML(error.message) + "</td></tr>";
    }
}

    function tampilkanAbsensiAdmin() {
        const cari =
            filterCari?.value
                .trim()
                .toLowerCase() || "";

        const jenis =
            filterJenis?.value || "";

        const hasilFilter =
            dataTanggalAktif.filter(function(item) {
                const nama =
                    String(item.nama || "")
                        .toLowerCase();

                const nip =
                    String(item.nip || "")
                        .toLowerCase();

                const jenisItem =
                    String(
                        item.jenisAbsen ||
                        item.jenis ||
                        ""
                    );

                const cocokCari =
                    !cari ||
                    nama.includes(cari) ||
                    nip.includes(cari);

                const cocokJenis =
                    !jenis ||
                    jenisItem === jenis;

                return cocokCari && cocokJenis;
            });

        updateStatAbsensi(hasilFilter);

        if (jumlahDataText) {
            jumlahDataText.textContent =
                hasilFilter.length +
                " data ditemukan";
        }

        if (!dataAbsensi) return;

        if (!hasilFilter.length) {
            dataAbsensi.innerHTML =
                '<tr><td colspan="11" class="empty-cell">Tidak ada data absensi.</td></tr>';
            return;
        }

        dataAbsensi.innerHTML =
            hasilFilter.map(function(item) {
                const jenisAbsen =
                    String(
                        item.jenisAbsen ||
                        item.jenis ||
                        "-"
                    );

                const status =
                    String(item.status || "-");

                const sumber =
                    String(item.sumber || "Pegawai");

                const admin =
                    String(item.admin || "-");

                const alasan =
                    String(
                        item.alasanAdmin ||
                        item.alasan ||
                        "-"
                    );

                const maps =
                    safeURL(
                        item.lokasiMaps ||
                        item.maps ||
                        item.lokasi ||
                        ""
                    );

                const foto =
                    safeURL(
                        item.foto ||
                        item.fotoUrl ||
                        ""
                    );

                const jarak =
                    item.jarak === "" ||
                    item.jarak === null ||
                    item.jarak === undefined ||
                    Number.isNaN(Number(item.jarak))
                        ? "-"
                        : Math.round(Number(item.jarak)) + " m";

                const linkMaps = maps
                    ? '<a href="' +
                      maps +
                      '" target="_blank" rel="noopener noreferrer">Maps</a>'
                    : "-";

                const linkFoto = foto
                    ? '<a href="' +
                      foto +
                      '" target="_blank" rel="noopener noreferrer">Foto</a>'
                    : "-";

                return `
                    <tr>
                        <td>${escapeHTML(formatWaktu(item.waktu))}</td>
                        <td>${escapeHTML(item.nama || "-")}</td>
                        <td>${escapeHTML(item.nip || "-")}</td>

                        <td>
                            <span class="badge-absen ${
                                jenisAbsen === "Masuk"
                                    ? "badge-masuk"
                                    : "badge-keluar"
                            }">
                                ${escapeHTML(jenisAbsen)}
                            </span>
                        </td>

                        <td>
                            <span class="badge-status ${kelasStatusAbsensi(status)}">
                                ${escapeHTML(status)}
                            </span>
                        </td>

                        <td>${escapeHTML(jarak)}</td>
                        <td>${escapeHTML(sumber)}</td>
                        <td>${escapeHTML(admin)}</td>
                        <td>${escapeHTML(alasan)}</td>
                        <td>${linkMaps}</td>
                        <td>${linkFoto}</td>
                    </tr>
                `;
            }).join("");
    }


    function updateStatAbsensi(data) {
        const masuk =
            data.filter(function(item) {
                return (
                    String(
                        item.jenisAbsen ||
                        item.jenis ||
                        ""
                    ) === "Masuk"
                );
            }).length;

        const keluar =
            data.filter(function(item) {
                return (
                    String(
                        item.jenisAbsen ||
                        item.jenis ||
                        ""
                    ) === "Keluar"
                );
            }).length;

        if (totalAbsensi) {
            totalAbsensi.textContent = data.length;
        }

        if (totalMasuk) {
            totalMasuk.textContent = masuk;
        }

        if (totalKeluar) {
            totalKeluar.textContent = keluar;
        }
    }


    function kelasStatusAbsensi(status) {
        const nilai =
            String(status).toLowerCase();

        if (nilai.includes("tepat")) {
            return "badge-tepat";
        }

        if (nilai.includes("lambat")) {
            return "badge-lambat";
        }

        if (nilai.includes("pulang")) {
            return "badge-pulang";
        }

        return "";
    }


    filterCari?.addEventListener(
        "input",
        tampilkanAbsensiAdmin
    );

    filterJenis?.addEventListener(
        "change",
        tampilkanAbsensiAdmin
    );

    filterTanggal?.addEventListener(
        "change",
        ambilAbsensiAdmin
    );

    toggleFilterBtn?.addEventListener(
        "click",
        function() {
            filterContainer?.classList.toggle("show");
        }
    );

    resetFilterBtn?.addEventListener(
        "click",
        async function() {
            if (filterCari) {
                filterCari.value = "";
            }

            if (filterJenis) {
                filterJenis.value = "";
            }

            if (filterTanggal) {
                filterTanggal.value =
                    tanggalWITAHariIni();
            }

            await ambilAbsensiAdmin();
        }
    );


    /* =====================================================
       AMBIL PEGAWAI ADMIN
    ===================================================== */

    async function ambilPegawaiAdmin() {
    if (dataPegawai) dataPegawai.innerHTML =
        '<tr><td colspan="5" class="loading-cell">Memuat daftar pegawai...</td></tr>';

    try {
        const hasil = await postAdmin({ action: "ambilPegawai" });
        if (!hasil.berhasil) throw new Error(hasil.pesan || "Daftar pegawai gagal dimuat.");

        daftarPegawaiAdmin = Array.isArray(hasil.data) ? hasil.data : [];
        setCacheAdmin("pegawai");
        tampilkanPegawaiAdmin();
        isiPilihanPegawaiManual();
    } catch (error) {
        console.error(error);
        if (dataPegawai) dataPegawai.innerHTML =
            '<tr><td colspan="5" class="empty-cell">' + escapeHTML(error.message) + "</td></tr>";
    }
}


    function tampilkanPegawaiAdmin() {
        const cari =
            cariPegawaiAdmin?.value
                .trim()
                .toLowerCase() || "";

        const filterStatus =
            filterStatusPegawai?.value || "";

        const hasilFilter =
            daftarPegawaiAdmin.filter(function(pegawai) {
                const nama =
                    String(pegawai.nama || "")
                        .toLowerCase();

                const nip =
                    String(pegawai.nip || "")
                        .toLowerCase();

                const email =
                    String(pegawai.email || "")
                        .toLowerCase();

                const status =
                    String(
                        pegawai.status ||
                        "Aktif"
                    );

                const cocokCari =
                    !cari ||
                    nama.includes(cari) ||
                    nip.includes(cari) ||
                    email.includes(cari);

                const cocokStatus =
                    !filterStatus ||
                    status === filterStatus;

                return cocokCari && cocokStatus;
            });

        const aktif =
            daftarPegawaiAdmin.filter(function(pegawai) {
                return (
                    String(
                        pegawai.status ||
                        "Aktif"
                    ) === "Aktif"
                );
            }).length;

        if (totalPegawai) {
            totalPegawai.textContent =
                daftarPegawaiAdmin.length;
        }

        if (totalPegawaiAktif) {
            totalPegawaiAktif.textContent =
                aktif;
        }

        if (totalPegawaiTidakAktif) {
            totalPegawaiTidakAktif.textContent =
                daftarPegawaiAdmin.length -
                aktif;
        }

        const jumlahPegawaiText =
            document.getElementById("jumlahPegawaiText");

        if (jumlahPegawaiText) {
            jumlahPegawaiText.textContent =
                hasilFilter.length +
                " pegawai ditemukan";
        }

        if (!dataPegawai) return;

        if (!hasilFilter.length) {
            dataPegawai.innerHTML =
                '<tr><td colspan="5" class="empty-cell">Tidak ada pegawai.</td></tr>';
            return;
        }

        dataPegawai.innerHTML =
            hasilFilter.map(function(pegawai) {
                const status =
                    String(
                        pegawai.status ||
                        "Aktif"
                    );

                const statusBaru =
                    status === "Aktif"
                        ? "Tidak Aktif"
                        : "Aktif";

                return `
                    <tr>
                        <td>${escapeHTML(pegawai.nama || "-")}</td>
                        <td>${escapeHTML(pegawai.nip || "-")}</td>
                        <td>${escapeHTML(pegawai.email || "-")}</td>

                        <td>
                            <span class="pegawai-status-badge ${
                                status === "Aktif"
                                    ? "pegawai-status-aktif"
                                    : "pegawai-status-tidak-aktif"
                            }">
                                ${escapeHTML(status)}
                            </span>
                        </td>

                        <td>
                            <div class="pegawai-action-container">
                                <button
                                    type="button"
                                    class="pegawai-edit-btn"
                                    data-id="${escapeHTML(pegawai.id || "")}">
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="pegawai-status-btn"
                                    data-id="${escapeHTML(pegawai.id || "")}"
                                    data-status="${escapeHTML(statusBaru)}">
                                    ${
                                        status === "Aktif"
                                            ? "Nonaktifkan"
                                            : "Aktifkan"
                                    }
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");

        dataPegawai
            .querySelectorAll(".pegawai-edit-btn")
            .forEach(function(button) {
                button.addEventListener(
                    "click",
                    function() {
                        bukaEditPegawai(
                            button.dataset.id
                        );
                    }
                );
            });

        dataPegawai
            .querySelectorAll(".pegawai-status-btn")
            .forEach(function(button) {
                button.addEventListener(
                    "click",
                    async function() {
                        await ubahStatusPegawaiAdmin(
                            button.dataset.id,
                            button.dataset.status
                        );
                    }
                );
            });
    }


    cariPegawaiAdmin?.addEventListener(
        "input",
        tampilkanPegawaiAdmin
    );

    filterStatusPegawai?.addEventListener(
        "change",
        tampilkanPegawaiAdmin
    );


    /* =====================================================
       MODAL PEGAWAI
    ===================================================== */

    const pegawaiModal =
        document.getElementById("pegawaiModal");

    const pegawaiModalTitle =
        document.getElementById("pegawaiModalTitle");

    const tutupPegawaiModalBtn =
        document.getElementById("tutupPegawaiModalBtn");

    const pegawaiForm =
        document.getElementById("pegawaiForm");

    const pegawaiId =
        document.getElementById("pegawaiId");

    const pegawaiNama =
        document.getElementById("pegawaiNama");

    const pegawaiNip =
        document.getElementById("pegawaiNip");

    const pegawaiEmail =
        document.getElementById("pegawaiEmail");

    const pegawaiStatus =
        document.getElementById("pegawaiStatus");

    const batalPegawaiBtn =
        document.getElementById("batalPegawaiBtn");

    const simpanPegawaiBtn =
        document.getElementById("simpanPegawaiBtn");


    tambahPegawaiBtn?.addEventListener(
        "click",
        function() {
            pegawaiForm?.reset();

            if (pegawaiId) {
                pegawaiId.value = "";
            }

            if (pegawaiStatus) {
                pegawaiStatus.value = "Aktif";
            }

            if (pegawaiModalTitle) {
                pegawaiModalTitle.textContent =
                    "Tambah Pegawai";
            }

            bukaModal(pegawaiModal);
        }
    );


    function bukaEditPegawai(id) {
        const pegawai =
            daftarPegawaiAdmin.find(function(item) {
                return (
                    String(item.id) ===
                    String(id)
                );
            });

        if (!pegawai) return;

        if (pegawaiId) {
            pegawaiId.value =
                pegawai.id || "";
        }

        if (pegawaiNama) {
            pegawaiNama.value =
                pegawai.nama || "";
        }

        if (pegawaiNip) {
            pegawaiNip.value =
                pegawai.nip || "";
        }

        if (pegawaiEmail) {
            pegawaiEmail.value =
                pegawai.email || "";
        }

        if (pegawaiStatus) {
            pegawaiStatus.value =
                pegawai.status || "Aktif";
        }

        if (pegawaiModalTitle) {
            pegawaiModalTitle.textContent =
                "Edit Pegawai";
        }

        bukaModal(pegawaiModal);
    }


    tutupPegawaiModalBtn?.addEventListener(
        "click",
        function() {
            tutupModal(pegawaiModal);
        }
    );

    batalPegawaiBtn?.addEventListener(
        "click",
        function() {
            tutupModal(pegawaiModal);
        }
    );


    pegawaiForm?.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const nama =
                pegawaiNama.value.trim();

            const nip =
                pegawaiNip.value.trim();

            const email =
                pegawaiEmail.value.trim();

            const status =
                pegawaiStatus.value;

            if (!nama) {
                await tampilkanDialogInfo(
                    "Nama pegawai wajib diisi.",
                    {
                        judul:
                            "Data Belum Lengkap"
                    }
                );

                return;
            }

            if (!/^\d{18}$/.test(nip)) {
                await tampilkanDialogInfo(
                    "NIP harus tepat 18 digit angka.",
                    {
                        judul:
                            "NIP Tidak Valid"
                    }
                );

                return;
            }

            simpanPegawaiBtn.disabled = true;
            simpanPegawaiBtn.textContent =
                "Menyimpan...";

            try {
                const hasil =
                    await postAdmin({
                        action: "simpanPegawai",
                        id: pegawaiId.value,
                        nama: nama,
                        nip: nip,
                        email: email,
                        status: status
                    });

                if (!hasil.berhasil) {
                    throw new Error(
                        hasil.pesan ||
                        "Pegawai gagal disimpan."
                    );
                }

                tutupModal(pegawaiModal);
                hapusCacheAdmin("pegawai");
                await ambilPegawaiAdmin();

                await tampilkanDialogInfo(
                    hasil.pesan ||
                    "Data pegawai berhasil disimpan.",
                    {
                        judul:
                            "Pegawai Tersimpan"
                    }
                );

            } catch (error) {
                console.error(error);

                await tampilkanDialogInfo(
                    error.message,
                    {
                        judul:
                            "Gagal Menyimpan"
                    }
                );

            } finally {
                simpanPegawaiBtn.disabled = false;
                simpanPegawaiBtn.textContent =
                    "Simpan";
            }
        }
    );


    async function ubahStatusPegawaiAdmin(
        id,
        status
    ) {
        const pegawai =
            daftarPegawaiAdmin.find(function(item) {
                return (
                    String(item.id) ===
                    String(id)
                );
            });

        if (!pegawai) return;

        const akanAktif =
            status === "Aktif";

        const yakin =
            await tampilkanDialogKonfirmasi(
                akanAktif
                    ? "Akun " +
                      pegawai.nama +
                      " akan diaktifkan kembali dan dapat digunakan untuk login."
                    : "Akun " +
                      pegawai.nama +
                      " akan dinonaktifkan dan tidak dapat digunakan untuk login.",
                {
                    judul:
                        akanAktif
                            ? "Aktifkan Pegawai?"
                            : "Nonaktifkan Pegawai?",

                    icon:
                        akanAktif
                            ? "✓"
                            : "!",

                    bahaya:
                        !akanAktif,

                    teksKonfirmasi:
                        akanAktif
                            ? "Ya, Aktifkan"
                            : "Ya, Nonaktifkan",

                    teksBatal:
                        "Batal"
                }
            );

        if (!yakin) return;

        try {
            const hasil =
                await postAdmin({
                    action:
                        "ubahStatusPegawai",

                    id:
                        id,

                    status:
                        status
                });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan ||
                    "Status pegawai gagal diubah."
                );
            }

            hapusCacheAdmin("pegawai");
            await ambilPegawaiAdmin();

            await tampilkanDialogInfo(
                hasil.pesan ||
                (
                    akanAktif
                        ? "Pegawai berhasil diaktifkan."
                        : "Pegawai berhasil dinonaktifkan."
                ),
                {
                    judul:
                        akanAktif
                            ? "Pegawai Diaktifkan"
                            : "Pegawai Dinonaktifkan"
                }
            );

        } catch (error) {
            console.error(error);

            await tampilkanDialogInfo(
                error.message,
                {
                    judul:
                        "Perubahan Gagal"
                }
            );
        }
    }
    /* =====================================================
    KETERANGAN ADMIN
    ===================================================== */

    async function ambilKeteranganAdmin() {
    if (dataKeteranganAdmin) dataKeteranganAdmin.innerHTML =
        '<tr><td colspan="7" class="loading-cell">Memuat data keterangan...</td></tr>';

    try {
        const hasil = await postAdmin({ action: "ambilKeteranganAdmin" });
        if (!hasil.berhasil) throw new Error(hasil.pesan || "Data keterangan gagal dimuat.");

        daftarKeteranganAdmin = Array.isArray(hasil.data) ? hasil.data : [];
        setCacheAdmin("keterangan");
        tampilkanKeteranganAdmin();
    } catch (error) {
        console.error(error);
        if (dataKeteranganAdmin) dataKeteranganAdmin.innerHTML =
            '<tr><td colspan="7" class="empty-cell">' + escapeHTML(error.message) + "</td></tr>";
    }
}


    function tampilkanKeteranganAdmin() {
        const cari = cariKeteranganAdmin?.value.trim().toLowerCase() || "";
        const filterStatus = filterStatusKeterangan?.value || "";

        const hasilFilter = daftarKeteranganAdmin.filter(function(item) {
            const cocokCari =
                !cari ||
                String(item.nama || "").toLowerCase().includes(cari) ||
                String(item.nip || "").toLowerCase().includes(cari) ||
                String(item.jenis || "").toLowerCase().includes(cari) ||
                namaJenisKeteranganAdmin(item.jenis).toLowerCase().includes(cari) ||
                String(item.keterangan || "").toLowerCase().includes(cari);

            const cocokStatus =
                !filterStatus ||
                String(item.status || "") === filterStatus;

            return cocokCari && cocokStatus;
        });

        updateStatKeteranganAdmin();

        if (jumlahKeteranganText) {
            jumlahKeteranganText.textContent =
                hasilFilter.length + " keterangan ditemukan";
        }

        if (!dataKeteranganAdmin) return;

        if (!hasilFilter.length) {
            dataKeteranganAdmin.innerHTML =
                '<tr><td colspan="7" class="empty-cell">Tidak ada data keterangan.</td></tr>';
            return;
        }

        dataKeteranganAdmin.innerHTML = hasilFilter.map(function(item) {
            const status = String(item.status || "Menunggu");
            const jenis = namaJenisKeteranganAdmin(item.jenis);

            let aksi = "-";

            if (status === "Menunggu") {
                aksi = `
                    <div class="keterangan-action-container">
                        <button
                            type="button"
                            class="keterangan-setujui-btn"
                            data-id="${escapeHTML(item.id || "")}">
                            Setujui
                        </button>

                        <button
                            type="button"
                            class="keterangan-tolak-btn"
                            data-id="${escapeHTML(item.id || "")}">
                            Tolak
                        </button>
                    </div>
                `;
            }

            return `
                <tr>
                    <td>${escapeHTML(formatWaktu(item.waktu))}</td>
                    <td>${escapeHTML(item.nama || "-")}</td>
                    <td>${escapeHTML(item.nip || "-")}</td>

                    <td>
                        <span class="keterangan-jenis-badge">
                            ${escapeHTML(jenis)}
                        </span>
                    </td>

                    <td class="keterangan-text-cell">
                        ${escapeHTML(item.keterangan || "-")}
                    </td>

                    <td>
                        <span class="keterangan-status-badge ${kelasStatusKeteranganAdmin(status)}">
                            ${escapeHTML(status)}
                        </span>
                    </td>

                    <td>${aksi}</td>
                </tr>
            `;
        }).join("");

        dataKeteranganAdmin
            .querySelectorAll(".keterangan-setujui-btn")
            .forEach(function(button) {
                button.addEventListener("click", async function() {
                    await verifikasiKeteranganAdmin(
                        button.dataset.id,
                        "Disetujui"
                    );
                });
            });

        dataKeteranganAdmin
            .querySelectorAll(".keterangan-tolak-btn")
            .forEach(function(button) {
                button.addEventListener("click", async function() {
                    await verifikasiKeteranganAdmin(
                        button.dataset.id,
                        "Ditolak"
                    );
                });
            });
    }


    function updateStatKeteranganAdmin() {
        const total = daftarKeteranganAdmin.length;

        const menunggu = daftarKeteranganAdmin.filter(
            item => String(item.status || "") === "Menunggu"
        ).length;

        const disetujui = daftarKeteranganAdmin.filter(
            item => String(item.status || "") === "Disetujui"
        ).length;

        const ditolak = daftarKeteranganAdmin.filter(
            item => String(item.status || "") === "Ditolak"
        ).length;

        if (totalKeteranganAdmin) totalKeteranganAdmin.textContent = total;
        if (totalKeteranganMenunggu) totalKeteranganMenunggu.textContent = menunggu;
        if (totalKeteranganDisetujui) totalKeteranganDisetujui.textContent = disetujui;
        if (totalKeteranganDitolak) totalKeteranganDitolak.textContent = ditolak;
    }


    function namaJenisKeteranganAdmin(kode) {
        const daftar = {
            S: "Sakit",
            CT: "Cuti",
            DD: "Dinas Dalam",
            DL: "Dinas Luar",
            IM: "Isolasi Mandiri",
            WFH: "Work from Home",
            MPP: "Masa Persiapan Pensiun"
        };

        const nilai = String(kode || "").trim().toUpperCase();
        return daftar[nilai] || nilai || "-";
    }


    function kelasStatusKeteranganAdmin(status) {
        const nilai = String(status || "").trim().toLowerCase();

        if (nilai === "menunggu") return "status-menunggu";
        if (nilai === "disetujui") return "status-disetujui";
        if (nilai === "ditolak") return "status-ditolak";
        if (nilai === "dibatalkan") return "status-dibatalkan";

        return "";
    }


    async function verifikasiKeteranganAdmin(id, statusBaru) {
        const item = daftarKeteranganAdmin.find(
            data => String(data.id) === String(id)
        );

        if (!item) {
            await tampilkanDialogInfo(
                "Data keterangan tidak ditemukan. Muat ulang data lalu coba kembali.",
                { judul: "Data Tidak Ditemukan" }
            );
            return;
        }

        if (String(item.status) !== "Menunggu") {
            await tampilkanDialogInfo(
                "Keterangan ini sudah tidak berstatus Menunggu sehingga tidak dapat diverifikasi lagi.",
                { judul: "Status Sudah Berubah" }
            );

            await ambilKeteranganAdmin();
            return;
        }

        const disetujui = statusBaru === "Disetujui";

        const yakin = await tampilkanDialogKonfirmasi(
            item.nama +
            "\n" +
            namaJenisKeteranganAdmin(item.jenis) +
            "\n\n" +
            item.keterangan,
            {
                judul: disetujui
                    ? "Setujui Keterangan?"
                    : "Tolak Keterangan?",

                icon: disetujui ? "✓" : "!",
                bahaya: !disetujui,

                teksKonfirmasi: disetujui
                    ? "Setujui Keterangan"
                    : "Tolak Keterangan",

                teksBatal: "Batal"
            }
        );

        if (!yakin) return;

        const selectorId =
            typeof CSS !== "undefined" &&
            typeof CSS.escape === "function"
                ? CSS.escape(String(id))
                : String(id).replace(/["\\]/g, "\\$&");

        const semuaTombol =
            dataKeteranganAdmin?.querySelectorAll(
                '[data-id="' + selectorId + '"]'
            ) || [];

        semuaTombol.forEach(button => button.disabled = true);

        try {
            const hasil = await postAdmin({
                action: "verifikasiKeteranganAdmin",
                id: id,
                status: statusBaru
            });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan ||
                    "Keterangan gagal diverifikasi."
                );
            }

            hapusCacheAdmin("keterangan");
            await ambilKeteranganAdmin();

            await tampilkanDialogInfo(
                hasil.pesan ||
                (
                    disetujui
                        ? "Keterangan berhasil disetujui."
                        : "Keterangan berhasil ditolak."
                ),
                {
                    judul: disetujui
                        ? "Keterangan Disetujui"
                        : "Keterangan Ditolak"
                }
            );

        } catch (error) {
            console.error(error);

            await tampilkanDialogInfo(
                error.message,
                { judul: "Verifikasi Gagal" }
            );

            await ambilKeteranganAdmin();
        }
    }


    cariKeteranganAdmin?.addEventListener(
        "input",
        tampilkanKeteranganAdmin
    );

    filterStatusKeterangan?.addEventListener(
        "change",
        tampilkanKeteranganAdmin
    );


    /* =====================================================
       ABSENSI MANUAL ADMIN
    ===================================================== */

    const absensiManualModal =
        document.getElementById("absensiManualModal");

    const tutupAbsensiManualBtn =
        document.getElementById("tutupAbsensiManualBtn");

    const absensiManualForm =
        document.getElementById("absensiManualForm");

    const manualPegawai =
        document.getElementById("manualPegawai");

    const manualJenisAbsen =
        document.getElementById("manualJenisAbsen");

    const manualTanggal =
        document.getElementById("manualTanggal");

    const manualWaktu =
        document.getElementById("manualWaktu");

    const manualAlasan =
        document.getElementById("manualAlasan");

    const batalAbsensiManualBtn =
        document.getElementById("batalAbsensiManualBtn");

    const simpanAbsensiManualBtn =
        document.getElementById("simpanAbsensiManualBtn");


    absensiManualBtn?.addEventListener(
        "click",
        async function() {
            if (!daftarPegawaiAdmin.length) {
                await ambilPegawaiAdmin();
            }

            isiPilihanPegawaiManual();

            if (manualTanggal) {
                manualTanggal.value = tanggalWITAHariIni();
            }

            if (manualWaktu) {
                manualWaktu.value = waktuWITASekarang();
            }

            if (manualJenisAbsen) {
                manualJenisAbsen.value = "Masuk";
            }

            if (manualAlasan) {
                manualAlasan.value = "";
            }

            bukaModal(absensiManualModal);
        }
    );


    function isiPilihanPegawaiManual() {
        if (!manualPegawai) return;

        const pegawaiAktif = daftarPegawaiAdmin
            .filter(
                pegawai =>
                    String(pegawai.status || "Aktif") === "Aktif"
            )
            .sort(
                (a, b) =>
                    String(a.nama || "").localeCompare(
                        String(b.nama || ""),
                        "id"
                    )
            );

        manualPegawai.innerHTML =
            '<option value="">Pilih pegawai</option>' +
            pegawaiAktif.map(function(pegawai) {
                return (
                    '<option value="' +
                    escapeHTML(pegawai.nip || "") +
                    '">' +
                    escapeHTML(pegawai.nama || "-") +
                    " — " +
                    escapeHTML(pegawai.nip || "") +
                    "</option>"
                );
            }).join("");
    }


    tutupAbsensiManualBtn?.addEventListener(
        "click",
        () => tutupModal(absensiManualModal)
    );

    batalAbsensiManualBtn?.addEventListener(
        "click",
        () => tutupModal(absensiManualModal)
    );


    absensiManualForm?.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const nip = manualPegawai.value;
            const jenisAbsen = manualJenisAbsen.value;
            const tanggal = manualTanggal.value;
            const waktu = manualWaktu.value;
            const alasan = manualAlasan.value.trim();

            if (!nip || !jenisAbsen || !tanggal || !waktu || !alasan) {
                await tampilkanDialogInfo(
                    "Pegawai, jenis absensi, tanggal, waktu, dan alasan wajib diisi.",
                    { judul: "Absensi Belum Lengkap" }
                );
                return;
            }

            const pegawaiDipilih = daftarPegawaiAdmin.find(
                pegawai => String(pegawai.nip) === String(nip)
            );

            const yakin = await tampilkanDialogKonfirmasi(
                (pegawaiDipilih?.nama || nip) +
                "\n" +
                jenisAbsen +
                " · " +
                tanggal +
                " " +
                waktu +
                " WITA\n\nAlasan: " +
                alasan,
                {
                    judul: "Simpan Absensi Manual?",
                    icon: "✓",
                    teksKonfirmasi: "Ya, Simpan",
                    teksBatal: "Batal"
                }
            );

            if (!yakin) return;

            simpanAbsensiManualBtn.disabled = true;
            simpanAbsensiManualBtn.textContent = "Menyimpan...";

            try {
                const hasil = await postAdmin(
                    {
                        action: "absensiManual",
                        nip: nip,
                        jenisAbsen: jenisAbsen,
                        tanggal: tanggal,
                        waktu: waktu,
                        alasan: alasan
                    },
                    30000
                );

                if (!hasil.berhasil) {
                    throw new Error(
                        hasil.pesan ||
                        "Absensi manual gagal disimpan."
                    );
                }

                tutupModal(absensiManualModal);

                if (filterTanggal) {
                    filterTanggal.value = tanggal;
                }

                hapusCacheAdmin("absensi");
                tampilkanHalamanAdmin("absensi");
                await ambilAbsensiAdmin();

                await tampilkanDialogInfo(
                    hasil.pesan ||
                    "Absensi manual berhasil disimpan.",
                    { judul: "Absensi Tersimpan" }
                );

            } catch (error) {
                console.error(error);

                await tampilkanDialogInfo(
                    error.message,
                    { judul: "Absensi Manual Gagal" }
                );

            } finally {
                simpanAbsensiManualBtn.disabled = false;
                simpanAbsensiManualBtn.textContent = "Simpan";
            }
        }
    );


    /* =====================================================
       PASSWORD ADMIN
    ===================================================== */

    gantiPasswordAdminForm?.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const passwordLama = passwordAdminLama.value;
            const passwordBaru = passwordAdminBaru.value;
            const konfirmasi = konfirmasiPasswordAdmin.value;

            if (!passwordLama || !passwordBaru || !konfirmasi) {
                setStatusPassword("Semua kolom wajib diisi.", false);
                return;
            }

            if (passwordBaru.length < 8) {
                setStatusPassword(
                    "Password baru minimal 8 karakter.",
                    false
                );
                return;
            }

            if (passwordBaru !== konfirmasi) {
                setStatusPassword(
                    "Konfirmasi password tidak sama.",
                    false
                );
                return;
            }

            simpanPasswordAdminBtn.disabled = true;
            simpanPasswordAdminBtn.textContent = "Menyimpan...";

            try {
                const hasil = await postAdmin({
                    action: "gantiPasswordAdmin",
                    passwordLama: passwordLama,
                    passwordBaru: passwordBaru
                });

                if (!hasil.berhasil) {
                    throw new Error(
                        hasil.pesan ||
                        "Password gagal diubah."
                    );
                }

                gantiPasswordAdminForm.reset();

                setStatusPassword(
                    hasil.pesan ||
                    "Password berhasil diubah ✓",
                    true
                );

                await tampilkanDialogInfo(
                    hasil.pesan ||
                    "Password admin berhasil diubah.",
                    { judul: "Password Berhasil Diubah" }
                );

            } catch (error) {
                console.error(error);
                setStatusPassword(error.message, false);

            } finally {
                simpanPasswordAdminBtn.disabled = false;
                simpanPasswordAdminBtn.textContent =
                    "Simpan Password";
            }
        }
    );


    function setStatusPassword(pesan, berhasil) {
        if (!passwordAdminStatus) return;

        passwordAdminStatus.textContent = pesan;

        passwordAdminStatus.style.color =
            berhasil
                ? "var(--green)"
                : "var(--red)";
    }


    /* =====================================================
       LOGOUT ADMIN
    ===================================================== */

    logoutAdminBtn?.addEventListener(
        "click",
        async function() {
            const yakin = await tampilkanDialogKonfirmasi(
                "Sesi admin akan diakhiri dan Anda akan kembali ke halaman login.",
                {
                    judul: "Keluar dari Admin?",
                    icon: "↪",
                    bahaya: true,
                    teksKonfirmasi: "Ya, Keluar",
                    teksBatal: "Tetap di Sini"
                }
            );

            if (!yakin) return;

            logoutAdminBtn.disabled = true;

            try {
                await postData({
                    action: "logoutAdmin",
                    adminToken:
                        localStorage.getItem("adminToken") || ""
                });
            } catch (error) {
                console.error(error);
            }

            keluarAdminLokal();
        }
    );


    function keluarAdminLokal() {
        localStorage.removeItem("nama");
        localStorage.removeItem("nip");
        localStorage.removeItem("role");
        localStorage.removeItem("adminToken");

        window.location.href = "index.html";
    }


    /* =====================================================
       REQUEST ADMIN
    ===================================================== */

    async function postAdmin(data, timeout = 20000) {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            keluarAdminLokal();
            throw new Error("Sesi admin tidak tersedia.");
        }

        const hasil = await postData(
            {
                ...data,
                adminToken: token
            },
            timeout
        );

        if (
            !hasil.berhasil &&
            /sesi admin|session admin|token admin/i.test(
                String(hasil.pesan || "")
            )
        ) {
            keluarAdminLokal();

            throw new Error(
                hasil.pesan ||
                "Sesi admin telah berakhir."
            );
        }

        return hasil;
    }


    /* =====================================================
       MODAL ADMIN
    ===================================================== */

    function bukaModal(modal) {
        if (!modal) return;

        modal.hidden = false;
        document.body.style.overflow = "hidden";
    }


    function tutupModal(modal) {
        if (!modal) return;

        modal.hidden = true;
        document.body.style.overflow = "";
    }


    document
        .querySelectorAll(".admin-modal-backdrop")
        .forEach(function(backdrop) {
            backdrop.addEventListener(
                "click",
                function() {
                    tutupModal(
                        backdrop.closest(".admin-modal")
                    );
                }
            );
        });


    document.addEventListener(
        "keydown",
        function(event) {
            if (event.key !== "Escape") return;

            document
                .querySelectorAll(".admin-modal")
                .forEach(function(modal) {
                    if (!modal.hidden) {
                        tutupModal(modal);
                    }
                });
        }
    );

}

/* =====================================================
   REQUEST SERVER
===================================================== */

async function postData(data, timeout = null) {
    const action = String(data?.action || "");

    const bolehRetry =
        action === "login" ||
        action === "loginAdmin";

    const batasWaktu =
        timeout !== null
            ? timeout
            : bolehRetry
                ? 8000
                : 20000;

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
        }, batasWaktu);

        try {
            const response = await fetch(
                WEB_APP_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(data),

                    signal: controller.signal,

                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Server merespons dengan status " +
                    response.status +
                    "."
                );
            }

            const text = await response.text();

            let hasil;

            try {
                hasil = JSON.parse(text);

            } catch (error) {
                console.error(
                    "Respons server:",
                    text
                );

                throw new Error(
                    "Respons server tidak valid."
                );
            }

            return hasil;

        } catch (error) {
            errorTerakhir = error;

            const masalahJaringan =
                error.name === "AbortError" ||
                error instanceof TypeError ||
                error.message ===
                    "Respons server tidak valid.";

            if (
                !bolehRetry ||
                !masalahJaringan ||
                percobaan >= maksimalPercobaan
            ) {
                if (error.name === "AbortError") {
                    throw new Error(
                        "Koneksi ke server terlalu lama. Silakan coba lagi."
                    );
                }

                if (error instanceof TypeError) {
                    throw new Error(
                        "Koneksi ke server terganggu. Periksa internet lalu coba lagi."
                    );
                }

                throw error;
            }

            console.warn(
                "Request " +
                action +
                " gagal. Mencoba kembali..."
            );

            await tungguRequest(700);

        } finally {
            clearTimeout(timer);
        }
    }

    throw (
        errorTerakhir ||
        new Error("Request gagal.")
    );
}


function tungguRequest(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}


/* =====================================================
   WITA
===================================================== */

function tanggalWITAHariIni() {
    const bagian = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Makassar",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).formatToParts(new Date());

    const tahun =
        bagian.find(
            item => item.type === "year"
        )?.value;

    const bulan =
        bagian.find(
            item => item.type === "month"
        )?.value;

    const hari =
        bagian.find(
            item => item.type === "day"
        )?.value;

    return (
        tahun +
        "-" +
        bulan +
        "-" +
        hari
    );
}


function waktuWITASekarang() {
    const bagian = new Intl.DateTimeFormat(
        "en-GB",
        {
            timeZone: "Asia/Makassar",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    ).formatToParts(new Date());

    const jam =
        bagian.find(
            item => item.type === "hour"
        )?.value || "00";

    const menit =
        bagian.find(
            item => item.type === "minute"
        )?.value || "00";

    return jam + ":" + menit;
}


function formatWaktu(value) {
    if (!value) return "-";

    const tanggal = new Date(value);

    if (
        Number.isNaN(
            tanggal.getTime()
        )
    ) {
        return String(value);
    }

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            timeZone: "Asia/Makassar",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    ).format(tanggal);
}


/* =====================================================
   JARAK GPS
===================================================== */

function hitungJarakMeter(
    lat1,
    lon1,
    lat2,
    lon2
) {
    const R = 6371000;

    const rad =
        nilai =>
            nilai *
            Math.PI /
            180;

    const dLat =
        rad(
            lat2 -
            lat1
        );

    const dLon =
        rad(
            lon2 -
            lon1
        );

    const a =
        Math.sin(
            dLat / 2
        ) ** 2 +

        Math.cos(
            rad(lat1)
        ) *

        Math.cos(
            rad(lat2)
        ) *

        Math.sin(
            dLon / 2
        ) ** 2;

    return (
        R *
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        )
    );
}


/* =====================================================
   LOGOUT PEGAWAI
===================================================== */

async function logoutUser() {
    const pegawaiToken = localStorage.getItem("pegawaiToken");

    if (pegawaiToken) {
        try {
            await postData({
                action: "logoutPegawai",
                pegawaiToken: pegawaiToken
            });
        } catch (error) {
            console.error("Gagal menghapus sesi pegawai:", error);
        }
    }

    localStorage.removeItem("nama");
    localStorage.removeItem("nip");
    localStorage.removeItem("role");
    localStorage.removeItem("pegawaiToken");
    localStorage.removeItem("adminToken");

    window.location.href = "index.html";
}


/* =====================================================
   KEAMANAN OUTPUT
===================================================== */

function escapeHTML(value) {
    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function safeURL(value) {
    const url =
        String(
            value ?? ""
        ).trim();

    if (
        url.startsWith("https://") ||
        url.startsWith("http://")
    ) {
        return escapeHTML(url);
    }

    return "";
}
