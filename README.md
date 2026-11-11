# Philia Kensaku 🌸
> **Migrasi data: 11 November 2026**

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![Status: Active](https://img.shields.io/badge/Status-Active-success.svg)
![Data: Static JSON](https://img.shields.io/badge/Data-Static%20JSON-blue.svg)

**Platform Pencarian TSK (Registered Support Organizations) & Strategi Karir untuk Tokutei Ginou Indonesia.**

Philia Kensaku adalah inisiatif **Non-Profit** dari komunitas untuk membantu pekerja Indonesia mencari lembaga pendukung (TSK) yang aman, valid, dan terpercaya di Jepang tanpa biaya sepeserpun.

---

## 🌟 Fitur Utama

### 1. 📊 Data Center TSK
Pusat data statistik yang dihitung langsung di perangkat pengunjung dari snapshot data resmi.
- **Sector Heatmap**: Visualisasi peta Jepang yang dinamis per bidang SSW (19 bidang).
- **Regional Spotlight**: Klik prefektur manapun untuk melihat **"Rapor Wilayah"** berisi Top 3 Industri dominan.
- **Transparency Protocol**: Dilengkapi *Smart Disclaimer* otomatis untuk mengedukasi pengguna bahwa data yang ditampilkan adalah **Jumlah TSK**, bukan jumlah lowongan.

### 2. 🔍 Pencarian Cerdas & Filter Presisi
- **Advanced Filter**: Saring TSK berdasarkan **Prefektur**, **Bahasa**, dan **Dukungan Legal vs Opsional**.
- **Smart Sorting**: Urutkan berdasarkan tanggal mulai operasi (terbaru/terlama).
- Seluruh pencarian berjalan di browser — tidak ada permintaan jaringan per pencarian.

### 3. 🏷️ Label Bidang Hasil Riset
Setiap organisasi yang sudah diriset diberi label bidang SSW beserta tingkat keyakinan
(**Tinggi** / **Sedang**). Label berasal dari riset OSINT manual per organisasi, bukan analisis AI otomatis,
sehingga setiap label punya jejak bukti yang bisa ditelusuri.

### 4. 🕵️ Protokol Detektif "Google Deep Search"
Fitur **"Cari tahu"** membuka pencarian Google dengan prompt riset yang menekankan **LINK BUKTI** untuk setiap klaim,
pencarian email HRD, dan penelusuran reputasi perusahaan.

### 5. 📝 Email Generator Otomatis
Membuat **Cover Letter** Bahasa Jepang standar bisnis (`Keigo`) secara otomatis, menyesuaikan bidang SSW,
sertifikat JLPT/SSW, dan pengalaman kerja.

---

## 🏗️ Cara Kerja Data

Tidak ada database dan tidak ada API key di dalam aplikasi. Saat dibuka:

1. Browser mengunduh `public/data/manifest.json` (±1,5 KB) dan `public/data/tsk.json` (±1 MB terkompresi).
2. Semua pencarian, filter, pengurutan, dan statistik dihitung di browser.

### Sumber & turunan

| Berkas | Peran |
|---|---|
| `tsk.json` (master) | 1 baris per kantor (pusat + cabang), data resmi |
| `ssw_labels.json` (master) | label bidang SSW per nomor registrasi |
| `index.json` (master) | definisi 19 bidang SSW |
| `scripts/build-data.mjs` | mengubah master → format aplikasi |
| `public/data/tsk.json` | hasil build, dipakai aplikasi |
| `public/data/manifest.json` | metadata, jumlah, daftar bahasa |

### Cara memperbarui data

```bash
# 1. Taruh master terbaru di folder ../tsk (tsk.json, ssw_labels.json, index.json)
# 2. Bangun ulang berkas aplikasi
npm run data

# 3. Cek hasilnya
npm run typecheck && npm run build

# 4. Commit + deploy seperti biasa
```

Aturan yang dipakai saat build:
- Label bidang diambil dari `ssw_labels.json` lewat pencocokan `registration_number`.
- **Statistik sektor hanya menghitung baris `office_type = "Main"`** — cabang berbagi label dengan
  kantor pusat, jadi kalau ikut dihitung angkanya membengkak.
- Prefektur ditentukan dari teks alamat kantor. Baris yang tidak bisa dipastikan dibiarkan `null`
  dan ditampilkan terpisah, bukan ditebak.

---

## ⚖️ Lisensi & Legalitas

Proyek ini dilisensikan di bawah **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

### Anda Diizinkan Untuk:
- **Berbagi**: Menyalin dan menyebarluaskan materi ini dalam bentuk atau format apapun.
- **Adaptasi**: Menggubah, mengubah, dan membuat turunan dari materi ini.

### Dengan Syarat:
1.  **Atribusi (BY)**: Anda harus mencantumkan nama **Philia Kensaku** & **Philia Space Community** sebagai pembuat asli.
2.  **Non-Komersial (NC)**: Anda **TIDAK BOLEH** menggunakan materi/data ini untuk tujuan komersial (Jual beli data, layanan berbayar, dll).
3.  **Berbagi Serupa (SA)**: Jika Anda mengubah atau membuat turunan dari materi ini, Anda harus menyebarluaskannya di bawah lisensi yang sama (Gratis & Terbuka).

📄 *Lihat file [LICENSE.txt](./LICENSE.txt) untuk teks hukum lengkap.*

---

## 🤝 Kredit & Penanggung Jawab

Aplikasi ini dikembangkan dan dikelola oleh:

*   **Komunitas**: Philia Space Community
*   **Operator & Lead Developer**: **Putera Perdana Gemilang Baang**
*   **Sumber Data**: Kementerian Kehakiman Jepang (Ministry of Justice - MOJ)

> *Saya, Putera Perdana Gemilang Baang, bertanggung jawab penuh atas operasional, kurasi data, dan pemeliharaan sistem ini. Segala ketidakakuratan data adalah tanggung jawab operator dan bukan afiliasi pihak ketiga.*

---

## ⚠️ Disclaimer (Penafian)

Aplikasi ini adalah **Alat Bantu Riset (Research Tool)**.
- Philia Kensaku **BUKAN** agen penyalur (LPK/SO).
- Philia Kensaku **BUKAN** perwakilan pemerintah Indonesia maupun Jepang.
- Kami **TIDAK** memungut biaya sepeserpun.

Data disajikan sebagai snapshot dan dapat berbeda dengan publikasi resmi terbaru. Selalu lakukan verifikasi mandiri (*Double Check*) sebelum mengambil keputusan karir.

---

### 🛠️ Cara Instalasi (Developer)

```bash
# 1. Clone Repo
git clone https://github.com/philiaspaceai/Philia-Kensaku.git
cd Philia-Kensaku

# 2. Install Dependencies
npm install

# 3. Jalankan Mode Dev
npm run dev

# 4. (Opsional) Bangun ulang data dari master
npm run data
```

_Dibuat dengan ❤️ untuk Pejuang Devisa Indonesia._
