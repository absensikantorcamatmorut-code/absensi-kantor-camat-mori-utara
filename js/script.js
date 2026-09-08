const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwy1siAVLLsWqtnTaL4yHfgsMuKP_CsZOLMpxvfmrYg4YHZSwzgpJ1RAOlFc5xTbXlSug/exec";

const KANTOR = {
    latitude: -1.9246196360760033,
    longitude: 120.96947352100753,
    radius: 150
};


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {
    const loginStatus =
        document.getElementById("loginStatus");

    const loginButton =
        loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            const nama =
                document
                    .getElementById("loginNama")
                    .value
                    .trim();

            const nip =
                document
                    .getElementById("loginNip")
                    .value
                    .trim();

            loginStatus.textContent =
                "Memeriksa akun...";

            if (loginButton) {
                loginButton.disabled = true;
            }

            try {
                const hasil =
                    await postData({
                        action: "login",
                        nama: nama,
                        nip: nip
                    });

                if (!hasil.berhasil) {
                    loginStatus.textContent =
                        hasil.pesan ||
                        "Nama atau NIP salah.";

                    return;
                }

                localStorage.setItem(
                    "nama",
                    hasil.nama
                );

                localStorage.setItem(
                    "nip",
                    hasil.nip
                );

                localStorage.setItem(
                    "role",
                    hasil.role
                );

                loginStatus.textContent =
                    "Login berhasil";

                if (hasil.role === "admin") {
                    window.location.href =
                        "admin.html";
                } else {
                    window.location.href =
                        "absensi.html";
                }

            } catch (error) {
                console.error(error);

                loginStatus.textContent =
                    error.message ||
                    "Login gagal. Periksa koneksi.";

            } finally {
                if (loginButton) {
                    loginButton.disabled = false;
                }
            }
        }
    );
}


/* =====================================================
   ABSENSI PEGAWAI
===================================================== */

const absensiForm =
    document.getElementById("absensiForm");

if (absensiForm) {
    const namaLogin =
        localStorage.getItem("nama");

    const nipLogin =
        localStorage.getItem("nip");

    if (!namaLogin || !nipLogin) {
        window.location.href =
            "index.html";
    }

    const namaPegawai =
        document.getElementById(
            "namaPegawai"
        );

    const nipPegawai =
        document.getElementById(
            "nipPegawai"
        );

    const avatarHuruf =
        document.getElementById(
            "avatarHuruf"
        );

    const tanggalSekarang =
        document.getElementById(
            "tanggalSekarang"
        );

    const jamSekarang =
        document.getElementById(
            "jamSekarang"
        );

    const detikSekarang =
        document.getElementById(
            "detikSekarang"
        );

    const statusHariText =
        document.getElementById(
            "statusHariText"
        );

    const jenisAbsenInput =
        document.getElementById(
            "jenisAbsen"
        );

    const attendanceOptions =
        document.querySelectorAll(
            ".attendance-option"
        );

    const masukOption =
        document.querySelector(
            ".masuk-option"
        );

    const keluarOption =
        document.querySelector(
            ".keluar-option"
        );

    const lokasiBtn =
        document.getElementById(
            "lokasiBtn"
        );

    const statusLokasi =
        document.getElementById(
            "statusLokasi"
        );

    const akurasiLokasi =
        document.getElementById(
            "akurasiLokasi"
        );

    const cameraLiveContainer =
        document.getElementById(
            "cameraLiveContainer"
        );

    const cameraVideo =
        document.getElementById(
            "cameraVideo"
        );

    const cameraPlaceholder =
        document.getElementById(
            "cameraPlaceholder"
        );

    const aktifkanKameraBtn =
        document.getElementById(
            "aktifkanKameraBtn"
        );

    const ambilFotoBtn =
        document.getElementById(
            "ambilFotoBtn"
        );

    const cameraCanvas =
        document.getElementById(
            "cameraCanvas"
        );

    const previewFoto =
        document.getElementById(
            "previewFoto"
        );

    const photoPreviewWrapper =
        document.getElementById(
            "photoPreviewWrapper"
        );

    const ulangFotoBtn =
        document.getElementById(
            "ulangFotoBtn"
        );

    const checkJenis =
        document.getElementById(
            "checkJenis"
        );

    const checkLokasi =
        document.getElementById(
            "checkLokasi"
        );

    const checkFoto =
        document.getElementById(
            "checkFoto"
        );

    const submitAbsensi =
        document.getElementById(
            "submitAbsensi"
        );

    const submitText =
        document.getElementById(
            "submitText"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    const toast =
        document.getElementById(
            "toast"
        );

    const toastIcon =
        document.getElementById(
            "toastIcon"
        );

    const toastTitle =
        document.getElementById(
            "toastTitle"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    let latitude = null;
    let longitude = null;
    let accuracy = null;
    let jarakKantor = null;

    let fotoBase64 = null;
    let cameraStream = null;

    let sudahMasuk = false;
    let sudahKeluar = false;

    let toastTimer;

    namaPegawai.textContent =
        namaLogin;

    nipPegawai.textContent =
        nipLogin;

    avatarHuruf.textContent =
        namaLogin
            .charAt(0)
            .toUpperCase();


    /* =============================
       JAM WITA
    ============================= */

    function updateJam() {
        const sekarang =
            new Date();

        tanggalSekarang.textContent =
            new Intl.DateTimeFormat(
                "id-ID",
                {
                    timeZone:
                        "Asia/Makassar",

                    weekday:
                        "long",

                    day:
                        "numeric",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            ).format(sekarang);

        const waktu =
            new Intl.DateTimeFormat(
                "id-ID",
                {
                    timeZone:
                        "Asia/Makassar",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hour12:
                        false
                }
            ).formatToParts(sekarang);

        const hour =
            waktu.find(
                item =>
                    item.type === "hour"
            )?.value || "00";

        const minute =
            waktu.find(
                item =>
                    item.type === "minute"
            )?.value || "00";

        const second =
            waktu.find(
                item =>
                    item.type === "second"
            )?.value || "00";

        jamSekarang.textContent =
            hour + ":" + minute;

        detikSekarang.textContent =
            second;
    }

    updateJam();

    setInterval(
        updateJam,
        1000
    );


    /* =============================
       STATUS ABSENSI HARI INI
    ============================= */

    async function cekStatusHariIni() {
        statusHariText.textContent =
            "Memeriksa status...";

        try {
            const hasil =
                await postData({
                    action:
                        "statusAbsensi",

                    nip:
                        nipLogin
                });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan ||
                    "Status gagal diperiksa."
                );
            }

            sudahMasuk =
                Boolean(
                    hasil.sudahMasuk
                );

            sudahKeluar =
                Boolean(
                    hasil.sudahKeluar
                );

            updatePilihanAbsensi();

        } catch (error) {
            console.error(error);

            statusHariText.textContent =
                "Status tidak dapat diperiksa";
        }
    }


    function updatePilihanAbsensi() {
        masukOption.disabled =
            sudahMasuk;

        keluarOption.disabled =
            !sudahMasuk ||
            sudahKeluar;

        if (
            !sudahMasuk &&
            !sudahKeluar
        ) {
            statusHariText.textContent =
                "Belum melakukan absensi hari ini";
        }

        if (
            sudahMasuk &&
            !sudahKeluar
        ) {
            statusHariText.textContent =
                "Masuk sudah tercatat · Menunggu absensi Keluar";
        }

        if (
            sudahMasuk &&
            sudahKeluar
        ) {
            statusHariText.textContent =
                "Absensi hari ini sudah selesai";
        }
    }

    cekStatusHariIni();


    /* =============================
       JENIS ABSENSI
    ============================= */

    attendanceOptions.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    if (button.disabled) {
                        return;
                    }

                    attendanceOptions
                        .forEach(
                            function (item) {
                                item.classList
                                    .remove(
                                        "active"
                                    );
                            }
                        );

                    button.classList.add(
                        "active"
                    );

                    jenisAbsenInput.value =
                        button.dataset.value;

                    updateStatusForm();
                }
            );
        }
    );


    /* =============================
       GPS
    ============================= */

    lokasiBtn.addEventListener(
        "click",
        function () {
            if (
                !navigator.geolocation
            ) {
                tampilkanToast(
                    "error",
                    "GPS tidak tersedia",
                    "Browser tidak mendukung lokasi."
                );

                return;
            }

            lokasiBtn.disabled =
                true;

            statusLokasi.textContent =
                "Mencari lokasi...";

            akurasiLokasi.textContent =
                "Mohon tunggu";

            navigator.geolocation
                .getCurrentPosition(
                    function (position) {
                        latitude =
                            position.coords
                                .latitude;

                        longitude =
                            position.coords
                                .longitude;

                        accuracy =
                            position.coords
                                .accuracy;

                        jarakKantor =
                            hitungJarakMeter(
                                latitude,
                                longitude,
                                KANTOR.latitude,
                                KANTOR.longitude
                            );

                        lokasiBtn.disabled =
                            false;

                        if (
                            jarakKantor <=
                            KANTOR.radius
                        ) {
                            lokasiBtn
                                .classList
                                .remove(
                                    "location-error"
                                );

                            lokasiBtn
                                .classList
                                .add(
                                    "location-success"
                                );

                            statusLokasi.textContent =
                                "Lokasi sesuai ✓";

                            akurasiLokasi.textContent =
                                "Jarak ±" +
                                Math.round(
                                    jarakKantor
                                ) +
                                " m dari kantor · Akurasi GPS ±" +
                                Math.round(
                                    accuracy
                                ) +
                                " m";

                            tampilkanToast(
                                "success",
                                "Lokasi sesuai",
                                "Anda berada dalam radius kantor."
                            );

                        } else {
                            lokasiBtn
                                .classList
                                .remove(
                                    "location-success"
                                );

                            lokasiBtn
                                .classList
                                .add(
                                    "location-error"
                                );

                            statusLokasi.textContent =
                                "Di luar area absensi";

                            akurasiLokasi.textContent =
                                "Jarak ±" +
                                Math.round(
                                    jarakKantor
                                ) +
                                " m · Maksimal 150 m";

                            tampilkanToast(
                                "error",
                                "Di luar radius",
                                "Anda berada sekitar " +
                                Math.round(
                                    jarakKantor
                                ) +
                                " meter dari kantor."
                            );
                        }

                        updateStatusForm();
                    },

                    function (error) {
                        latitude = null;
                        longitude = null;
                        accuracy = null;
                        jarakKantor = null;

                        lokasiBtn.disabled =
                            false;

                        lokasiBtn
                            .classList
                            .remove(
                                "location-success"
                            );

                        lokasiBtn
                            .classList
                            .add(
                                "location-error"
                            );

                        statusLokasi.textContent =
                            "Lokasi gagal diambil";

                        if (error.code === 1) {
                            akurasiLokasi.textContent =
                                "Izin lokasi ditolak";

                        } else if (
                            error.code === 2
                        ) {
                            akurasiLokasi.textContent =
                                "Lokasi tidak tersedia";

                        } else {
                            akurasiLokasi.textContent =
                                "Silakan coba kembali";
                        }

                        updateStatusForm();
                    },

                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            15000,

                        maximumAge:
                            0
                    }
                );
        }
    );


    /* =============================
       KAMERA
    ============================= */

    aktifkanKameraBtn
        .addEventListener(
            "click",
            aktifkanKamera
        );


    async function aktifkanKamera() {
        cameraLiveContainer.style.display =
            "flex";

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices
                .getUserMedia
        ) {
            tampilkanToast(
                "error",
                "Kamera tidak tersedia",
                "Gunakan browser yang mendukung akses kamera."
            );

            return;
        }

        try {
            hentikanKamera();

            cameraStream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        video: {
                            facingMode:
                                "user",

                            width: {
                                ideal: 720
                            },

                            height: {
                                ideal: 720
                            }
                        },

                        audio: false
                    });

            cameraVideo.srcObject =
                cameraStream;

            cameraVideo.classList.add(
                "active"
            );

            cameraPlaceholder.style.display =
                "none";

            aktifkanKameraBtn.hidden =
                true;

            ambilFotoBtn.hidden =
                false;

            photoPreviewWrapper
                .classList
                .remove(
                    "active"
                );

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


    ambilFotoBtn.addEventListener(
        "click",
        function () {
            if (!cameraStream) {
                return;
            }

            const videoWidth =
                cameraVideo.videoWidth;

            const videoHeight =
                cameraVideo.videoHeight;

            if (
                !videoWidth ||
                !videoHeight
            ) {
                tampilkanToast(
                    "error",
                    "Kamera belum siap",
                    "Tunggu sebentar lalu coba lagi."
                );

                return;
            }

            /*
               Foto absensi tidak membutuhkan
               resolusi kamera penuh.

               Maksimum 720 px membuat upload
               jauh lebih ringan.
            */

            const maxSize = 720;

            let width =
                videoWidth;

            let height =
                videoHeight;

            if (
                width > maxSize ||
                height > maxSize
            ) {
                const ratio =
                    Math.min(
                        maxSize / width,
                        maxSize / height
                    );

                width =
                    Math.round(
                        width * ratio
                    );

                height =
                    Math.round(
                        height * ratio
                    );
            }

            cameraCanvas.width =
                width;

            cameraCanvas.height =
                height;

            const context =
                cameraCanvas.getContext(
                    "2d"
                );

            context.save();

            context.translate(
                width,
                0
            );

            context.scale(
                -1,
                1
            );

            context.drawImage(
                cameraVideo,
                0,
                0,
                width,
                height
            );

            context.restore();

            /*
               JPEG quality 0.65 cukup untuk
               dokumentasi absensi tetapi
               ukurannya lebih kecil.
            */

            const fotoData =
                cameraCanvas.toDataURL(
                    "image/jpeg",
                    0.65
                );

            fotoBase64 =
                fotoData.split(",")[1];

            previewFoto.src =
                fotoData;

            photoPreviewWrapper
                .classList
                .add(
                    "active"
                );

            /*
               Hilangkan kotak kamera setelah
               foto selesai diambil.
            */

            cameraLiveContainer.style.display =
                "none";

            cameraVideo.classList.remove(
                "active"
            );

            ambilFotoBtn.hidden =
                true;

            aktifkanKameraBtn.hidden =
                true;

            hentikanKamera();

            updateStatusForm();

            tampilkanToast(
                "success",
                "Foto siap",
                "Foto absensi berhasil diambil."
            );
        }
    );


    ulangFotoBtn.addEventListener(
        "click",
        function () {
            fotoBase64 = null;

            previewFoto.src = "";

            photoPreviewWrapper
                .classList
                .remove(
                    "active"
                );

            cameraLiveContainer.style.display =
                "flex";

            aktifkanKameraBtn.hidden =
                false;

            updateStatusForm();

            aktifkanKamera();
        }
    );


    function hentikanKamera() {
        if (!cameraStream) {
            return;
        }

        cameraStream
            .getTracks()
            .forEach(
                function (track) {
                    track.stop();
                }
            );

        cameraStream = null;
        cameraVideo.srcObject = null;
    }


    /* =============================
       STATUS FORM
    ============================= */

    function updateStatusForm() {
        const jenisSiap =
            jenisAbsenInput.value !== "";

        const lokasiSiap =
            latitude !== null &&
            longitude !== null &&
            jarakKantor !== null &&
            jarakKantor <=
                KANTOR.radius;

        const fotoSiap =
            fotoBase64 !== null;

        updateRequirement(
            checkJenis,
            jenisSiap
        );

        updateRequirement(
            checkLokasi,
            lokasiSiap
        );

        updateRequirement(
            checkFoto,
            fotoSiap
        );

        const semuaSiap =
            jenisSiap &&
            lokasiSiap &&
            fotoSiap;

        submitAbsensi.disabled =
            !semuaSiap;

        submitText.textContent =
            semuaSiap
                ? "Kirim Absensi"
                : "Lengkapi Absensi";
    }


    function updateRequirement(
        element,
        selesai
    ) {
        const icon =
            element.querySelector(
                "span"
            );

        if (selesai) {
            element.classList.add(
                "done"
            );

            icon.textContent =
                "✓";

        } else {
            element.classList.remove(
                "done"
            );

            icon.textContent =
                "○";
        }
    }

    updateStatusForm();


    /* =============================
       KIRIM ABSENSI
    ============================= */

    absensiForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            if (
                !jenisAbsenInput.value ||
                latitude === null ||
                longitude === null ||
                jarakKantor === null ||
                jarakKantor >
                    KANTOR.radius ||
                !fotoBase64
            ) {
                tampilkanToast(
                    "error",
                    "Belum lengkap",
                    "Lengkapi absensi terlebih dahulu."
                );

                return;
            }

            submitAbsensi.disabled =
                true;

            submitText.textContent =
                "Mengirim absensi...";

            try {
                const hasil =
                    await postData(
                        {
                            action:
                                "absensi",

                            nama:
                                namaLogin,

                            nip:
                                nipLogin,

                            jenisAbsen:
                                jenisAbsenInput
                                    .value,

                            latitude:
                                latitude,

                            longitude:
                                longitude,

                            fotoBase64:
                                fotoBase64,

                            fotoType:
                                "image/jpeg"
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
                    hasil.pesan
                );

                if (
                    jenisAbsenInput.value ===
                    "Masuk"
                ) {
                    sudahMasuk = true;
                }

                if (
                    jenisAbsenInput.value ===
                    "Keluar"
                ) {
                    sudahKeluar = true;
                }

                resetFormAbsensi();

                updatePilihanAbsensi();

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


    function resetFormAbsensi() {
        jenisAbsenInput.value = "";

        attendanceOptions.forEach(
            function (button) {
                button.classList.remove(
                    "active"
                );
            }
        );

        latitude = null;
        longitude = null;
        accuracy = null;
        jarakKantor = null;

        statusLokasi.textContent =
            "Ambil lokasi sekarang";

        akurasiLokasi.textContent =
            "Lokasi belum diperiksa";

        lokasiBtn.classList.remove(
            "location-success",
            "location-error"
        );

        fotoBase64 = null;

        previewFoto.src = "";

        photoPreviewWrapper
            .classList
            .remove(
                "active"
            );

        cameraLiveContainer.style.display =
            "flex";

        cameraPlaceholder.style.display =
            "flex";

        cameraVideo.classList.remove(
            "active"
        );

        aktifkanKameraBtn.hidden =
            false;

        ambilFotoBtn.hidden =
            true;

        hentikanKamera();

        updateStatusForm();
    }


    /* =============================
       TOAST
    ============================= */

    function tampilkanToast(
        tipe,
        judul,
        pesan
    ) {
        clearTimeout(
            toastTimer
        );

        toastTitle.textContent =
            judul;

        toastMessage.textContent =
            pesan;

        toastIcon.textContent =
            tipe === "success"
                ? "✓"
                : "!";

        toast.classList.add(
            "show"
        );

        toastTimer =
            setTimeout(
                function () {
                    toast.classList.remove(
                        "show"
                    );
                },
                4000
            );
    }


    logoutBtn.addEventListener(
        "click",
        function () {
            hentikanKamera();
            logoutUser();
        }
    );

    window.addEventListener(
        "beforeunload",
        hentikanKamera
    );
}


/* =====================================================
   ADMIN
===================================================== */

const dataAbsensi =
    document.getElementById(
        "dataAbsensi"
    );

if (dataAbsensi) {
    const role =
        localStorage.getItem(
            "role"
        );

    if (role !== "admin") {
        window.location.href =
            "index.html";
    }

    const logoutAdminBtn =
        document.getElementById(
            "logoutAdminBtn"
        );

    const filterTanggal =
        document.getElementById(
            "filterTanggal"
        );

    const filterJenis =
        document.getElementById(
            "filterJenis"
        );

    const filterCari =
        document.getElementById(
            "filterCari"
        );

    const filterContainer =
        document.getElementById(
            "filterContainer"
        );

    const toggleFilterBtn =
        document.getElementById(
            "toggleFilterBtn"
        );

    const resetFilterBtn =
        document.getElementById(
            "resetFilterBtn"
        );

    const totalAbsensi =
        document.getElementById(
            "totalAbsensi"
        );

    const totalMasuk =
        document.getElementById(
            "totalMasuk"
        );

    const totalKeluar =
        document.getElementById(
            "totalKeluar"
        );

    const jumlahDataText =
        document.getElementById(
            "jumlahDataText"
        );

    let dataTanggalAktif = [];

    let requestAdminId = 0;


    logoutAdminBtn.addEventListener(
        "click",
        logoutUser
    );


    toggleFilterBtn.addEventListener(
        "click",
        function () {
            filterContainer.classList.toggle(
                "show"
            );

            const terbuka =
                filterContainer
                    .classList
                    .contains(
                        "show"
                    );

            toggleFilterBtn
                .querySelector("span")
                .textContent =
                    terbuka
                        ? "⌃"
                        : "⌄";
        }
    );


    resetFilterBtn.addEventListener(
        "click",
        function () {
            filterTanggal.value =
                tanggalWITAHariIni();

            filterJenis.value = "";
            filterCari.value = "";

            ambilDataAdmin();
        }
    );


    /*
       Kalau tanggal berubah, data baru
       diminta dari server.
    */

    filterTanggal.addEventListener(
        "change",
        function () {
            ambilDataAdmin();
        }
    );


    /*
       Jenis dan pencarian cukup difilter
       dari data tanggal yang sudah ada.
       Tidak perlu request server lagi.
    */

    filterJenis.addEventListener(
        "change",
        filterDataAdmin
    );

    filterCari.addEventListener(
        "input",
        filterDataAdmin
    );


    filterTanggal.value =
        tanggalWITAHariIni();

    ambilDataAdmin();


    async function ambilDataAdmin() {
        const tanggal =
            filterTanggal.value ||
            tanggalWITAHariIni();

        const currentRequestId =
            ++requestAdminId;

        jumlahDataText.textContent =
            "Memuat data...";

        dataAbsensi.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="loading-cell"
                >
                    Memuat data...
                </td>
            </tr>
        `;

        try {
            const hasil =
                await postData({
                    action:
                        "ambilAbsensi",

                    tanggal:
                        tanggal
                });

            /*
               Jika user mengganti tanggal
               dengan cepat, abaikan response
               request lama.
            */

            if (
                currentRequestId !==
                requestAdminId
            ) {
                return;
            }

            if (!Array.isArray(hasil)) {
                throw new Error(
                    hasil.pesan ||
                    "Data tidak valid."
                );
            }

            dataTanggalAktif =
                hasil;

            filterDataAdmin();

        } catch (error) {
            if (
                currentRequestId !==
                requestAdminId
            ) {
                return;
            }

            console.error(error);

            dataTanggalAktif = [];

            updateStatistik([]);

            jumlahDataText.textContent =
                "Gagal mengambil data";

            dataAbsensi.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="empty-cell"
                    >
                        ${escapeHTML(
                            error.message ||
                            "Gagal mengambil data absensi."
                        )}
                    </td>
                </tr>
            `;
        }
    }


    function filterDataAdmin() {
        const jenisDipilih =
            filterJenis.value;

        const kataCari =
            filterCari.value
                .toLowerCase()
                .trim();

        const hasil =
            dataTanggalAktif.filter(
                function (absen) {
                    const cocokJenis =
                        jenisDipilih === "" ||
                        String(
                            absen.jenisAbsen
                        ) === jenisDipilih;

                    const cocokCari =
                        kataCari === "" ||
                        String(
                            absen.nama
                        )
                        .toLowerCase()
                        .includes(
                            kataCari
                        ) ||
                        String(
                            absen.nip
                        )
                        .toLowerCase()
                        .includes(
                            kataCari
                        );

                    return (
                        cocokJenis &&
                        cocokCari
                    );
                }
            );

        tampilkanData(
            hasil
        );

        updateStatistik(
            hasil
        );
    }


    function updateStatistik(data) {
        const masuk =
            data.filter(
                function (item) {
                    return (
                        String(
                            item.jenisAbsen
                        )
                        .toLowerCase() ===
                        "masuk"
                    );
                }
            ).length;

        const keluar =
            data.filter(
                function (item) {
                    return (
                        String(
                            item.jenisAbsen
                        )
                        .toLowerCase() ===
                        "keluar"
                    );
                }
            ).length;

        totalAbsensi.textContent =
            data.length;

        totalMasuk.textContent =
            masuk;

        totalKeluar.textContent =
            keluar;

        jumlahDataText.textContent =
            data.length +
            " data ditampilkan";
    }


    function tampilkanData(data) {
        dataAbsensi.innerHTML = "";

        if (data.length === 0) {
            dataAbsensi.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="empty-cell"
                    >
                        Belum ada data absensi pada tanggal ini.
                    </td>
                </tr>
            `;

            return;
        }

        data.forEach(
            function (absen) {
                const row =
                    document.createElement(
                        "tr"
                    );

                const jenis =
                    String(
                        absen.jenisAbsen ||
                        "-"
                    );

                const status =
                    String(
                        absen.status ||
                        "-"
                    );

                const jenisClass =
                    jenis === "Masuk"
                        ? "badge-masuk"
                        : "badge-keluar";

                let statusClass =
                    "badge-pulang";

                if (
                    status ===
                    "Tepat Waktu"
                ) {
                    statusClass =
                        "badge-tepat";
                }

                if (
                    status ===
                    "Lambat"
                ) {
                    statusClass =
                        "badge-lambat";
                }

                row.innerHTML = `
                    <td>
                        ${formatWaktu(
                            absen.waktu
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            absen.nama
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            absen.nip
                        )}
                    </td>

                    <td>
                        <span
                            class="badge-absen ${jenisClass}"
                        >
                            ${escapeHTML(
                                jenis
                            )}
                        </span>
                    </td>

                    <td>
                        <span
                            class="badge-status ${statusClass}"
                        >
                            ${escapeHTML(
                                status
                            )}
                        </span>
                    </td>

                    <td>
                        ${
                            absen.jarak !== "" &&
                            absen.jarak !== null &&
                            absen.jarak !== undefined
                                ? escapeHTML(
                                    absen.jarak
                                  ) + " m"
                                : "-"
                        }
                    </td>

                    <td>
                        <a
                            href="${safeURL(
                                absen.lokasiMaps
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Maps
                        </a>
                    </td>

                    <td>
                        <a
                            href="${safeURL(
                                absen.foto
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Foto
                        </a>
                    </td>
                `;

                dataAbsensi.appendChild(
                    row
                );
            }
        );
    }
}


/* =====================================================
   REQUEST KE APPS SCRIPT
===================================================== */

async function postData(
    data,
    timeout = 20000
) {
    const controller =
        new AbortController();

    const timer =
        setTimeout(
            function () {
                controller.abort();
            },
            timeout
        );

    try {
        const response =
            await fetch(
                WEB_APP_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            data
                        ),

                    signal:
                        controller.signal
                }
            );

        if (!response.ok) {
            throw new Error(
                "Server tidak merespons dengan benar."
            );
        }

        return await response.json();

    } catch (error) {
        if (
            error.name ===
            "AbortError"
        ) {
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
   HITUNG JARAK GPS
===================================================== */

function hitungJarakMeter(
    lat1,
    lon1,
    lat2,
    lon2
) {
    const radiusBumi =
        6371000;

    const phi1 =
        lat1 *
        Math.PI / 180;

    const phi2 =
        lat2 *
        Math.PI / 180;

    const deltaPhi =
        (lat2 - lat1) *
        Math.PI / 180;

    const deltaLambda =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(
            deltaPhi / 2
        ) ** 2 +
        Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(
            deltaLambda / 2
        ) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return radiusBumi * c;
}


/* =====================================================
   TANGGAL WITA
===================================================== */

function tanggalWITAHariIni() {
    return tanggalWITA(
        new Date()
    );
}


function tanggalWITA(waktu) {
    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    "Asia/Makassar",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit"
            }
        )
        .formatToParts(
            new Date(waktu)
        );

    const year =
        parts.find(
            item =>
                item.type === "year"
        ).value;

    const month =
        parts.find(
            item =>
                item.type === "month"
        ).value;

    const day =
        parts.find(
            item =>
                item.type === "day"
        ).value;

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


/* =====================================================
   FORMAT WAKTU
===================================================== */

function formatWaktu(waktu) {
    const tanggal =
        new Date(waktu);

    if (
        Number.isNaN(
            tanggal.getTime()
        )
    ) {
        return "-";
    }

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            timeZone:
                "Asia/Makassar",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit",

            hour12:
                false
        }
    ).format(tanggal);
}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {
    localStorage.removeItem(
        "nama"
    );

    localStorage.removeItem(
        "nip"
    );

    localStorage.removeItem(
        "role"
    );

    window.location.href =
        "index.html";
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
        );

    if (
        url.startsWith(
            "https://"
        ) ||
        url.startsWith(
            "http://"
        )
    ) {
        return escapeHTML(
            url
        );
    }

    return "#";
}