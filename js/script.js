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

function terapkanPengaturanAbsensi(p = {}) {
    const jam = v => v ? String(v).slice(0, 5) + ":00" : null;
    if (Number.isFinite(Number(p.latitude))) KANTOR.latitude = Number(p.latitude);
    if (Number.isFinite(Number(p.longitude))) KANTOR.longitude = Number(p.longitude);
    if (Number.isFinite(Number(p.radius))) KANTOR.radius = Number(p.radius);
    if (jam(p.masukMulai)) JAM_ABSENSI.masukMulai = jam(p.masukMulai);
    if (jam(p.jamLambat)) JAM_ABSENSI.tepatWaktuSampai = jam(p.jamLambat);
    if (jam(p.masukSelesai)) JAM_ABSENSI.masukSelesai = jam(p.masukSelesai);
    if (jam(p.keluarMulai)) JAM_ABSENSI.keluarMulai = jam(p.keluarMulai);
    if (jam(p.keluarSelesai)) JAM_ABSENSI.keluarSelesai = jam(p.keluarSelesai);
}

function jamTampil(value) {
    return String(value || "").slice(0, 5).replace(":", ".");
}


/* =====================================================
   CUSTOM DIALOG - FINAL BUBBLE
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
            overflow: hidden;
            background: rgba(15, 23, 42, .38);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            opacity: 0;
            visibility: hidden;
            transition:
                opacity .22s ease,
                visibility .22s ease;
        }

        .custom-dialog-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        /* =============================================
           EFEK GELEMBUNG DARI TENGAH
        ============================================= */

        .custom-dialog-bubble-layer {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 10px;
            height: 10px;
            pointer-events: none;
            transform: translate(-50%, -50%);
        }

        .custom-dialog-bubble-layer::before,
        .custom-dialog-bubble-layer::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(.1);
            opacity: 0;
            border: 1px solid rgba(255, 255, 255, .38);
            background:
                radial-gradient(
                    circle at 35% 30%,
                    rgba(255,255,255,.45),
                    rgba(59,130,246,.12) 35%,
                    rgba(14,165,233,.04) 70%
                );
            box-shadow:
                inset 0 0 18px rgba(255,255,255,.18),
                0 0 35px rgba(37,99,235,.10);
        }

        .custom-dialog-overlay.show
        .custom-dialog-bubble-layer::before {
            animation:
                dialogBubbleWaveOne .75s
                cubic-bezier(.2,.8,.2,1)
                forwards;
        }

        .custom-dialog-overlay.show
        .custom-dialog-bubble-layer::after {
            animation:
                dialogBubbleWaveTwo .85s
                cubic-bezier(.2,.8,.2,1)
                .08s forwards;
        }

        @keyframes dialogBubbleWaveOne {
            0% {
                width: 20px;
                height: 20px;
                opacity: .75;
                transform:
                    translate(-50%, -50%)
                    scale(.15);
            }

            55% {
                opacity: .34;
            }

            100% {
                width: 520px;
                height: 520px;
                opacity: 0;
                transform:
                    translate(-50%, -50%)
                    scale(1);
            }
        }

        @keyframes dialogBubbleWaveTwo {
            0% {
                width: 15px;
                height: 15px;
                opacity: .65;
                transform:
                    translate(-50%, -50%)
                    scale(.12);
            }

            100% {
                width: 380px;
                height: 380px;
                opacity: 0;
                transform:
                    translate(-50%, -50%)
                    scale(1);
            }
        }

        /* Bubble kecil */

        .custom-dialog-floating-bubbles {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 280px;
            height: 280px;
            pointer-events: none;
            transform: translate(-50%, -50%);
        }

        .custom-dialog-floating-bubbles span {
            position: absolute;
            display: block;
            border-radius: 50%;
            opacity: 0;
            background:
                radial-gradient(
                    circle at 30% 28%,
                    rgba(255,255,255,.65),
                    rgba(147,197,253,.28) 40%,
                    rgba(59,130,246,.07) 75%
                );
            border: 1px solid rgba(255,255,255,.5);
            box-shadow:
                inset 0 0 9px rgba(255,255,255,.22),
                0 5px 18px rgba(37,99,235,.08);
        }

        .custom-dialog-floating-bubbles span:nth-child(1) {
            width: 28px;
            height: 28px;
            left: 10%;
            top: 48%;
        }

        .custom-dialog-floating-bubbles span:nth-child(2) {
            width: 18px;
            height: 18px;
            right: 14%;
            top: 28%;
        }

        .custom-dialog-floating-bubbles span:nth-child(3) {
            width: 23px;
            height: 23px;
            right: 8%;
            bottom: 25%;
        }

        .custom-dialog-floating-bubbles span:nth-child(4) {
            width: 14px;
            height: 14px;
            left: 22%;
            top: 20%;
        }

        .custom-dialog-floating-bubbles span:nth-child(5) {
            width: 19px;
            height: 19px;
            left: 32%;
            bottom: 12%;
        }

        .custom-dialog-overlay.show
        .custom-dialog-floating-bubbles span:nth-child(1) {
            animation:
                dialogFloatBubbleOne .85s ease-out
                .06s forwards;
        }

        .custom-dialog-overlay.show
        .custom-dialog-floating-bubbles span:nth-child(2) {
            animation:
                dialogFloatBubbleTwo .8s ease-out
                .1s forwards;
        }

        .custom-dialog-overlay.show
        .custom-dialog-floating-bubbles span:nth-child(3) {
            animation:
                dialogFloatBubbleThree .9s ease-out
                .04s forwards;
        }

        .custom-dialog-overlay.show
        .custom-dialog-floating-bubbles span:nth-child(4) {
            animation:
                dialogFloatBubbleFour .75s ease-out
                .12s forwards;
        }

        .custom-dialog-overlay.show
        .custom-dialog-floating-bubbles span:nth-child(5) {
            animation:
                dialogFloatBubbleFive .82s ease-out
                .08s forwards;
        }

        @keyframes dialogFloatBubbleOne {
            0% {
                opacity: 0;
                transform:
                    translate(70px, 0)
                    scale(.2);
            }

            35% {
                opacity: .75;
            }

            100% {
                opacity: 0;
                transform:
                    translate(-25px, -22px)
                    scale(1.15);
            }
        }

        @keyframes dialogFloatBubbleTwo {
            0% {
                opacity: 0;
                transform:
                    translate(-65px, 55px)
                    scale(.2);
            }

            40% {
                opacity: .7;
            }

            100% {
                opacity: 0;
                transform:
                    translate(20px, -26px)
                    scale(1);
            }
        }

        @keyframes dialogFloatBubbleThree {
            0% {
                opacity: 0;
                transform:
                    translate(-80px, -45px)
                    scale(.2);
            }

            35% {
                opacity: .68;
            }

            100% {
                opacity: 0;
                transform:
                    translate(24px, 32px)
                    scale(1.15);
            }
        }

        @keyframes dialogFloatBubbleFour {
            0% {
                opacity: 0;
                transform:
                    translate(55px, 60px)
                    scale(.15);
            }

            40% {
                opacity: .72;
            }

            100% {
                opacity: 0;
                transform:
                    translate(-18px, -24px)
                    scale(1);
            }
        }

        @keyframes dialogFloatBubbleFive {
            0% {
                opacity: 0;
                transform:
                    translate(35px, -65px)
                    scale(.2);
            }

            40% {
                opacity: .65;
            }

            100% {
                opacity: 0;
                transform:
                    translate(-18px, 24px)
                    scale(1.1);
            }
        }

        /* =============================================
           CARD
        ============================================= */

        .custom-dialog-box {
            position: relative;
            z-index: 3;
            width: min(430px, 100%);
            padding: 27px;
            overflow: hidden;
            text-align: center;
            border: 1px solid #dbe5ef;
            border-radius: 22px;
            background:
                radial-gradient(
                    circle at 50% -20%,
                    rgba(59,130,246,.08),
                    transparent 48%
                ),
                #fff;
            box-shadow:
                0 24px 70px rgba(15,23,42,.22);

            opacity: 0;
            transform:
                scale(.82);

            transition:
                opacity .28s ease,
                transform .34s cubic-bezier(
                    .16,
                    1,
                    .3,
                    1
                );
        }

        .custom-dialog-overlay.show
        .custom-dialog-box {
            opacity: 1;
            transform: scale(1);
        }

        /* tekstur gelembung halus dalam card */

        .custom-dialog-box::before,
        .custom-dialog-box::after {
            content: "";
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        }

        .custom-dialog-box::before {
            width: 160px;
            height: 160px;
            right: -75px;
            top: -80px;
            border: 22px solid rgba(37,99,235,.035);
            animation:
                dialogInnerBubble 6s
                ease-in-out infinite;
        }

        .custom-dialog-box::after {
            width: 85px;
            height: 85px;
            left: -38px;
            bottom: -40px;
            background:
                rgba(14,165,233,.035);
            animation:
                dialogInnerBubbleTwo 7s
                ease-in-out infinite;
        }

        @keyframes dialogInnerBubble {
            0%,100% {
                transform:
                    translate(0,0)
                    scale(1);
            }

            50% {
                transform:
                    translate(-8px,10px)
                    scale(1.06);
            }
        }

        @keyframes dialogInnerBubbleTwo {
            0%,100% {
                transform:
                    translate(0,0);
            }

            50% {
                transform:
                    translate(9px,-7px)
                    scale(1.08);
            }
        }

        .custom-dialog-icon,
        .custom-dialog-title,
        .custom-dialog-message,
        .custom-dialog-actions {
            position: relative;
            z-index: 2;
        }

        /* =============================================
           ICON
        ============================================= */

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
            border-radius: 50%;
            background:
                radial-gradient(
                    circle at 32% 26%,
                    #fff,
                    #eff6ff 45%,
                    #dbeafe 100%
                );
            box-shadow:
                inset 0 0 10px rgba(255,255,255,.8),
                0 7px 18px rgba(37,99,235,.10);

            opacity: 0;
            transform: scale(.35);
        }

        .custom-dialog-overlay.show
        .custom-dialog-icon {
            animation:
                dialogIconBubble .48s
                cubic-bezier(.16,1,.3,1)
                .08s forwards;
        }

        @keyframes dialogIconBubble {
            0% {
                opacity: 0;
                transform: scale(.3);
            }

            65% {
                opacity: 1;
                transform: scale(1.12);
            }

            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .custom-dialog-icon.success {
            color: #047857;
            border-color: #bbf7d0;
            background:
                radial-gradient(
                    circle at 32% 26%,
                    #fff,
                    #ecfdf5 48%,
                    #d1fae5
                );
        }

        .custom-dialog-icon.danger {
            color: #b91c1c;
            border-color: #fecaca;
            background:
                radial-gradient(
                    circle at 32% 26%,
                    #fff,
                    #fef2f2 48%,
                    #fee2e2
                );
        }

        /* =============================================
           TEXT
        ============================================= */

        .custom-dialog-title {
            margin: 0 0 9px;
            color: #172033;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.3;
        }

        .custom-dialog-message {
            margin: 0;
            color: #64748b;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            font-size: 16px;
            line-height: 1.6;
            white-space: pre-line;
            overflow-wrap: anywhere;
        }

        /* =============================================
           BUTTON
        ============================================= */

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
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.2;
            cursor: pointer;
            border-radius: 12px;
            transition:
                transform .15s ease,
                background-color .15s ease,
                border-color .15s ease,
                box-shadow .15s ease;
        }

        .custom-dialog-btn:hover {
            transform: translateY(-1px);
        }

        .custom-dialog-btn:active {
            transform: scale(.98);
        }

        .custom-dialog-btn:focus-visible {
            outline: 3px solid
                rgba(59,130,246,.22);
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
            color: #fff;
            border: 1px solid transparent;
            background:
                linear-gradient(
                    90deg,
                    #2563eb,
                    #0ea5e9
                );
            box-shadow:
                0 8px 20px
                rgba(37,99,235,.18);
        }

        .custom-dialog-confirm:hover {
            box-shadow:
                0 10px 24px
                rgba(37,99,235,.22);
        }

        .custom-dialog-confirm.danger {
            color: #fff;
            background: #dc2626;
            box-shadow:
                0 8px 20px
                rgba(220,38,38,.17);
        }

        .custom-dialog-confirm.danger:hover {
            background: #b91c1c;
        }

        /* =============================================
           MOBILE
        ============================================= */

        @media (max-width: 520px) {
            .custom-dialog-overlay {
                padding: 14px;
            }

            .custom-dialog-box {
                width: 100%;
                max-width: 380px;
                padding: 23px 18px;
                border-radius: 20px;
            }

            .custom-dialog-icon {
                width: 58px;
                height: 58px;
                margin-bottom: 15px;
                font-size: 25px;
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

            .custom-dialog-floating-bubbles {
                width: 240px;
                height: 240px;
            }

            @keyframes dialogBubbleWaveOne {
                0% {
                    width: 20px;
                    height: 20px;
                    opacity: .7;
                    transform:
                        translate(-50%, -50%)
                        scale(.15);
                }

                100% {
                    width: 360px;
                    height: 360px;
                    opacity: 0;
                    transform:
                        translate(-50%, -50%)
                        scale(1);
                }
            }

            @keyframes dialogBubbleWaveTwo {
                0% {
                    width: 15px;
                    height: 15px;
                    opacity: .6;
                    transform:
                        translate(-50%, -50%)
                        scale(.12);
                }

                100% {
                    width: 280px;
                    height: 280px;
                    opacity: 0;
                    transform:
                        translate(-50%, -50%)
                        scale(1);
                }
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .custom-dialog-overlay,
            .custom-dialog-box,
            .custom-dialog-icon,
            .custom-dialog-btn,
            .custom-dialog-bubble-layer::before,
            .custom-dialog-bubble-layer::after,
            .custom-dialog-floating-bubbles span,
            .custom-dialog-box::before,
            .custom-dialog-box::after {
                animation: none !important;
                transition: none !important;
            }

            .custom-dialog-overlay.show
            .custom-dialog-box,
            .custom-dialog-overlay.show
            .custom-dialog-icon {
                opacity: 1;
                transform: none;
            }
        }
    `;

    document.head.appendChild(style);

    const overlay =
        document.createElement("div");

    overlay.id =
        "customDialogOverlay";

    overlay.className =
        "custom-dialog-overlay";

    overlay.innerHTML = `
        <div
            class="custom-dialog-bubble-layer"
            aria-hidden="true"
        ></div>

        <div
            class="custom-dialog-floating-bubbles"
            aria-hidden="true"
        >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>

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
                    class="
                        custom-dialog-btn
                        custom-dialog-cancel
                    "
                    id="customDialogCancel"
                >
                    Batal
                </button>

                <button
                    type="button"
                    class="
                        custom-dialog-btn
                        custom-dialog-confirm
                    "
                    id="customDialogConfirm"
                >
                    Ya, Lanjutkan
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}


function tampilkanDialogKonfirmasi(
    pesan,
    opsi = {}
) {
    pastikanCustomDialog();

    return new Promise(function(resolve) {
        const overlay =
            document.getElementById(
                "customDialogOverlay"
            );

        const icon =
            document.getElementById(
                "customDialogIcon"
            );

        const title =
            document.getElementById(
                "customDialogTitle"
            );

        const message =
            document.getElementById(
                "customDialogMessage"
            );

        const cancelBtn =
            document.getElementById(
                "customDialogCancel"
            );

        const confirmBtn =
            document.getElementById(
                "customDialogConfirm"
            );

        const bahaya =
            Boolean(opsi.bahaya);

        icon.textContent =
            opsi.icon ||
            (bahaya ? "!" : "?");

        icon.className =
            "custom-dialog-icon" +
            (bahaya ? " danger" : "");

        title.textContent =
            opsi.judul ||
            "Konfirmasi";

        message.textContent =
            String(
                pesan ||
                "Apakah Anda yakin?"
            );

        cancelBtn.textContent =
            opsi.teksBatal ||
            "Batal";

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

            overlay.classList.remove(
                "show"
            );

            document.removeEventListener(
                "keydown",
                tekanEscape
            );

            setTimeout(function() {
                resolve(nilai);
            }, 200);
        }

        function tekanEscape(event) {
            if (
                event.key === "Escape"
            ) {
                selesai(false);
            }
        }

        cancelBtn.onclick =
            function() {
                selesai(false);
            };

        confirmBtn.onclick =
            function() {
                selesai(true);
            };

        overlay.onclick =
            function(event) {
                if (
                    event.target ===
                    overlay
                ) {
                    selesai(false);
                }
            };

        document.addEventListener(
            "keydown",
            tekanEscape
        );

        requestAnimationFrame(
            function() {
                overlay.classList.add(
                    "show"
                );

                confirmBtn.focus();
            }
        );
    });
}


function tampilkanDialogInfo(
    pesan,
    opsi = {}
) {
    pastikanCustomDialog();

    const teks =
        String(
            pesan ||
            "Informasi"
        );

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
            document.getElementById(
                "customDialogOverlay"
            );

        const icon =
            document.getElementById(
                "customDialogIcon"
            );

        const title =
            document.getElementById(
                "customDialogTitle"
            );

        const message =
            document.getElementById(
                "customDialogMessage"
            );

        const cancelBtn =
            document.getElementById(
                "customDialogCancel"
            );

        const confirmBtn =
            document.getElementById(
                "customDialogConfirm"
            );

        icon.textContent =
            sukses
                ? "âœ“"
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

        message.textContent =
            teks;

        cancelBtn.hidden =
            true;

        confirmBtn.textContent =
            opsi.teksTombol ||
            "Oke";

        confirmBtn.className =
            "custom-dialog-btn custom-dialog-confirm";

        let selesaiDipanggil =
            false;

        function selesai() {
            if (
                selesaiDipanggil
            ) return;

            selesaiDipanggil =
                true;

            overlay.classList.remove(
                "show"
            );

            document.removeEventListener(
                "keydown",
                tekanEscape
            );

            setTimeout(
                resolve,
                200
            );
        }

        function tekanEscape(
            event
        ) {
            if (
                event.key === "Escape" ||
                event.key === "Enter"
            ) {
                selesai();
            }
        }

        confirmBtn.onclick =
            selesai;

        overlay.onclick =
            function(event) {
                if (
                    event.target ===
                    overlay
                ) {
                    selesai();
                }
            };

        document.addEventListener(
            "keydown",
            tekanEscape
        );

        requestAnimationFrame(
            function() {
                overlay.classList.add(
                    "show"
                );

                confirmBtn.focus();
            }
        );
    });
}/* =====================================================
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

            loginStatus.textContent = "Login berhasil âœ“";
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
            adminLoginStatus.textContent = "Login admin berhasil âœ“";

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
    const pegawaiNotificationCard = document.getElementById("pegawaiNotificationCard");
    const pegawaiNotificationIcon = document.getElementById("pegawaiNotificationIcon");
    const pegawaiNotificationTitle = document.getElementById("pegawaiNotificationTitle");
    const pegawaiNotificationText = document.getElementById("pegawaiNotificationText");

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
    const attendanceNote = document.getElementById("attendanceNote");
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
    let hariKerjaHariIni = true;
    let hariLiburHariIni = false;
    let namaHariLiburHariIni = "";

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

        const hariAbsensiTersedia = hariKerjaHariIni && !hariLiburHariIni;

        const masukBoleh =
            hariAbsensiTersedia &&
            !sudahMasuk &&
            !adaKeterangan &&
            waktu.masukDibuka;

        const keluarBoleh =
            hariAbsensiTersedia &&
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
        updateNotifikasiPegawai();
    }


    function updateStatusHariDenganWaktu(waktu) {
        if (!statusHariText || adaKeterangan) return;

        if (!hariKerjaHariIni) {
            statusHariText.textContent = "Hari ini bukan hari kerja Â· Absensi tidak tersedia";
            return;
        }

        if (hariLiburHariIni) {
            statusHariText.textContent = (namaHariLiburHariIni || "Hari libur") + " Â· Absensi tidak tersedia";
            return;
        }

        if (sudahMasuk && sudahKeluar) {
            statusHariText.textContent =
                "Absensi hari ini sudah selesai";
            return;
        }

        if (sudahMasuk && !sudahKeluar) {
            if (waktu.sekarang < JAM_ABSENSI.keluarMulai) {
                statusHariText.textContent =
                    "Masuk tercatat Â· Keluar mulai " + jamTampil(JAM_ABSENSI.keluarMulai) + " WITA";

            } else if (waktu.keluarDibuka) {
                statusHariText.textContent =
                    "Masuk tercatat Â· Absensi Keluar tersedia";

            } else {
                statusHariText.textContent =
                    "Masuk tercatat Â· Absensi Keluar sudah ditutup";
            }

            return;
        }

        if (waktu.sekarang < JAM_ABSENSI.masukMulai) {
            statusHariText.textContent =
                "Absensi Masuk dibuka pukul " + jamTampil(JAM_ABSENSI.masukMulai) + " WITA";

        } else if (waktu.masukTepatWaktu) {
            statusHariText.textContent =
                "Absensi Masuk tersedia Â· Tepat waktu";

        } else if (waktu.masukLambat) {
            statusHariText.textContent =
                "Absensi Masuk tersedia Â· Status Lambat";

        } else {
            statusHariText.textContent =
                "Absensi Masuk sudah ditutup pukul " + jamTampil(JAM_ABSENSI.masukSelesai) + " WITA";
        }
    }


    async function sinkronkanPengaturanAbsensi() {
        try {
            const hasil = await postData({ action: "ambilPengaturanAbsensi" });
            if (hasil?.berhasil) {
                terapkanPengaturanAbsensi(hasil.pengaturan);
                if (attendanceNote) attendanceNote.textContent = "Masuk setelah pukul " + jamTampil(JAM_ABSENSI.tepatWaktuSampai) + " WITA akan tercatat terlambat.";
            }
        } catch (error) { console.warn("Pengaturan absensi memakai nilai bawaan.", error); }
    }

    sinkronkanPengaturanAbsensi().finally(() => {
        updateJam();
        setInterval(updateJam, 1000);
        cekStatusHariIni();
    });


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
            hariKerjaHariIni = hasil.hariKerja !== false;
            hariLiburHariIni = Boolean(hasil.hariLibur);
            namaHariLiburHariIni = String(hasil.namaHariLibur || "");

            updatePilihanAbsensi();
            updateNotifikasiPegawai();

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
                    " Â· " +
                    (statusKeteranganHariIni || "Menunggu");
            }

            tutupSemuaMode();
            updateKontrolWaktu();
            return;
        }

        if (!hariKerjaHariIni || hariLiburHariIni) {
            if (modeHadirBtn) modeHadirBtn.disabled = true;
            if (modeKeteranganBtn) modeKeteranganBtn.disabled = true;
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


    function updateNotifikasiPegawai() {
        if (!pegawaiNotificationCard) return;
        const waktu = statusWaktuAbsensi();
        let judul = "", teks = "", icon = "â“˜";
        if (!hariKerjaHariIni) {
            judul = "Bukan Hari Kerja"; teks = "Hari ini absensi tidak tersedia."; icon = "ðŸ“…";
        } else if (hariLiburHariIni) {
            judul = "Hari Libur"; teks = namaHariLiburHariIni || "Hari ini ditetapkan sebagai hari libur."; icon = "ðŸŽ‰";
        } else if (adaKeterangan) {
            judul = "Keterangan " + (statusKeteranganHariIni || "Menunggu");
            teks = statusKeteranganHariIni === "Disetujui" ? "Keterangan Anda sudah disetujui admin." : "Keterangan Anda sedang menunggu pemeriksaan admin.";
            icon = "ðŸ“‹";
        } else if (sudahMasuk && !sudahKeluar && waktu.sekarang >= JAM_ABSENSI.keluarMulai) {
            judul = "Jangan Lupa Absen Pulang"; teks = "Absensi Masuk sudah tercatat. Silakan lakukan absensi Pulang sebelum waktu ditutup."; icon = "â†—";
        } else if (!sudahMasuk && waktu.masukDibuka) {
            judul = "Absensi Masuk Tersedia"; teks = "Silakan lakukan absensi Masuk saat sudah berada di kantor."; icon = "âœ“";
        }
        pegawaiNotificationCard.hidden = !judul;
        if (!judul) return;
        if (pegawaiNotificationIcon) pegawaiNotificationIcon.textContent = icon;
        if (pegawaiNotificationTitle) pegawaiNotificationTitle.textContent = judul;
        if (pegawaiNotificationText) pegawaiNotificationText.textContent = teks;
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
                        "Keterangan dibatalkan âœ“",
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
                                "Lokasi sesuai âœ“";
                        }

                        if (akurasiLokasi) {
                            akurasiLokasi.textContent =
                                "Jarak Â±" +
                                Math.round(jarakKantor) +
                                " m Â· Akurasi GPS Â±" +
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
                                "Jarak Â±" +
                                Math.round(jarakKantor) +
                                " m Â· Maksimal " +
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
                    "Absensi berhasil ðŸŽ‰",
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
                        "Keterangan terkirim âœ“",
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
                selesai ? "âœ“" : "â—‹";
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
                tipe === "success" ? "âœ“" : "!";
        }

        toast.classList.add("show");

        toastTimer = setTimeout(function() {
            toast.classList.remove("show");
        }, 4000);
    }


    logoutBtn?.addEventListener("click", async function() {
        const yakin = await tampilkanDialogKonfirmasi(
            "Apakah Anda yakin ingin keluar dari akun?",
            { judul: "Keluar dari Akun", teksKonfirmasi: "Ya, Keluar", teksBatal: "Batal", bahaya: true }
        );
        if (!yakin) return;
        hentikanKamera();
        logoutUser();
    });

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
const adminLogSection = document.getElementById("adminLogSection");
const adminPengaturanSection = document.getElementById("adminPengaturanSection");

if (
    adminAbsensiSection ||
    adminPegawaiSection ||
    adminKeteranganSection ||
    adminAkunSection ||
    adminLogSection ||
    adminPengaturanSection
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
    const navLogAdminBtn = document.getElementById("navLogAdminBtn");
    const navPengaturanAdminBtn = document.getElementById("navPengaturanAdminBtn");


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

    const jumlahDataText = document.getElementById("jumlahDataText");
    const refreshRealtimeBtn = document.getElementById("refreshRealtimeBtn");
    const realtimeUpdatedAt = document.getElementById("realtimeUpdatedAt");
    const realtimeStatIds = {
        aktif: "totalAktifHariIni", hadir: "totalHadirHariIni", terlambat: "totalTerlambatHariIni",
        keterangan: "totalKeteranganHariIni", belum: "totalBelumAbsenHariIni"
    };
    const absensiManualBtn = document.getElementById("absensiManualBtn");
    const actionPendingKetCount = document.getElementById("actionPendingKetCount");
    const actionBelumKeluarCount = document.getElementById("actionBelumKeluarCount");
    const actionPerluDicekCount = document.getElementById("actionPerluDicekCount");
    const actionPendingKet = document.getElementById("actionPendingKet");
    const actionBelumKeluar = document.getElementById("actionBelumKeluar");
    const actionPerluDicek = document.getElementById("actionPerluDicek");


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


    const pengaturanAbsensiForm = document.getElementById("pengaturanAbsensiForm");
    const tanggalMulaiPerhitunganForm = document.getElementById("tanggalMulaiPerhitunganForm");
    const simpanTanggalMulaiBtn = document.getElementById("simpanTanggalMulaiBtn");
    const hariKerjaForm = document.getElementById("hariKerjaForm");
    const simpanHariKerjaBtn = document.getElementById("simpanHariKerjaBtn");
    const simpanPengaturanBtn = document.getElementById("simpanPengaturanBtn");
    const resetPengaturanBtn = document.getElementById("resetPengaturanBtn");
    const gunakanLokasiKantorBtn = document.getElementById("gunakanLokasiKantorBtn");
    const settingIds = ["Radius","Latitude","Longitude","TanggalMulaiPerhitungan","MasukMulai","JamLambat","MasukSelesai","KeluarMulai","KeluarSelesai"];
    const settingEl = Object.fromEntries(settingIds.map(k => [k, document.getElementById("setting" + k)]));

    const fotoAbsensiModal = document.getElementById("fotoAbsensiModal");
    const fotoAbsensiPreview = document.getElementById("fotoAbsensiPreview");
    const fotoAbsensiLoading = document.getElementById("fotoAbsensiLoading");
    const fotoAbsensiJudul = document.getElementById("fotoAbsensiJudul");
    const tutupFotoAbsensiBtn = document.getElementById("tutupFotoAbsensiBtn");

    let dataTanggalAktif = [];
    let daftarPegawaiAdmin = [];
    let daftarKeteranganAdmin = [];
    let requestAdminId = 0;


/* =====================================================
   UI HELPERS â€” reusable, ringan, ramah pengguna
===================================================== */
(() => {
    let toastTimer;
    window.appToast = (message, type = "success", title = type === "success" ? "Berhasil" : "Perhatian") => {
        const el = document.getElementById("adminToast");
        if (!el) return;
        clearTimeout(toastTimer);
        el.className = `app-toast ${type}`;
        el.querySelector(".app-toast-icon").textContent = type === "success" ? "âœ“" : "!";
        el.querySelector("strong").textContent = title;
        el.querySelector("p").textContent = message;
        el.hidden = false;
        requestAnimationFrame(() => el.classList.add("show"));
        toastTimer = setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.hidden = true, 250); }, 4000);
    };

    window.setButtonLoading = (button, loading, text = "Memproses...") => {
        if (!button) return;
        if (loading && !button.classList.contains("is-loading")) {
            button.dataset.label = button.textContent.trim();
        }
        button.disabled = loading;
        button.classList.toggle("is-loading", loading);
        button.textContent = loading ? text : (button.dataset.label || button.textContent);
        button.setAttribute("aria-busy", String(loading));
    };

    window.tableSkeleton = (cols, rows = 3) => Array.from({ length: rows }, () =>
        `<tr class="skeleton-row">${Array.from({ length: cols }, () => '<td><span></span></td>').join("")}</tr>`
    ).join("");
})();

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
        await muatDashboardRealtime();
    } catch (error) {
        console.error(error);
    }
}

/* =====================================================
   NAVIGASI ADMIN
===================================================== */

// Bridge global agar pemanggilan langsung maupun window.muatPengaturanAdmin sama-sama aman.
var muatPengaturanAdmin = async function() {
    if (typeof window.__muatPengaturanAdminImpl === "function") {
        return window.__muatPengaturanAdminImpl();
    }
};
window.muatPengaturanAdmin = muatPengaturanAdmin;

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

navLogAdminBtn?.addEventListener("click", async function() {
    tampilkanHalamanAdmin("log");
    await muatLogAdmin();
});

navPengaturanAdminBtn?.addEventListener("click", async function() {
    tampilkanHalamanAdmin("pengaturan");
    await muatPengaturanAdmin();
});

navAkunAdminBtn?.addEventListener("click", function() {
    tampilkanHalamanAdmin("akun");
});

    function tampilkanHalamanAdmin(halaman) {
        [
            adminAbsensiSection,
            adminPegawaiSection,
            adminKeteranganSection,
            adminLogSection,
            adminPengaturanSection,
            adminAkunSection
        ].forEach(function(section) {
            section?.classList.remove("active");
        });

        [
            navAbsensiBtn,
            navPegawaiBtn,
            navKeteranganBtn,
            navLogAdminBtn,
            navPengaturanAdminBtn,
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

        if (halaman === "log") {
            adminLogSection?.classList.add("active");
            navLogAdminBtn?.classList.add("active");
        }

        if (halaman === "pengaturan") {
            adminPengaturanSection?.classList.add("active");
            navPengaturanAdminBtn?.classList.add("active");
        }

        if (halaman === "akun") {
            adminAkunSection?.classList.add("active");
            navAkunAdminBtn?.classList.add("active");
        }
    }


    /* =====================================================
       DASHBOARD REAL-TIME
    ===================================================== */
    function setRealtimeStat(nama, nilai) {
        const el = document.getElementById(realtimeStatIds[nama]);
        if (el) el.textContent = nilai;
    }

    function nipKey(item) {
        return String(item?.nip || "").trim();
    }

    function tanggalItem(item) {
        const nilai = item?.tanggal || item?.waktu || item?.createdAt || "";
        if (!nilai) return "";
        const teks = String(nilai);
        const cocok = teks.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (cocok) return `${cocok[1]}-${cocok[2]}-${cocok[3]}`;
        const d = new Date(nilai);
        if (Number.isNaN(d.getTime())) return "";
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit"
        }).format(d);
    }

    function hitungDashboardRealtime(absensi, pegawai, keterangan) {
        const hariIni = tanggalWITAHariIni();
        const aktif = pegawai.filter(p => String(p.status || "Aktif") === "Aktif");
        const aktifNip = new Set(aktif.map(nipKey).filter(Boolean));
        const masuk = absensi.filter(a =>
            String(a.jenisAbsen || a.jenis || "") === "Masuk" && aktifNip.has(nipKey(a))
        );
        const hadir = new Set(masuk.map(nipKey).filter(Boolean));
        const terlambat = new Set(masuk.filter(a =>
            /lambat|terlambat/i.test(String(a.status || ""))
        ).map(nipKey).filter(Boolean));
        const izin = new Set(keterangan.filter(k =>
            String(k.status || "") === "Disetujui" &&
            tanggalItem(k) === hariIni && aktifNip.has(nipKey(k))
        ).map(nipKey).filter(Boolean));
        const tercatat = new Set([...hadir, ...izin]);

        return {
            aktif: aktif.length,
            hadir: hadir.size,
            terlambat: terlambat.size,
            keterangan: izin.size,
            belum: Math.max(aktif.length - tercatat.size, 0)
        };
    }

    async function muatDashboardRealtime(paksa = false) {
        const btn = refreshRealtimeBtn;
        if (btn) setButtonLoading(btn, true, "Memperbarui...");
        if (!cacheMasihFresh("absensi", tanggalWITAHariIni())) {
            Object.keys(realtimeStatIds).forEach(k => setRealtimeStat(k, "â€¦"));
        }

        try {
            const hasil = await postAdmin({ action: "ambilDashboardAdmin" }, 40000);
            if (!hasil?.berhasil) throw new Error(hasil?.pesan || "Ringkasan hari ini gagal dimuat.");

            const hariIni = hasil.tanggal || tanggalWITAHariIni();
            const absensiHariIni = Array.isArray(hasil.absensi) ? hasil.absensi : [];
            daftarPegawaiAdmin = Array.isArray(hasil.pegawai) ? hasil.pegawai : [];
            setCacheAdmin("pegawai");

            if ((filterTanggal?.value || hariIni) === hariIni) {
                dataTanggalAktif = absensiHariIni;
                setCacheAdmin("absensi", hariIni);
                tampilkanAbsensiAdmin();
            }

            const data = hasil.ringkasan || hitungDashboardRealtime(absensiHariIni, daftarPegawaiAdmin, []);
            Object.entries(data).forEach(([k, v]) => setRealtimeStat(k, v));
            if (actionPendingKetCount) actionPendingKetCount.textContent = data.menungguKeterangan ?? 0;
            if (actionBelumKeluarCount) actionBelumKeluarCount.textContent = data.belumKeluar ?? 0;
            if (actionPerluDicekCount) actionPerluDicekCount.textContent = data.perluDicek ?? 0;
            if (realtimeUpdatedAt) {
                realtimeUpdatedAt.textContent = "Diperbarui " + new Intl.DateTimeFormat("id-ID", {
                    timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit", hour12: false
                }).format(new Date()) + " WITA";
            }
            if (paksa) appToast("Ringkasan hari ini sudah diperbarui.", "success");
        } catch (error) {
            console.error(error);
            if (!dataTanggalAktif.length) Object.keys(realtimeStatIds).forEach(k => setRealtimeStat(k, "â€“"));
            if (realtimeUpdatedAt) realtimeUpdatedAt.textContent = "Gagal memuat ringkasan";
            if (paksa) appToast(error.message || "Ringkasan gagal diperbarui.", "error");
        } finally {
            if (btn) setButtonLoading(btn, false);
        }
    }

    actionPendingKet?.addEventListener("click", async () => {
        tampilkanHalamanAdmin("keterangan");
        if (filterStatusKeterangan) filterStatusKeterangan.value = "Menunggu";
        await ambilKeteranganAdmin();
    });
    actionBelumKeluar?.addEventListener("click", () => {
        tampilkanHalamanAdmin("absensi");
        if (filterJenis) filterJenis.value = "Masuk";
        tampilkanAbsensiAdmin();
    });
    actionPerluDicek?.addEventListener("click", () => {
        tampilkanHalamanAdmin("absensi");
        appToast("Periksa pegawai yang sudah Masuk tetapi belum memiliki absensi Pulang.", "error", "Perlu Dicek");
    });

    refreshRealtimeBtn?.addEventListener("click", () => muatDashboardRealtime(true));
    setInterval(() => {
        if (!document.hidden && adminAbsensiSection?.classList.contains("active")) muatDashboardRealtime();
    }, 60000);

    /* =====================================================
       AMBIL ABSENSI ADMIN
    ===================================================== */

    async function ambilAbsensiAdmin() {
    const idRequest = ++requestAdminId;
    const tanggal = filterTanggal?.value || "";

    if (dataAbsensi) dataAbsensi.innerHTML =
        tableSkeleton(12);

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
            '<tr><td colspan="12" class="empty-cell">' + escapeHTML(error.message) + "</td></tr>";
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

        if (jumlahDataText) {
            jumlahDataText.textContent =
                hasilFilter.length +
                " data ditemukan";
        }

        if (!dataAbsensi) return;

        if (!hasilFilter.length) {
            dataAbsensi.innerHTML =
                '<tr><td colspan="12" class="empty-cell">Tidak ada data absensi.</td></tr>';
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
                    ? '<button type="button" class="absensi-foto-thumb foto-preview-btn" data-foto="' + escapeHTML(foto) + '" data-nama="' + escapeHTML(item.nama || "Pegawai") + '" aria-label="Lihat foto ' + escapeHTML(item.nama || "Pegawai") + '"><span class="absensi-foto-loading">â€¢â€¢â€¢</span><img alt="Foto absensi ' + escapeHTML(item.nama || "Pegawai") + '" hidden></button>'
                    : '<span class="absensi-foto-kosong">-</span>';

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
                        <td>
                            <div class="absensi-admin-actions">
                                <button type="button" class="table-action-btn koreksi-absensi-btn" data-id="${escapeHTML(item.id || "")}">Koreksi</button>
                                ${/^Admin(?:\s+Koreksi)?$/i.test(sumber)
                                    ? `<button type="button" class="table-action-btn table-action-danger hapus-absensi-manual-btn" data-id="${escapeHTML(item.id || "")}">Hapus</button>`
                                    : ""}
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");

        dataAbsensi.querySelectorAll(".koreksi-absensi-btn").forEach(btn =>
            btn.addEventListener("click", () => bukaKoreksiAbsensi(btn.dataset.id))
        );
        dataAbsensi.querySelectorAll(".hapus-absensi-manual-btn").forEach(btn =>
            btn.addEventListener("click", () => hapusAbsensiManual(btn.dataset.id))
        );
        dataAbsensi.querySelectorAll(".foto-preview-btn").forEach(btn =>
            btn.addEventListener("click", () => bukaPreviewFotoAdmin(btn.dataset.foto, btn.dataset.nama))
        );
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
        tableSkeleton(5);

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
                '<tr><td colspan="7" class="empty-cell">Tidak ada pegawai.</td></tr>';
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
                        <td><strong>${escapeHTML(pegawai.jabatan || "-")}</strong><br><small>${escapeHTML(pegawai.unitKerja || "-")}</small></td>
                        <td>${escapeHTML(pegawai.tanggalMulaiKerja || "-")}</td>

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
                                    class="pegawai-detail-btn"
                                    data-nip="${escapeHTML(pegawai.nip || "")}">
                                    Detail
                                </button>

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

        dataPegawai.querySelectorAll(".pegawai-detail-btn").forEach(button =>
            button.addEventListener("click", () => bukaDetailPegawai(button.dataset.nip))
        );

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
       DETAIL & RIWAYAT PEGAWAI
    ===================================================== */
    const detailPegawaiModal = document.getElementById("detailPegawaiModal");
    const detailPegawaiNama = document.getElementById("detailPegawaiNama");
    const detailPegawaiIdentitas = document.getElementById("detailPegawaiIdentitas");
    const detailPegawaiBulan = document.getElementById("detailPegawaiBulan");
    const detailPegawaiTahun = document.getElementById("detailPegawaiTahun");
    const detailPegawaiIsi = document.getElementById("detailPegawaiIsi");
    const muatDetailPegawaiBtn = document.getElementById("muatDetailPegawaiBtn");
    let nipDetailPegawai = "";

    (() => {
        if (!detailPegawaiBulan || !detailPegawaiTahun) return;
        const now = new Date(), bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        detailPegawaiBulan.innerHTML = bulan.map((nama, i) => `<option value="${i+1}">${nama}</option>`).join("");
        detailPegawaiTahun.innerHTML = Array.from({length: 6}, (_, i) => now.getFullYear() - 4 + i).map(t => `<option value="${t}">${t}</option>`).join("");
        detailPegawaiBulan.value = now.getMonth() + 1;
        detailPegawaiTahun.value = now.getFullYear();
    })();

    function bukaDetailPegawai(nip) {
        const p = daftarPegawaiAdmin.find(x => String(x.nip) === String(nip));
        if (!p) return;
        nipDetailPegawai = nip;
        detailPegawaiNama.textContent = p.nama || "Pegawai";
        detailPegawaiIdentitas.textContent = `NIP ${p.nip || "-"} â€¢ ${p.jabatan || "Jabatan belum diisi"} â€¢ ${p.unitKerja || "Unit belum diisi"} â€¢ ${p.status || "Aktif"}`;
        bukaModal(detailPegawaiModal);
        muatDetailPegawai();
    }

    async function muatDetailPegawai() {
        if (!nipDetailPegawai) return;
        setButtonLoading(muatDetailPegawaiBtn, true, "Memuat...");
        detailPegawaiIsi.innerHTML = '<div class="detail-loading">Memuat riwayat pegawai...</div>';
        try {
            const hasil = await postAdmin({ action: "ambilDetailPegawai", nip: nipDetailPegawai, bulan: +detailPegawaiBulan.value, tahun: +detailPegawaiTahun.value }, 45000);
            if (!hasil.berhasil) throw new Error(hasil.pesan || "Riwayat gagal dimuat.");
            renderDetailPegawai(hasil);
        } catch (e) {
            detailPegawaiIsi.innerHTML = `<div class="detail-error">${escapeHTML(e.message)}</div>`;
            appToast(e.message, "error", "Data belum dapat dimuat");
        } finally { setButtonLoading(muatDetailPegawaiBtn, false); }
    }

    function renderDetailPegawai(h) {
        const r = h.rekap || {}, riwayat = h.riwayat || [];
        const cards = [["Hadir",r.H],["Terlambat",r.hariTerlambat],["Tidak Hadir",r.TK],["Sakit",r.S],["Cuti",r.CT],["TAP",r.TAP]];
        detailPegawaiIsi.innerHTML = `
            <div class="detail-ringkasan">${cards.map(x => `<div><small>${x[0]}</small><strong>${x[1] || 0}</strong></div>`).join("")}</div>
            <div class="detail-total-terlambat"><span>Total keterlambatan</span><strong>${escapeHTML(r.totalTerlambat || "-")}</strong></div>
            <div class="detail-riwayat-header"><strong>Riwayat Harian</strong><span>${escapeHTML(h.namaBulan || "")} ${h.tahun || ""}</span></div>
            ${riwayat.length ? `<div class="detail-riwayat-list">${riwayat.map(x => `<div class="detail-riwayat-item"><div><strong>${escapeHTML(x.tanggalTampil || x.tanggal || "-")}</strong><span>Masuk ${escapeHTML(x.jamMasuk || "-")} â€¢ Pulang ${escapeHTML(x.jamKeluar || "-")}</span></div><span class="detail-status">${escapeHTML(x.status || "-")}</span></div>`).join("")}</div>` : '<div class="detail-empty">Belum ada riwayat pada periode ini.</div>'}`;
    }

    muatDetailPegawaiBtn?.addEventListener("click", muatDetailPegawai);
    document.getElementById("tutupDetailPegawaiBtn")?.addEventListener("click", () => tutupModal(detailPegawaiModal));
    detailPegawaiModal?.querySelector(".admin-modal-backdrop")?.addEventListener("click", () => tutupModal(detailPegawaiModal));

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
    const pegawaiJabatan = document.getElementById("pegawaiJabatan");
    const pegawaiUnitKerja = document.getElementById("pegawaiUnitKerja");
    const pegawaiTanggalMulaiKerja = document.getElementById("pegawaiTanggalMulaiKerja");

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

            if (pegawaiStatus) pegawaiStatus.value = "Aktif";
            if (pegawaiJabatan) pegawaiJabatan.value = "";
            if (pegawaiUnitKerja) pegawaiUnitKerja.value = "";
            if (pegawaiTanggalMulaiKerja) pegawaiTanggalMulaiKerja.value = settingEl.TanggalMulaiPerhitungan?.value || tanggalWITAHariIni();

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
        if (pegawaiJabatan) pegawaiJabatan.value = pegawai.jabatan || "";
        if (pegawaiUnitKerja) pegawaiUnitKerja.value = pegawai.unitKerja || "";
        if (pegawaiTanggalMulaiKerja) pegawaiTanggalMulaiKerja.value = pegawai.tanggalMulaiKerja || settingEl.TanggalMulaiPerhitungan?.value || tanggalWITAHariIni();

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
            const jabatan = pegawaiJabatan?.value.trim() || "";
            const unitKerja = pegawaiUnitKerja?.value.trim() || "";
            const tanggalMulaiKerja = pegawaiTanggalMulaiKerja?.value || "";

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
                        status: status,
                        jabatan: jabatan,
                        unitKerja: unitKerja,
                        tanggalMulaiKerja: tanggalMulaiKerja
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
                            ? "âœ“"
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
        tableSkeleton(7);

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

                icon: disetujui ? "âœ“" : "!",
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
                    " â€” " +
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
                " Â· " +
                tanggal +
                " " +
                waktu +
                " WITA\n\nAlasan: " +
                alasan,
                {
                    judul: "Simpan Absensi Manual?",
                    icon: "âœ“",
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
                    "Password berhasil diubah âœ“",
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
                    icon: "â†ª",
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

    async function postAdmin(data, timeout = null) {
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
       KONTROL ADMIN LANJUTAN
    ===================================================== */
    const koreksiModal = document.getElementById("koreksiAbsensiModal");
    const koreksiForm = document.getElementById("koreksiAbsensiForm");
    const koreksiId = document.getElementById("koreksiAbsensiId");
    const koreksiNama = document.getElementById("koreksiAbsensiNama");
    const koreksiTanggal = document.getElementById("koreksiAbsensiTanggal");
    const koreksiWaktu = document.getElementById("koreksiAbsensiWaktu");
    const koreksiAlasan = document.getElementById("koreksiAbsensiAlasan");
    const simpanKoreksiBtn = document.getElementById("simpanKoreksiAbsensiBtn");

    async function hapusAbsensiManual(id) {
        const item = dataTanggalAktif.find(x => String(x.id) === String(id));
        if (!item) return appToast("Data absensi tidak ditemukan. Muat ulang halaman.", "error");

        const sumber = String(item.sumber || "");
        if (!/^Admin(?:\s+Koreksi)?$/i.test(sumber)) {
            return appToast("Hanya absensi manual dari admin yang dapat dihapus.", "error");
        }

        const yakin = await tampilkanDialogKonfirmasi(
            `${item.nama || "Pegawai"}\n${item.jenisAbsen || "Absensi"} â€¢ ${formatWaktu(item.waktu)}\n\nData ini akan dihapus dari absensi dan memengaruhi rekap. Tindakan tetap dicatat di Log Admin.`,
            {
                judul: "Hapus Absensi Manual?",
                teksKonfirmasi: "Ya, Hapus",
                teksBatal: "Batal",
                icon: "ðŸ—‘ï¸",
                bahaya: true
            }
        );

        if (!yakin) return;

        const tombol = document.querySelector(`.hapus-absensi-manual-btn[data-id="${CSS.escape(String(id))}"]`);
        try {
            if (tombol) setButtonLoading(tombol, true, "Menghapus...");
            const hasil = await postAdmin({ action:"hapusAbsensiManual", id });
            if (!hasil.berhasil) throw new Error(hasil.pesan || "Absensi manual gagal dihapus.");

            hapusCacheAdmin("absensi");
            await ambilAbsensiAdmin();
            // Dashboard ikut diperbarui agar angka hadir/belum absen langsung benar.
            await muatDashboardRealtime(true);
            appToast(hasil.pesan || "Absensi manual berhasil dihapus.", "success", "Data Dihapus");
        } catch (err) {
            appToast(err.message || "Absensi manual gagal dihapus.", "error", "Hapus Gagal");
        } finally {
            if (tombol && document.body.contains(tombol)) setButtonLoading(tombol, false);
        }
    }

    function bukaKoreksiAbsensi(id) {
        const item = dataTanggalAktif.find(x => String(x.id) === String(id));
        if (!item) return appToast("Data absensi tidak ditemukan.", "error");
        const d = new Date(item.waktu);
        const parts = new Intl.DateTimeFormat("en-CA", { timeZone:"Asia/Makassar", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hour12:false }).formatToParts(d);
        const get = t => parts.find(p => p.type === t)?.value || "";
        koreksiId.value = item.id || "";
        koreksiNama.textContent = `${item.nama || "Pegawai"} â€¢ ${item.jenisAbsen || ""}`;
        koreksiTanggal.value = `${get("year")}-${get("month")}-${get("day")}`;
        koreksiWaktu.value = `${get("hour")}:${get("minute")}`;
        koreksiAlasan.value = "";
        bukaModal(koreksiModal);
    }

    koreksiForm?.addEventListener("submit", async e => {
        e.preventDefault();
        const alasan = koreksiAlasan.value.trim();
        if (alasan.length < 5) return appToast("Tuliskan alasan koreksi dengan jelas.", "error");
        const lanjut = await tampilkanDialogKonfirmasi("Simpan koreksi absensi ini? Perubahan akan dicatat di Log Admin.", { judul:"Konfirmasi Koreksi", teksKonfirmasi:"Ya, Simpan", icon:"âœï¸" });
        if (!lanjut) return;
        try {
            setButtonLoading(simpanKoreksiBtn, true, "Menyimpan...");
            const h = await postAdmin({ action:"koreksiAbsensi", id:koreksiId.value, tanggal:koreksiTanggal.value, waktu:koreksiWaktu.value, alasan });
            if (!h.berhasil) throw new Error(h.pesan || "Koreksi gagal disimpan.");
            tutupModal(koreksiModal); hapusCacheAdmin("absensi"); await ambilAbsensiAdmin(); appToast(h.pesan, "success");
        } catch (err) { appToast(err.message, "error", "Koreksi Gagal"); }
        finally { setButtonLoading(simpanKoreksiBtn, false); }
    });
    document.getElementById("tutupKoreksiAbsensiBtn")?.addEventListener("click", () => tutupModal(koreksiModal));
    document.getElementById("batalKoreksiAbsensiBtn")?.addEventListener("click", () => tutupModal(koreksiModal));

    document.getElementById("resetAksesPegawaiBtn")?.addEventListener("click", async () => {
        if (!nipDetailPegawai) return;
        const p = daftarPegawaiAdmin.find(x => String(x.nip) === String(nipDetailPegawai));
        const lanjut = await tampilkanDialogKonfirmasi(`Reset akses ${p?.nama || "pegawai"}? Pegawai tetap dapat login dengan NIP.`, { judul:"Reset Akses Pegawai", teksKonfirmasi:"Ya, Reset", icon:"ðŸ”‘" });
        if (!lanjut) return;
        try {
            const h = await postAdmin({ action:"resetAksesPegawai", nip:nipDetailPegawai });
            if (!h.berhasil) throw new Error(h.pesan || "Reset akses gagal.");
            appToast(h.pesan, "success", "Akses Direset");
        } catch (err) { appToast(err.message, "error", "Reset Gagal"); }
    });

    async function muatLogAdmin() {
        const tbody = document.getElementById("dataLogAdmin");
        if (!tbody) return;
        tbody.innerHTML = tableSkeleton(5, 4);
        try {
            const h = await postAdmin({ action:"ambilLogAdmin" });
            if (!h.berhasil) throw new Error(h.pesan || "Log gagal dimuat.");
            const data = Array.isArray(h.data) ? h.data : [];
            tbody.innerHTML = data.length ? data.map(x => `<tr><td data-label="Waktu">${escapeHTML(formatWaktu(x.waktu))}</td><td data-label="Admin">${escapeHTML(x.admin || "-")}</td><td data-label="Aksi"><strong>${escapeHTML(x.aksi || "-")}</strong></td><td data-label="Target">${escapeHTML(x.target || x.targetNip || "-")}</td><td data-label="Detail">${escapeHTML(x.detail || "-")}</td></tr>`).join("") : '<tr><td colspan="5" class="empty-cell">Belum ada aktivitas admin.</td></tr>';
        } catch (err) { tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">${escapeHTML(err.message)}</td></tr>`; }
    }
    document.getElementById("refreshLogAdminBtn")?.addEventListener("click", muatLogAdmin);

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
    const login = action === "login" || action === "loginAdmin";
    const batasWaktu = timeout ?? (login ? 45000 : 60000);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), batasWaktu);

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data),
            signal: controller.signal,
            cache: "no-store"
        });

        const text = await response.text();
        let hasil = null;

        try {
            hasil = JSON.parse(text);
        } catch {
            if (response.ok) {
                throw new Error("Respons server tidak valid.");
            }
        }

        if (!response.ok) {
            throw new Error(
                hasil?.pesan ||
                "Server absensi sedang bermasalah. Silakan coba lagi."
            );
        }

        return hasil;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error(
                "Server absensi terlalu lama merespons. Silakan coba lagi."
            );
        }

        if (error instanceof TypeError) {
            throw new Error(
                "Koneksi ke server terganggu. Periksa internet lalu coba lagi."
            );
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
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


/* =====================================================
   RUNNING TEXT PEGAWAI
===================================================== */

(function mulaiPengumumanPegawai() {
    const container =
        document.getElementById("runningAnnouncement");

    if (!container) return;

    const teksUtama =
        document.getElementById("runningAnnouncementText");

    const teksClone =
        document.getElementById("runningAnnouncementTextClone");

    muatPengumumanPegawai();

    async function muatPengumumanPegawai() {
        try {
            const hasil = await postData(
                {
                    action: "ambilPengumuman"
                },
                10000
            );

            if (
                !hasil?.berhasil ||
                !hasil.aktif ||
                !String(hasil.teks || "").trim()
            ) {
                container.hidden = true;
                return;
            }

            const teks =
                "ðŸ“¢ " + String(hasil.teks).trim();

            teksUtama.textContent = teks;
            teksClone.textContent = teks;

            container.hidden = false;

        } catch (error) {
            console.error(
                "Pengumuman gagal dimuat:",
                error
            );

            container.hidden = true;
        }
    }
})();


/* =====================================================
   PENGUMUMAN ADMIN
===================================================== */

(function mulaiPengumumanAdmin() {
    const form =
        document.getElementById("pengumumanAdminForm");

    if (!form) return;

    const input =
        document.getElementById("pengumumanAdminText");

    const aktif =
        document.getElementById("pengumumanAdminAktif");

    const counter =
        document.getElementById("pengumumanCounter");

    const preview =
        document.getElementById("pengumumanPreviewText");

    const status =
        document.getElementById("pengumumanAdminStatus");

    const tombol =
        document.getElementById("simpanPengumumanAdminBtn");


    input?.addEventListener("input", updatePreview);


    muatPengumumanAdmin();


    async function muatPengumumanAdmin() {
        try {
            const hasil = await postData(
                {
                    action: "ambilPengumuman"
                },
                10000
            );

            if (!hasil?.berhasil) return;

            input.value =
                String(hasil.teks || "");

            aktif.checked =
                Boolean(hasil.aktif);

            updatePreview();

        } catch (error) {
            console.error(error);
        }
    }


    function updatePreview() {
        const teks =
            String(input?.value || "").trim();

        if (counter) {
            counter.textContent =
                String(input?.value.length || 0);
        }

        if (preview) {
            preview.textContent =
                teks || "Belum ada pengumuman.";
        }
    }


    form.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const teks =
                String(input.value || "")
                    .replace(/\s+/g, " ")
                    .trim();

            if (aktif.checked && !teks) {
                setStatusPengumuman(
                    "Isi pengumuman terlebih dahulu.",
                    false
                );
                return;
            }

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                window.location.href = "index.html";
                return;
            }

            tombol.disabled = true;
            tombol.textContent = "Menyimpan...";

            setStatusPengumuman(
                "Menyimpan perubahan...",
                null
            );

            try {
                const hasil = await postData(
                    {
                        action:
                            "simpanPengumumanAdmin",

                        adminToken:
                            token,

                        teks:
                            teks,

                        aktif:
                            aktif.checked
                    },
                    15000
                );

                if (!hasil?.berhasil) {
                    throw new Error(
                        hasil?.pesan ||
                        "Pengumuman gagal disimpan."
                    );
                }

                setStatusPengumuman(
                    hasil.pesan ||
                    "Pengumuman berhasil disimpan.",
                    true
                );

                updatePreview();

            } catch (error) {
                console.error(error);

                setStatusPengumuman(
                    error.message,
                    false
                );

            } finally {
                tombol.disabled = false;
                tombol.textContent =
                    "Simpan Pengumuman";
            }
        }
    );


    function setStatusPengumuman(
        pesan,
        berhasil
    ) {
        if (!status) return;

        status.textContent = pesan || "";

        status.classList.remove(
            "success",
            "error",
            "loading"
        );

        if (berhasil === true) {
            status.classList.add("success");
        } else if (berhasil === false) {
            status.classList.add("error");
        } else {
            status.classList.add("loading");
        }
    }
})();


/* =====================================================
   ADMIN STAT COUNT-UP
===================================================== */

(function mulaiAdminCountUp() {
    if (!document.body.classList.contains("admin-page")) return;

    const daftarId = [
        "totalAbsensi",
        "totalMasuk",
        "totalKeluar",

        "totalPegawai",
        "totalPegawaiAktif",
        "totalPegawaiTidakAktif",

        "totalKeteranganAdmin",
        "totalKeteranganMenunggu",
        "totalKeteranganDisetujui",
        "totalKeteranganDitolak",

        "rekapHariKerja",
        "rekapTotalPegawai",
        "rekapTotalHadir",
        "rekapTotalTerlambat"
    ];

    daftarId.forEach(id => {
        const elemen = document.getElementById(id);

        if (!elemen) return;

        elemen.dataset.motionTarget =
            String(Number(elemen.textContent) || 0);

        const observer = new MutationObserver(() => {
            if (elemen.dataset.motionRunning === "1") return;

            const nilaiBaru =
                Number(String(elemen.textContent).replace(/[^\d.-]/g, ""));

            if (!Number.isFinite(nilaiBaru)) return;

            const targetLama =
                Number(elemen.dataset.motionTarget || 0);

            if (nilaiBaru === targetLama) return;

            elemen.dataset.motionTarget =
                String(nilaiBaru);

            animasiAngkaAdmin(
                elemen,
                targetLama,
                nilaiBaru
            );
        });

        observer.observe(elemen, {
            childList: true,
            characterData: true,
            subtree: true
        });
    });


    function animasiAngkaAdmin(
        elemen,
        awal,
        akhir
    ) {
        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            elemen.textContent = akhir;
            return;
        }

        elemen.dataset.motionRunning = "1";

        const durasi = 480;
        const mulai = performance.now();


        function frame(waktu) {
            const progress =
                Math.min(
                    (waktu - mulai) / durasi,
                    1
                );

            const easing =
                1 - Math.pow(1 - progress, 3);

            const nilai =
                Math.round(
                    awal +
                    (akhir - awal) *
                    easing
                );

            elemen.textContent = nilai;

            if (progress < 1) {
                requestAnimationFrame(frame);
                return;
            }

            elemen.textContent = akhir;

            setTimeout(() => {
                elemen.dataset.motionRunning = "0";
            }, 0);
        }

        requestAnimationFrame(frame);
    }
/* =====================================================
   PENGATURAN ADMIN + PREVIEW FOTO
===================================================== */

// Referensi lokal modul pengaturan.
// Jangan bergantung pada "global element by id" milik browser.
const pengaturanAbsensiFormModule = document.getElementById("pengaturanAbsensiForm");
const tanggalMulaiPerhitunganFormModule = document.getElementById("tanggalMulaiPerhitunganForm");
const simpanTanggalMulaiBtnModule = document.getElementById("simpanTanggalMulaiBtn");
const hariKerjaFormModule = document.getElementById("hariKerjaForm");
const simpanHariKerjaBtnModule = document.getElementById("simpanHariKerjaBtn");
const simpanPengaturanBtnModule = document.getElementById("simpanPengaturanBtn");
const resetPengaturanBtnModule = document.getElementById("resetPengaturanBtn");
const gunakanLokasiKantorBtnModule = document.getElementById("gunakanLokasiKantorBtn");
const fotoAbsensiModalModule = document.getElementById("fotoAbsensiModal");
const fotoAbsensiPreviewModule = document.getElementById("fotoAbsensiPreview");
const fotoAbsensiLoadingModule = document.getElementById("fotoAbsensiLoading");
const fotoAbsensiJudulModule = document.getElementById("fotoAbsensiJudul");
const tutupFotoAbsensiBtnModule = document.getElementById("tutupFotoAbsensiBtn");

const settingIdsModule = [
    "Radius","Latitude","Longitude","TanggalMulaiPerhitungan",
    "MasukMulai","JamLambat","MasukSelesai","KeluarMulai","KeluarSelesai"
];
const settingElModule = Object.fromEntries(
    settingIdsModule.map(k => [k, document.getElementById("setting" + k)])
);

function tokenAdminModule() {
    return localStorage.getItem("adminToken") || "";
}

let antreanPengaturan = Promise.resolve();

async function requestAdminModule(payload, timeout = 60000) {
    const token = tokenAdminModule();
    if (!token) throw new Error("Sesi admin tidak tersedia. Silakan login kembali.");

    const jalankan = () => postData({ ...payload, adminToken: token }, timeout);
    const hasil = antreanPengaturan.then(jalankan, jalankan);

    // Request pengaturan dibuat berurutan agar Apps Script tidak dibanjiri request bersamaan.
    antreanPengaturan = hasil.catch(() => {});
    return hasil;
}

function isiFormPengaturan(p = {}) {
    const values = { Radius:p.radius, Latitude:p.latitude, Longitude:p.longitude, TanggalMulaiPerhitungan:p.tanggalMulaiPerhitungan, MasukMulai:p.masukMulai, JamLambat:p.jamLambat, MasukSelesai:p.masukSelesai, KeluarMulai:p.keluarMulai, KeluarSelesai:p.keluarSelesai };
    Object.entries(values).forEach(([k,v]) => { if (settingElModule[k]) settingElModule[k].value = v ?? ""; });
    const aktif = new Set((Array.isArray(p.hariKerjaAktif) ? p.hariKerjaAktif : [1,2,3,4,5]).map(String));
    hariKerjaFormModule?.querySelectorAll('input[name="hariKerja"]').forEach(cb => cb.checked = aktif.has(cb.value));
}

window.__muatPengaturanAdminImpl = async function() {
    if (!pengaturanAbsensiFormModule) return;
    setButtonLoading(simpanPengaturanBtnModule, true, "Memuat...");
    try {
        const r = await postData({ action:"ambilPengaturanAbsensi" }, 30000);
        if (!r.berhasil) throw new Error(r.pesan || "Pengaturan gagal dimuat.");
        isiFormPengaturan(r.pengaturan);
    } catch (e) { appToast(e.message, "error"); }
    finally { setButtonLoading(simpanPengaturanBtnModule, false); }
};

hariKerjaFormModule?.addEventListener("submit", async e => {
    e.preventDefault();
    const hari = [...hariKerjaFormModule.querySelectorAll('input[name="hariKerja"]:checked')].map(x => Number(x.value));
    if (!hari.length) return appToast("Pilih minimal satu hari kerja.", "error");
    const yakin = await tampilkanDialogKonfirmasi("Hari yang dipilih akan dipakai untuk perhitungan TK dan rekap. Hari libur tetap dikecualikan.", { judul:"Simpan Hari Kerja?", teksKonfirmasi:"Ya, Simpan", icon:"ðŸ“…" });
    if (!yakin) return;
    setButtonLoading(simpanHariKerjaBtnModule, true, "Menyimpan...");
    try {
        const hasil = await requestAdminModule({ action:"simpanHariKerjaAdmin", hariKerjaAktif:hari });
        if (!hasil.berhasil) throw new Error(hasil.pesan || "Hari kerja gagal disimpan.");
        isiFormPengaturan(hasil.pengaturan);
        appToast(hasil.pesan || "Hari kerja berhasil disimpan.");
    } catch(err) { appToast(err.message, "error"); }
    finally { setButtonLoading(simpanHariKerjaBtnModule, false); }
});

tanggalMulaiPerhitunganFormModule?.addEventListener("submit", async e => {
    e.preventDefault();
    const tanggal = settingElModule.TanggalMulaiPerhitungan?.value;
    if (!tanggal) return appToast("Pilih tanggal mulai perhitungan.", "error");
    const yakin = await tampilkanDialogKonfirmasi(
        "Tanggal mulai akan diubah menjadi " + tanggal + ". Radius, lokasi, dan jam absensi tidak berubah.",
        { judul:"Simpan Tanggal Mulai?", teksKonfirmasi:"Ya, Simpan", icon:"ðŸ“…" }
    );
    if (!yakin) return;
    setButtonLoading(simpanTanggalMulaiBtnModule, true, "Menyimpan...");
    try {
        const r = await requestAdminModule({ action:"simpanTanggalMulaiPerhitunganAdmin", tanggalMulaiPerhitungan:tanggal });
        if (!r.berhasil) throw new Error(r.pesan || "Tanggal gagal disimpan.");
        isiFormPengaturan(r.pengaturan);
        terapkanPengaturanAbsensi(r.pengaturan);
        appToast(r.pesan || "Tanggal mulai berhasil disimpan.");
    } catch(err) { appToast(err.message || "Tanggal gagal disimpan.", "error"); }
    finally { setButtonLoading(simpanTanggalMulaiBtnModule, false); }
});

pengaturanAbsensiFormModule?.addEventListener("submit", async e => {
    e.preventDefault();
    const yakin = await tampilkanDialogKonfirmasi("Simpan pengaturan absensi baru? Perubahan akan langsung dipakai oleh sistem.", { judul:"Konfirmasi Pengaturan", teksKonfirmasi:"Ya, Simpan", icon:"âš™ï¸" });
    if (!yakin) return;
    const pengaturan = {
        radius: settingElModule.Radius?.value, latitude: settingElModule.Latitude?.value, longitude: settingElModule.Longitude?.value,
        tanggalMulaiPerhitungan: settingElModule.TanggalMulaiPerhitungan?.value,
        masukMulai: settingElModule.MasukMulai?.value, jamLambat: settingElModule.JamLambat?.value, masukSelesai: settingElModule.MasukSelesai?.value,
        keluarMulai: settingElModule.KeluarMulai?.value, keluarSelesai: settingElModule.KeluarSelesai?.value
    };
    setButtonLoading(simpanPengaturanBtnModule, true, "Menyimpan...");
    try {
        const r = await requestAdminModule({ action:"simpanPengaturanAdmin", pengaturan });
        if (!r.berhasil) throw new Error(r.pesan || "Pengaturan gagal disimpan.");
        terapkanPengaturanAbsensi(r.pengaturan);
        appToast(r.pesan || "Pengaturan berhasil disimpan.");
    } catch (e) { appToast(e.message, "error"); }
    finally { setButtonLoading(simpanPengaturanBtnModule, false); }
});

resetPengaturanBtnModule?.addEventListener("click", async () => {
    const yakin = await tampilkanDialogKonfirmasi(
        "Semua pengaturan lokasi, radius, jam absensi, dan tanggal mulai perhitungan akan dikembalikan ke default. Lanjutkan?",
        { judul:"Reset ke Default?", teksKonfirmasi:"Ya, Reset", icon:"â†º" }
    );
    if (!yakin) return;
    [simpanPengaturanBtnModule, simpanTanggalMulaiBtnModule, simpanHariKerjaBtnModule].forEach(btn => { if (btn) btn.disabled = true; });
    setButtonLoading(resetPengaturanBtnModule, true, "Mereset...");
    try {
        const r = await requestAdminModule({ action:"resetPengaturanAdmin" });
        if (!r.berhasil) throw new Error(r.pesan || "Reset pengaturan gagal.");
        isiFormPengaturan(r.pengaturan);
        terapkanPengaturanAbsensi(r.pengaturan);
        appToast(r.pesan || "Pengaturan kembali ke default.");
    } catch (e) { appToast(e.message, "error"); }
    finally {
        setButtonLoading(resetPengaturanBtnModule, false);
        [simpanPengaturanBtnModule, simpanTanggalMulaiBtnModule, simpanHariKerjaBtnModule].forEach(btn => { if (btn) btn.disabled = false; });
    }
});

gunakanLokasiKantorBtnModule?.addEventListener("click", () => {
    if (!navigator.geolocation) return appToast("GPS tidak tersedia di perangkat ini.", "error");
    setButtonLoading(gunakanLokasiKantorBtnModule, true, "Mencari lokasi...");
    navigator.geolocation.getCurrentPosition(pos => {
        if (settingElModule.Latitude) settingElModule.Latitude.value = pos.coords.latitude.toFixed(7);
        if (settingElModule.Longitude) settingElModule.Longitude.value = pos.coords.longitude.toFixed(7);
        setButtonLoading(gunakanLokasiKantorBtnModule, false);
        appToast("Lokasi perangkat berhasil dimasukkan. Periksa sebelum menyimpan.");
    }, () => {
        setButtonLoading(gunakanLokasiKantorBtnModule, false);
        appToast("Lokasi tidak dapat diambil. Pastikan izin GPS aktif.", "error");
    }, { enableHighAccuracy:true, timeout:15000, maximumAge:0 });
});

async function muatThumbnailFotoAdmin(btn) {
    if (!btn || btn.dataset.loaded || btn.dataset.loading) return;
    btn.dataset.loading = "1";
    const img = btn.querySelector("img");
    const loading = btn.querySelector(".absensi-foto-loading");
    try {
        const r = await requestAdminModule({ action:"ambilFotoAbsensiAdmin", fotoUrl:btn.dataset.foto });
        if (!r.berhasil || !r.dataUrl) throw new Error(r.pesan || "Foto gagal dimuat.");
        if (img) {
            img.src = r.dataUrl;
            img.hidden = false;
        }
        if (loading) loading.hidden = true;
        btn.dataset.loaded = "1";
    } catch (e) {
        if (loading) loading.textContent = "!";
        btn.title = e.message || "Foto gagal dimuat.";
    } finally {
        delete btn.dataset.loading;
    }
}

function muatThumbnailFotoTerlihat() {
    document.querySelectorAll(".absensi-foto-thumb:not([data-loaded]):not([data-loading])").forEach(muatThumbnailFotoAdmin);
}

async function bukaPreviewFotoAdmin(url, nama) {
    if (!fotoAbsensiModalModule || !url) return;
    if (fotoAbsensiJudulModule) fotoAbsensiJudulModule.textContent = "Foto " + (nama || "Pegawai");
    if (fotoAbsensiPreviewModule) { fotoAbsensiPreviewModule.hidden = true; fotoAbsensiPreviewModule.removeAttribute("src"); }
    if (fotoAbsensiLoadingModule) { fotoAbsensiLoadingModule.hidden = false; fotoAbsensiLoadingModule.textContent = "Memuat foto..."; }
    fotoAbsensiModalModule.hidden = false;
    try {
        const r = await requestAdminModule({ action:"ambilFotoAbsensiAdmin", fotoUrl:url });
        if (!r.berhasil || !r.dataUrl) throw new Error(r.pesan || "Foto gagal dimuat.");
        if (fotoAbsensiPreviewModule) { fotoAbsensiPreviewModule.src = r.dataUrl; fotoAbsensiPreviewModule.hidden = false; }
        if (fotoAbsensiLoadingModule) fotoAbsensiLoadingModule.hidden = true;
    } catch (e) {
        if (fotoAbsensiLoadingModule) fotoAbsensiLoadingModule.textContent = e.message || "Foto gagal dimuat.";
    }
}

function tutupPreviewFotoAdmin() { if (fotoAbsensiModal) fotoAbsensiModalModule.hidden = true; }
tutupFotoAbsensiBtnModule?.addEventListener("click", tutupPreviewFotoAdmin);
fotoAbsensiModalModule?.querySelector(".admin-modal-backdrop")?.addEventListener("click", tutupPreviewFotoAdmin);
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".foto-preview-btn");
    if (btn) bukaPreviewFotoAdmin(btn.dataset.foto, btn.dataset.nama);
});


const observerFotoAbsensi = new MutationObserver(() => muatThumbnailFotoTerlihat());
const tabelFotoAbsensi = document.querySelector("#tabelAbsensi tbody, #absensiTable tbody, #riwayatAbsensi tbody, .admin-table tbody");
if (tabelFotoAbsensi) observerFotoAbsensi.observe(tabelFotoAbsensi, { childList:true });
muatThumbnailFotoTerlihat();



})();


