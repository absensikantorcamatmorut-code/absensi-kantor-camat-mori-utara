const rekapPage = document.getElementById("adminRekapSection");

if (rekapPage) {
    const navAbsensiBtnRekap = document.getElementById("navAbsensiBtn");
    const navPegawaiBtnRekap = document.getElementById("navPegawaiBtn");
    const navKeteranganBtnRekap = document.getElementById("navKeteranganBtn");
    const navRekapBtn = document.getElementById("navRekapBtn");
    const navAkunAdminBtnRekap = document.getElementById("navAkunAdminBtn");

    const adminAbsensiSectionRekap = document.getElementById("adminAbsensiSection");
    const adminPegawaiSectionRekap = document.getElementById("adminPegawaiSection");
    const adminKeteranganSectionRekap = document.getElementById("adminKeteranganSection");
    const adminAkunSectionRekap = document.getElementById("adminAkunSection");

    const rekapBulan = document.getElementById("rekapBulan");
    const rekapTahun = document.getElementById("rekapTahun");
    const tampilkanRekapBtn = document.getElementById("tampilkanRekapBtn");
    const rekapPeriodeText = document.getElementById("rekapPeriodeText");

    const rekapHariKerja = document.getElementById("rekapHariKerja");
    const rekapTotalPegawai = document.getElementById("rekapTotalPegawai");
    const rekapTotalHadir = document.getElementById("rekapTotalHadir");
    const rekapTotalTerlambat = document.getElementById("rekapTotalTerlambat");

    const judulRekapBulanan = document.getElementById("judulRekapBulanan");
    const jumlahRekapText = document.getElementById("jumlahRekapText");
    const dataRekapBulanan = document.getElementById("dataRekapBulanan");

    const tambahHariLiburBtn = document.getElementById("tambahHariLiburBtn");
    const dataHariLibur = document.getElementById("dataHariLibur");
    const kalenderLiburGrid = document.getElementById("kalenderLiburGrid");
    const kalenderLiburJudul = document.getElementById("kalenderLiburJudul");
    const kalenderLiburPrev = document.getElementById("kalenderLiburPrev");
    const kalenderLiburNext = document.getElementById("kalenderLiburNext");
    const liburBulanIni = document.getElementById("liburBulanIni");
    const liburBerikutnya = document.getElementById("liburBerikutnya");

    const hariLiburModal = document.getElementById("hariLiburModal");
    const hariLiburForm = document.getElementById("hariLiburForm");
    const hariLiburTanggal = document.getElementById("hariLiburTanggal");
    const hariLiburNama = document.getElementById("hariLiburNama");

    const tutupHariLiburModalBtn = document.getElementById("tutupHariLiburModalBtn");
    const batalHariLiburBtn = document.getElementById("batalHariLiburBtn");
    const simpanHariLiburBtn = document.getElementById("simpanHariLiburBtn");

    let rekapSudahDimuat = false;
    let editHariLiburId = "";
    let daftarHariLibur = [];
    let kalenderTahun = 0;
    let kalenderBulan = 0;

    /* =====================================================
       NAVIGASI REKAP
    ===================================================== */

    function bukaHalamanRekap() {
        [
            adminAbsensiSectionRekap,
            adminPegawaiSectionRekap,
            adminKeteranganSectionRekap,
            adminAkunSectionRekap
        ].forEach(section => section?.classList.remove("active"));

        [
            navAbsensiBtnRekap,
            navPegawaiBtnRekap,
            navKeteranganBtnRekap,
            navAkunAdminBtnRekap
        ].forEach(button => button?.classList.remove("active"));

        rekapPage.classList.add("active");
        navRekapBtn?.classList.add("active");

        if (!rekapSudahDimuat) {
            aturPeriodeAwal();
            ambilRekapBulanan();
            ambilHariLibur();
            rekapSudahDimuat = true;
        }
    }

    function tutupHalamanRekap() {
        rekapPage.classList.remove("active");
        navRekapBtn?.classList.remove("active");
    }

    navRekapBtn?.addEventListener("click", bukaHalamanRekap);

    [
        navAbsensiBtnRekap,
        navPegawaiBtnRekap,
        navKeteranganBtnRekap,
        navAkunAdminBtnRekap
    ].forEach(button => {
        button?.addEventListener("click", tutupHalamanRekap);
    });

    /* =====================================================
       PERIODE
    ===================================================== */

    function aturPeriodeAwal() {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Makassar",
            year: "numeric",
            month: "2-digit"
        });

        const bagian = formatter.formatToParts(new Date());
        const tahun = bagian.find(item => item.type === "year")?.value;
        const bulan = bagian.find(item => item.type === "month")?.value;

        if (rekapBulan && bulan) rekapBulan.value = String(Number(bulan));
        if (rekapTahun && tahun) rekapTahun.value = tahun;

        kalenderTahun = Number(tahun);
        kalenderBulan = Number(bulan);
    }

    tampilkanRekapBtn?.addEventListener("click", ambilRekapBulanan);

    /* =====================================================
       AMBIL REKAP
    ===================================================== */

    async function ambilRekapBulanan() {
        const bulan = Number(rekapBulan?.value);
        const tahun = Number(rekapTahun?.value);

        if (!bulan || !tahun) {
            tampilkanInfoRekap("Pilih bulan dan tahun terlebih dahulu.");
            return;
        }

        if (typeof setButtonLoading === "function") {
            setButtonLoading(tampilkanRekapBtn, true, "Memuat...");
        } else if (tampilkanRekapBtn) {
            tampilkanRekapBtn.disabled = true;
        }

        if (dataRekapBulanan) {
            dataRekapBulanan.innerHTML =
                tableSkeleton(15);
        }

        try {
            const hasil = await postRekap({
                action: "ambilRekapBulanan",
                bulan,
                tahun
            });

            if (!hasil.berhasil) {
                throw new Error(hasil.pesan || "Rekap gagal dimuat.");
            }

            tampilkanRekap(hasil);

        } catch (error) {
            console.error(error);

            if (dataRekapBulanan) {
                dataRekapBulanan.innerHTML =
                    `<tr><td colspan="15" class="empty-cell">${escapeHTMLRekap(error.message)}</td></tr>`;
            }

            tampilkanInfoRekap(error.message);

        } finally {
            if (typeof setButtonLoading === "function") {
                setButtonLoading(tampilkanRekapBtn, false);
            } else if (tampilkanRekapBtn) {
                tampilkanRekapBtn.disabled = false;
            }
        }
    }

    function tampilkanRekap(hasil) {
        const periode = `${hasil.namaBulan || ""} ${hasil.tahun || ""}`;

        if (rekapPeriodeText) rekapPeriodeText.textContent = periode;

        if (judulRekapBulanan) {
            judulRekapBulanan.textContent = `Rekapitulasi Absensi — ${periode}`;
        }

        if (rekapHariKerja) rekapHariKerja.textContent = hasil.hariKerja ?? 0;
        if (rekapTotalPegawai) rekapTotalPegawai.textContent = hasil.totalPegawai ?? 0;
        if (rekapTotalHadir) rekapTotalHadir.textContent = hasil.totalHadir ?? 0;
        if (rekapTotalTerlambat) rekapTotalTerlambat.textContent = hasil.totalTerlambat ?? 0;

        const daftar = Array.isArray(hasil.data) ? hasil.data : [];

        if (jumlahRekapText) {
            jumlahRekapText.textContent = `${daftar.length} pegawai`;
        }

        if (!dataRekapBulanan) return;

        if (!daftar.length) {
            dataRekapBulanan.innerHTML =
                '<tr><td colspan="15" class="empty-cell">Belum ada data rekap.</td></tr>';
            return;
        }

        dataRekapBulanan.innerHTML = daftar.map(item => `
            <tr>
                <td>${escapeHTMLRekap(item.no)}</td>
                <td>${escapeHTMLRekap(item.nip)}</td>
                <td>${escapeHTMLRekap(item.nama)}</td>
                <td>${angkaRekap(item.H)}</td>
                <td>${angkaRekap(item.TAP)}</td>
                <td>${angkaRekap(item.S)}</td>
                <td>${angkaRekap(item.CT)}</td>
                <td>${angkaRekap(item.TK)}</td>
                <td>${angkaRekap(item.DD)}</td>
                <td>${angkaRekap(item.DL)}</td>
                <td>${angkaRekap(item.IM)}</td>
                <td>${angkaRekap(item.WFH)}</td>
                <td>${angkaRekap(item.MPP)}</td>
                <td>${angkaRekap(item.hariTerlambat)}</td>
                <td>${escapeHTMLRekap(item.totalTerlambat || "-")}</td>
            </tr>
        `).join("");
    }

    function angkaRekap(nilai) {
        const angka = Number(nilai) || 0;
        return angka ? angka : "-";
    }

    /* =====================================================
       TAMBAH HARI LIBUR
    ===================================================== */

    tambahHariLiburBtn?.addEventListener("click", function() {
        bukaHariLiburModalTambah();
    });

    function bukaHariLiburModalTambah() {
        if (!hariLiburModal) return;

        editHariLiburId = "";
        hariLiburForm?.reset();

        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Makassar",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

        const bagian = formatter.formatToParts(new Date());
        const y = bagian.find(item => item.type === "year")?.value;
        const m = bagian.find(item => item.type === "month")?.value;
        const d = bagian.find(item => item.type === "day")?.value;

        if (hariLiburTanggal && y && m && d) {
            hariLiburTanggal.value = `${y}-${m}-${d}`;
        }

        if (simpanHariLiburBtn) {
            simpanHariLiburBtn.textContent = "Simpan Hari Libur";
        }

        hariLiburModal.hidden = false;
        hariLiburModal.classList.add("show");

        setTimeout(() => hariLiburNama?.focus(), 50);
    }

    /* =====================================================
       EDIT HARI LIBUR
    ===================================================== */

    function bukaHariLiburModalEdit(item) {
        if (!hariLiburModal) return;

        editHariLiburId = String(item.id || "");

        if (hariLiburTanggal) {
            hariLiburTanggal.value = item.tanggal || "";
        }

        if (hariLiburNama) {
            hariLiburNama.value = item.nama || "";
        }

        if (simpanHariLiburBtn) {
            simpanHariLiburBtn.textContent = "Simpan Perubahan";
        }

        hariLiburModal.hidden = false;
        hariLiburModal.classList.add("show");

        setTimeout(() => hariLiburNama?.focus(), 50);
    }

    /* =====================================================
       TUTUP MODAL
    ===================================================== */

    tutupHariLiburModalBtn?.addEventListener("click", tutupHariLiburModal);
    batalHariLiburBtn?.addEventListener("click", tutupHariLiburModal);

    hariLiburModal?.addEventListener("click", function(event) {
        if (event.target === hariLiburModal) {
            tutupHariLiburModal();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (
            event.key === "Escape" &&
            hariLiburModal &&
            !hariLiburModal.hidden
        ) {
            tutupHariLiburModal();
        }
    });

    function tutupHariLiburModal() {
        if (!hariLiburModal) return;

        hariLiburModal.classList.remove("show");
        hariLiburModal.hidden = true;
        hariLiburForm?.reset();

        editHariLiburId = "";

        if (simpanHariLiburBtn) {
            simpanHariLiburBtn.textContent = "Simpan Hari Libur";
        }
    }

    /* =====================================================
       SIMPAN / EDIT
    ===================================================== */

    hariLiburForm?.addEventListener("submit", async function(event) {
        event.preventDefault();

        const tanggal = String(hariLiburTanggal?.value || "").trim();
        const nama = String(hariLiburNama?.value || "").trim();

        if (!tanggal) {
            tampilkanInfoRekap("Tanggal hari libur wajib dipilih.");
            return;
        }

        if (!nama) {
            tampilkanInfoRekap("Nama hari libur wajib diisi.");
            return;
        }

        const sedangEdit = Boolean(editHariLiburId);

        if (typeof setButtonLoading === "function") {
            setButtonLoading(simpanHariLiburBtn, true, "Menyimpan...");
        } else if (simpanHariLiburBtn) {
            simpanHariLiburBtn.disabled = true;
        }

        try {
            const hasil = await postRekap({
                action: sedangEdit ? "editHariLibur" : "simpanHariLibur",
                id: sedangEdit ? editHariLiburId : "",
                tanggal,
                nama
            });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan ||
                    (sedangEdit
                        ? "Hari libur gagal diperbarui."
                        : "Hari libur gagal disimpan.")
                );
            }

            tutupHariLiburModal();

            await Promise.all([
                ambilHariLibur(),
                ambilRekapBulanan()
            ]);

            tampilkanInfoRekap(
                hasil.pesan ||
                (sedangEdit
                    ? "Hari libur berhasil diperbarui."
                    : "Hari libur berhasil ditambahkan.")
            );

        } catch (error) {
            console.error(error);
            tampilkanInfoRekap(error.message);

        } finally {
            if (typeof setButtonLoading === "function") {
                setButtonLoading(simpanHariLiburBtn, false);
            } else if (simpanHariLiburBtn) {
                simpanHariLiburBtn.disabled = false;
            }
        }
    });

    /* =====================================================
       AMBIL HARI LIBUR
    ===================================================== */

    async function ambilHariLibur() {
        if (dataHariLibur) {
            dataHariLibur.innerHTML =
                tableSkeleton(3);
        }

        try {
            const hasil = await postRekap({
                action: "ambilHariLibur"
            });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan || "Hari libur gagal dimuat."
                );
            }

            daftarHariLibur = Array.isArray(hasil.data) ? hasil.data : [];
            tampilkanHariLibur(daftarHariLibur);
            tampilkanKalenderHariLibur();
            tampilkanRingkasanHariLibur();

        } catch (error) {
            console.error(error);

            if (dataHariLibur) {
                dataHariLibur.innerHTML =
                    `<tr><td colspan="3" class="empty-cell">${escapeHTMLRekap(error.message)}</td></tr>`;
            }
        }
    }

    /* =====================================================
       KALENDER HARI LIBUR
    ===================================================== */

    kalenderLiburPrev?.addEventListener("click", () => geserKalender(-1));
    kalenderLiburNext?.addEventListener("click", () => geserKalender(1));

    function geserKalender(arah) {
        kalenderBulan += arah;
        if (kalenderBulan < 1) { kalenderBulan = 12; kalenderTahun--; }
        if (kalenderBulan > 12) { kalenderBulan = 1; kalenderTahun++; }
        tampilkanKalenderHariLibur();
    }

    function tampilkanKalenderHariLibur() {
        if (!kalenderLiburGrid || !kalenderTahun || !kalenderBulan) return;

        const namaBulan = new Intl.DateTimeFormat("id-ID", { month: "long" })
            .format(new Date(kalenderTahun, kalenderBulan - 1, 1));
        kalenderLiburJudul.textContent = `${namaBulan} ${kalenderTahun}`;

        const awal = new Date(kalenderTahun, kalenderBulan - 1, 1);
        const jumlahHari = new Date(kalenderTahun, kalenderBulan, 0).getDate();
        const offset = (awal.getDay() + 6) % 7;
        const liburMap = new Map(
            daftarHariLibur.map(item => [String(item.tanggal || "").slice(0, 10), item])
        );

        const kosong = Array.from({ length: offset }, () => '<span class="calendar-day empty"></span>');
        const hari = Array.from({ length: jumlahHari }, (_, i) => {
            const day = i + 1;
            const tanggal = `${kalenderTahun}-${String(kalenderBulan).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const date = new Date(kalenderTahun, kalenderBulan - 1, day);
            const weekend = date.getDay() === 0 || date.getDay() === 6;
            const libur = liburMap.get(tanggal);
            const cls = ["calendar-day", weekend && "weekend", libur && "holiday"].filter(Boolean).join(" ");
            return `<button type="button" class="${cls}" ${libur ? `title="${escapeHTMLRekap(libur.nama || "Hari libur")}"` : ""} disabled>
                <span>${day}</span>${libur ? `<small>${escapeHTMLRekap(libur.nama || "Libur")}</small>` : ""}
            </button>`;
        });

        kalenderLiburGrid.innerHTML = [...kosong, ...hari].join("");
    }

    function tampilkanRingkasanHariLibur() {
        if (!liburBulanIni || !liburBerikutnya) return;

        const sekarang = tanggalWita();
        const bulanIni = sekarang.slice(0, 7);
        liburBulanIni.textContent = daftarHariLibur.filter(item =>
            String(item.tanggal || "").slice(0, 7) === bulanIni
        ).length;

        const berikutnya = [...daftarHariLibur]
            .filter(item => String(item.tanggal || "").slice(0, 10) >= sekarang)
            .sort((a, b) => String(a.tanggal).localeCompare(String(b.tanggal)))[0];

        liburBerikutnya.textContent = berikutnya
            ? `${formatTanggalRekap(berikutnya.tanggal)} — ${berikutnya.nama || "Hari libur"}`
            : "Belum ada";
    }

    function tanggalWita() {
        const bagian = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit"
        }).formatToParts(new Date());
        const ambil = tipe => bagian.find(item => item.type === tipe)?.value || "";
        return `${ambil("year")}-${ambil("month")}-${ambil("day")}`;
    }

    /* =====================================================
       TAMPILKAN HARI LIBUR
    ===================================================== */

    function tampilkanHariLibur(daftar) {
        if (!dataHariLibur) return;

        if (!daftar.length) {
            dataHariLibur.innerHTML =
                '<tr><td colspan="3" class="empty-cell">Belum ada hari libur tambahan.</td></tr>';
            return;
        }

        dataHariLibur.innerHTML = daftar.map(item => `
            <tr>
                <td>${escapeHTMLRekap(formatTanggalRekap(item.tanggal))}</td>

                <td>
                    ${escapeHTMLRekap(item.nama || "-")}
                </td>

                <td>
                    <div class="table-actions">
                        <button
                            type="button"
                            class="table-action edit edit-hari-libur-btn"
                            data-id="${escapeHTMLRekap(item.id)}"
                            data-tanggal="${escapeHTMLRekap(item.tanggal)}"
                            data-nama="${escapeHTMLRekap(item.nama || "")}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="table-action danger hapus-hari-libur-btn"
                            data-id="${escapeHTMLRekap(item.id)}"
                            data-nama="${escapeHTMLRekap(item.nama || "")}"
                        >
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

        dataHariLibur
            .querySelectorAll(".edit-hari-libur-btn")
            .forEach(button => {
                button.addEventListener("click", function() {
                    bukaHariLiburModalEdit({
                        id: button.dataset.id,
                        tanggal: button.dataset.tanggal,
                        nama: button.dataset.nama
                    });
                });
            });

        dataHariLibur
            .querySelectorAll(".hapus-hari-libur-btn")
            .forEach(button => {
                button.addEventListener("click", function() {
                    hapusHariLibur(
                        button.dataset.id,
                        button.dataset.nama,
                        button
                    );
                });
            });
    }

    /* =====================================================
       HAPUS HARI LIBUR
    ===================================================== */

    async function hapusHariLibur(id, nama, tombol) {
        let lanjut = true;

        if (typeof tampilkanDialogKonfirmasi === "function") {
            lanjut = await tampilkanDialogKonfirmasi(
                `Hapus hari libur "${nama}"?`,
                {
                    judul: "Hapus Hari Libur",
                    teksKonfirmasi: "Ya, Hapus",
                    bahaya: true
                }
            );
        } else {
            lanjut = window.confirm(
                `Hapus hari libur "${nama}"?`
            );
        }

        if (!lanjut) return;

        if (typeof setButtonLoading === "function") {
            setButtonLoading(tombol, true, "Menghapus...");
        } else if (tombol) {
            tombol.disabled = true;
        }

        try {
            const hasil = await postRekap({
                action: "hapusHariLibur",
                id
            });

            if (!hasil.berhasil) {
                throw new Error(
                    hasil.pesan || "Hari libur gagal dihapus."
                );
            }

            await Promise.all([
                ambilHariLibur(),
                ambilRekapBulanan()
            ]);

            tampilkanInfoRekap(
                hasil.pesan || "Hari libur berhasil dihapus."
            );

        } catch (error) {
            console.error(error);
            tampilkanInfoRekap(error.message);
        } finally {
            if (typeof setButtonLoading === "function") {
                setButtonLoading(tombol, false);
            } else if (tombol) {
                tombol.disabled = false;
            }
        }
    }

    /* =====================================================
       REQUEST
    ===================================================== */

    async function postRekap(data) {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            window.location.href = "index.html";
            throw new Error("Sesi admin tidak tersedia.");
        }

        const hasil = await postData({
            ...data,
            adminToken: token
        });

        const pesan = String(
            hasil?.pesan || ""
        ).toLowerCase();

        if (
            !hasil?.berhasil &&
            (
                pesan.includes("sesi admin") ||
                pesan.includes("login kembali")
            )
        ) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("role");
            localStorage.removeItem("nama");
            localStorage.removeItem("nip");

            window.location.href = "index.html";
        }

        return hasil;
    }

    /* =====================================================
       HELPER
    ===================================================== */

    function tampilkanInfoRekap(pesan) {
        if (typeof tampilkanDialogInfo === "function") {
            tampilkanDialogInfo(pesan);
            return;
        }

        alert(pesan);
    }

    function formatTanggalRekap(tanggal) {
        const bagian = String(tanggal || "").split("-");

        if (bagian.length !== 3) {
            return tanggal || "-";
        }

        return `${bagian[2]}/${bagian[1]}/${bagian[0]}`;
    }

    function escapeHTMLRekap(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
}

/* =====================================================
   BUAT REKAP BULANAN KE GOOGLE SHEETS
   Format sheet tetap ditangani RekapSheet.gs.
===================================================== */

const buatSheetRekapBtn = document.getElementById("buatSheetRekapBtn");

if (buatSheetRekapBtn) {
    buatSheetRekapBtn.addEventListener("click", async () => {
        const bulan = Number(document.getElementById("rekapBulan")?.value);
        const tahun = Number(document.getElementById("rekapTahun")?.value);
        const namaBulan = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        if (!bulan || !tahun) {
            return typeof appToast === "function"
                ? appToast("Pilih bulan dan tahun terlebih dahulu.", "error", "Periode Belum Dipilih")
                : alert("Pilih bulan dan tahun terlebih dahulu.");
        }

        const pesan = `Buat rekap Google Sheets untuk ${namaBulan[bulan]} ${tahun}?\n\nRekap akan dibuat menggunakan format yang sudah ditetapkan.`;
        const lanjut = typeof tampilkanDialogKonfirmasi === "function"
            ? await tampilkanDialogKonfirmasi(pesan, {
                judul: "Buat Rekap Bulanan",
                teksKonfirmasi: "Ya, Buat Rekap",
                icon: "📊"
            })
            : confirm(pesan);

        if (!lanjut) return;

        try {
            if (typeof setButtonLoading === "function") setButtonLoading(buatSheetRekapBtn, true, "Membuat Rekap...");
            else buatSheetRekapBtn.disabled = true;

            const hasil = await postData({
                action: "buatSheetRekapBulanan",
                bulan,
                tahun,
                adminToken: sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken")
            });

            if (!hasil?.berhasil) throw new Error(hasil?.pesan || "Gagal membuat rekap Google Sheets.");

            if (typeof appToast === "function") appToast(
                `${hasil.pesan || "Rekap berhasil dibuat."} Tab: ${hasil.namaSheet || "Rekap Bulanan"}`,
                "success",
                "Rekap Berhasil"
            );
            else await tampilkanDialogInfo(hasil.pesan || "Rekap berhasil dibuat.", { judul: "Rekap Berhasil Dibuat", teksTombol: "Oke" });
        } catch (error) {
            console.error("Gagal membuat rekap:", error);
            const pesanError = error.message || "Gagal membuat rekap Google Sheets.";
            if (typeof appToast === "function") appToast(pesanError, "error", "Rekap Gagal");
            else await tampilkanDialogInfo(pesanError, { judul: "Gagal Membuat Rekap", teksTombol: "Oke" });
        } finally {
            if (typeof setButtonLoading === "function") setButtonLoading(buatSheetRekapBtn, false);
            else buatSheetRekapBtn.disabled = false;
        }
    });
}
