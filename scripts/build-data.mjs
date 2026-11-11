#!/usr/bin/env node
/**
 * Bangun file data untuk aplikasi dari master dataset TSK.
 *
 * Sumber (master, sengaja terpisah & tidak diedit script ini):
 *   <master>/tsk.json          → 1 baris per kantor (Main + Branch)
 *   <master>/ssw_labels.json   → label bidang SSW per nomor registrasi
 *   <master>/index.json        → definisi 19 bidang SSW (id, nama JA, nama ID)
 *
 * Output (dipakai aplikasi):
 *   public/data/tsk.json       → array entri siap-render
 *   public/data/manifest.json  → metadata: tanggal, jumlah, daftar bahasa
 *
 * Pemakaian:
 *   node scripts/build-data.mjs /workspace/tsk
 */

import fs from 'node:fs';
import path from 'node:path';

const masterDir = process.argv[2] ?? path.resolve(process.cwd(), '../tsk');
const outDir = process.argv[3] ?? path.resolve(process.cwd(), 'public/data');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// --- 1. Muat master ---------------------------------------------------------
const tsk = readJson(path.join(masterDir, 'tsk.json'));
const labels = readJson(path.join(masterDir, 'ssw_labels.json'));
const index = readJson(path.join(masterDir, 'index.json'));

const VALID_IDS = new Set(index.map((f) => f.id));

// Nomor registrasi → { fields: [{id, level}], status }
const labelByReg = new Map();
for (const row of labels) {
  const fields = [];
  const conf = row.confidence ?? {};
  for (const id of row.ssw_fields ?? []) {
    if (!VALID_IDS.has(id)) continue; // jangan bawa id asing ke app
    const level = conf[id] ?? null;
    if (level) fields.push({ id, level });
  }
  labelByReg.set(row.registration_number, { fields, status: row.research_status });
}

// --- 2. Nama prefektur untuk penentuan lokasi -------------------------------
// Dicocokkan per-token (dipisah koma), BUKAN substring: "Saga" jangan sampai
// menangkap "Sagamihara", "Nara" jangan menangkap "Narashino".
const PREFECTURES = [
  'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
  'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
  'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
  'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
  'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
  'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
  'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa',
];
const SUFFIXES = ['ken', 'fu', 'to', 'do'];

// Tabel alias eksplisit. Dua kelompok:
//   (1) ejaan varian nama prefektur yang muncul di data master
//   (2) nama kota besar yang ditulis tanpa prefektur
// Hanya yang TIDAK AMBIGU yang dimasukkan. "Sendai" (Miyagi & Kagoshima),
// "Sakai" (Osaka & Fukui), "Ono" (Hyogo & Gifu), "Fuji" (kota & nama gedung)
// sengaja tidak dipetakan — lebih baik null daripada salah.
const ALIASES = new Map([
  // (1) varian ejaan
  ['hyougo', 'Hyogo'], ['gumma', 'Gunma'], ['oosaka', 'Osaka'],
  ['oosakafu', 'Osaka'], ['hokkaidou', 'Hokkaido'], ['toukyou', 'Tokyo'],
  ['toukyouto', 'Tokyo'], ['sizuoka', 'Shizuoka'], ['aiti', 'Aichi'],
  ['hukuoka', 'Fukuoka'], ['kyouto', 'Kyoto'], ['hirosima', 'Hiroshima'],
  // (2) kota besar tanpa prefektur
  ['nagoya', 'Aichi'], ['nagoyashi', 'Aichi'],
  ['sapporo', 'Hokkaido'], ['sapporoshi', 'Hokkaido'],
  ['kobe', 'Hyogo'], ['kobeshi', 'Hyogo'], ['himeji', 'Hyogo'],
  ['yokohama', 'Kanagawa'], ['yokohamashi', 'Kanagawa'],
  ['takasaki', 'Gunma'], ['maebashi', 'Gunma'],
  ['osakashi', 'Osaka'], ['fukuokashi', 'Fukuoka'],
  ['hamamatsu', 'Shizuoka'], ['utsunomiya', 'Tochigi'],
  ['kitakyushu', 'Fukuoka'], ['hiroshimashi', 'Hiroshima'],
]);

// Pola bentuk prefektur: "aichi", "aichiken", "tokyoto", "osakafu", dst.
const PREF_PATTERNS = PREFECTURES.map((pref) => {
  const base = pref.toLowerCase();
  const forms = [base, ...SUFFIXES.map((s) => base + s)];
  return [pref, new RegExp(`(^|\\s)(${forms.join('|')})(?=\\s|$)`, 'g')];
});

/**
 * Tentukan prefektur dari alamat kantor.
 * Alamat master sangat tidak konsisten (ada yang pakai koma, ada yang nyambung,
 * ada yang hanya nama kota), jadi dicocokkan per-kata setelah normalisasi.
 * Prefektur ditulis SETELAH nama kota pada romaji, maka kecocokan terakhir menang.
 */
function detectPrefecture(address) {
  if (!address) return null;
  const s = ' ' + address.toLowerCase().replace(/[^a-z]+/g, ' ').trim() + ' ';

  let best = null;
  let bestPos = -1;

  for (const [pref, re] of PREF_PATTERNS) {
    re.lastIndex = 0;
    let m;
    let last = -1;
    while ((m = re.exec(s)) !== null) last = m.index + m[0].length;
    if (last > bestPos) {
      bestPos = last;
      best = pref;
    }
  }
  if (best) return best;

  // Fallback: alias (varian ejaan / nama kota besar)
  for (const token of s.trim().split(/\s+/)) {
    const hit = ALIASES.get(token);
    if (hit) return hit;
  }

  return null;
}

// --- 3. Bentuk ulang tiap baris --------------------------------------------
const out = [];
const prefUnknown = [];
let nullOptional = 0;
let nullLegal = 0;

for (const row of tsk) {
  const label = labelByReg.get(row.registration_number);
  const pref = detectPrefecture(row.office_address);

  if (!pref) prefUnknown.push(row.registration_number);
  if (row.support_optional === null) nullOptional++;
  if (row.support_legal_basis === null) nullLegal++;

  out.push({
    reg_number: row.registration_number,
    office_seq: row.office_seq,
    office_type: row.office_type,            // 'Main' | 'Branch'
    name: row.office_name,
    hq_name: row.office_type === 'Branch' ? row.organization_name : null,
    zipcode: row.office_zip,
    address: row.office_address,
    prefecture: pref,                        // sudah dihitung di build, bukan runtime
    phone: row.telephone,
    representative: row.representative,
    reg_date: row.registration_date,
    support_legal: row.support_legal_basis,  // boolean | null (bukan "Yes"/"No")
    support_optional: row.support_optional,  // boolean | null
    support_start_date: row.support_start_date,
    languages: row.languages ?? [],
    ssw_fields: label?.fields ?? [],         // [{id, level}] — kosong kalau no_evidence
  });
}

// --- 4. Manifest -----------------------------------------------------------
const langCount = new Map();
for (const row of out) {
  for (const lang of row.languages) langCount.set(lang, (langCount.get(lang) ?? 0) + 1);
}
const languages = [...langCount.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count }));

const orgs = new Set(out.map((r) => r.reg_number));
const labeledOrgs = out.filter((r) => r.office_type === 'Main' && r.ssw_fields.length > 0).length;

const manifest = {
  generated_at: new Date().toISOString().slice(0, 10),
  source_updated_at: labels.reduce((max, r) => (r.updated_at > max ? r.updated_at : max), ''),
  total_rows: out.length,
  total_organizations: orgs.size,
  branches: out.filter((r) => r.office_type === 'Branch').length,
  labeled_organizations: labeledOrgs,
  prefecture_unknown: prefUnknown.length,
  ssw_fields: index.map((f) => ({ id: f.id, name_ja: f.name_ja, name_id: f.name_id })),
  languages,
};

// --- 5. Tulis --------------------------------------------------------------
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'tsk.json'), JSON.stringify(out));
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// --- 6. Laporan ------------------------------------------------------------
const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0) + ' KB';
console.log('── selesai ────────────────────────────────');
console.log(`baris          : ${manifest.total_rows}`);
console.log(`organisasi     : ${manifest.total_organizations} (${manifest.branches} cabang)`);
console.log(`sudah diriset  : ${labeledOrgs} organisasi`);
console.log(`pref tak cocok : ${prefUnknown.length}${prefUnknown.length ? ' → ' + prefUnknown.slice(0, 5).join(', ') : ''}`);
console.log(`null legal/opt : ${nullLegal} / ${nullOptional}`);
console.log(`tsk.json       : ${kb(path.join(outDir, 'tsk.json'))}`);
console.log(`manifest.json  : ${kb(path.join(outDir, 'manifest.json'))}`);
