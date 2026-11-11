// Sumber label & warna 19 bidang SSW.
// id dan label mengikuti master /workspace/tsk/index.json — dijaga tetap sinkron
// oleh scripts/build-data.mjs (script akan gagal kalau ada id yang tidak dikenal).
// `hex` dipakai langsung sebagai inline style supaya tidak bergantung pada
// class Tailwind yang dibentuk saat runtime (class dinamis hilang saat build).

export interface SSWFieldMeta {
  id: string;
  label: string;
  hex: string;
}

export const SSW_FIELDS_META: SSWFieldMeta[] = [
  { id: 'kaigo', label: 'Perawatan Lansia', hex: '#e11d48' },
  { id: 'building-cleaning', label: 'Pembersihan Gedung', hex: '#0284c7' },
  { id: 'linen-supply', label: 'Linen & Laundry', hex: '#78716c' },
  { id: 'manufacturing', label: 'Manufaktur Industri', hex: '#475569' },
  { id: 'construction', label: 'Konstruksi', hex: '#d97706' },
  { id: 'shipbuilding', label: 'Galangan Kapal', hex: '#0891b2' },
  { id: 'auto-repair', label: 'Otomotif', hex: '#dc2626' },
  { id: 'aviation', label: 'Penerbangan', hex: '#2563eb' },
  { id: 'accommodation', label: 'Perhotelan', hex: '#7c3aed' },
  { id: 'road-transport', label: 'Transportasi Darat', hex: '#ea580c' },
  { id: 'railway', label: 'Perkeretaapian', hex: '#4f46e5' },
  { id: 'warehousing', label: 'Pergudangan', hex: '#0d9488' },
  { id: 'agriculture', label: 'Pertanian', hex: '#16a34a' },
  { id: 'fishery', label: 'Perikanan', hex: '#059669' },
  { id: 'food-manufacturing', label: 'Industri Makanan', hex: '#ca8a04' },
  { id: 'food-service', label: 'Restoran & Jasa Boga', hex: '#db2777' },
  { id: 'forestry', label: 'Kehutanan', hex: '#15803d' },
  { id: 'wood-products', label: 'Industri Kayu', hex: '#a16207' },
  { id: 'resource-circulation', label: 'Daur Ulang', hex: '#65a30d' },
];

const FIELD_BY_ID = new Map(SSW_FIELDS_META.map((f) => [f.id, f]));

export const getFieldMeta = (id: string): SSWFieldMeta | undefined => FIELD_BY_ID.get(id);

/** Label tingkat keyakinan hasil riset. */
export const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'Tinggi',
  medium: 'Sedang',
  low: 'Rendah',
};

/** Panjang bar visual per tingkat (bukan persentase — ini skala kategorikal). */
export const CONFIDENCE_BAR: Record<string, number> = {
  high: 100,
  medium: 60,
  low: 30,
};

// --- Prefektur -------------------------------------------------------------

const PREFECTURE_DATA = [
  { id: 'JP01', name: 'Hokkaido', region: 'Hokkaido' },
  { id: 'JP02', name: 'Aomori', region: 'Tohoku' },
  { id: 'JP03', name: 'Iwate', region: 'Tohoku' },
  { id: 'JP04', name: 'Miyagi', region: 'Tohoku' },
  { id: 'JP05', name: 'Akita', region: 'Tohoku' },
  { id: 'JP06', name: 'Yamagata', region: 'Tohoku' },
  { id: 'JP07', name: 'Fukushima', region: 'Tohoku' },
  { id: 'JP08', name: 'Ibaraki', region: 'Kanto' },
  { id: 'JP09', name: 'Tochigi', region: 'Kanto' },
  { id: 'JP10', name: 'Gunma', region: 'Kanto' },
  { id: 'JP11', name: 'Saitama', region: 'Kanto' },
  { id: 'JP12', name: 'Chiba', region: 'Kanto' },
  { id: 'JP13', name: 'Tokyo', region: 'Kanto' },
  { id: 'JP14', name: 'Kanagawa', region: 'Kanto' },
  { id: 'JP15', name: 'Niigata', region: 'Chubu' },
  { id: 'JP16', name: 'Toyama', region: 'Chubu' },
  { id: 'JP17', name: 'Ishikawa', region: 'Chubu' },
  { id: 'JP18', name: 'Fukui', region: 'Chubu' },
  { id: 'JP19', name: 'Yamanashi', region: 'Chubu' },
  { id: 'JP20', name: 'Nagano', region: 'Chubu' },
  { id: 'JP21', name: 'Gifu', region: 'Chubu' },
  { id: 'JP22', name: 'Shizuoka', region: 'Chubu' },
  { id: 'JP23', name: 'Aichi', region: 'Chubu' },
  { id: 'JP24', name: 'Mie', region: 'Kansai' },
  { id: 'JP25', name: 'Shiga', region: 'Kansai' },
  { id: 'JP26', name: 'Kyoto', region: 'Kansai' },
  { id: 'JP27', name: 'Osaka', region: 'Kansai' },
  { id: 'JP28', name: 'Hyogo', region: 'Kansai' },
  { id: 'JP29', name: 'Nara', region: 'Kansai' },
  { id: 'JP30', name: 'Wakayama', region: 'Kansai' },
  { id: 'JP31', name: 'Tottori', region: 'Chugoku' },
  { id: 'JP32', name: 'Shimane', region: 'Chugoku' },
  { id: 'JP33', name: 'Okayama', region: 'Chugoku' },
  { id: 'JP34', name: 'Hiroshima', region: 'Chugoku' },
  { id: 'JP35', name: 'Yamaguchi', region: 'Chugoku' },
  { id: 'JP36', name: 'Tokushima', region: 'Shikoku' },
  { id: 'JP37', name: 'Kagawa', region: 'Shikoku' },
  { id: 'JP38', name: 'Ehime', region: 'Shikoku' },
  { id: 'JP39', name: 'Kochi', region: 'Shikoku' },
  { id: 'JP40', name: 'Fukuoka', region: 'Kyushu' },
  { id: 'JP41', name: 'Saga', region: 'Kyushu' },
  { id: 'JP42', name: 'Nagasaki', region: 'Kyushu' },
  { id: 'JP43', name: 'Kumamoto', region: 'Kyushu' },
  { id: 'JP44', name: 'Oita', region: 'Kyushu' },
  { id: 'JP45', name: 'Miyazaki', region: 'Kyushu' },
  { id: 'JP46', name: 'Kagoshima', region: 'Kyushu' },
  { id: 'JP47', name: 'Okinawa', region: 'Kyushu' },
];

export const PREFECTURES = PREFECTURE_DATA.map((p) => p.name);

export const ID_TO_PREF_MAP: Record<string, string> = PREFECTURE_DATA.reduce((acc, curr) => {
  acc[curr.id] = curr.name;
  return acc;
}, {} as Record<string, string>);

export const PREF_TO_ID_MAP: Record<string, string> = PREFECTURE_DATA.reduce((acc, curr) => {
  acc[curr.name] = curr.id;
  return acc;
}, {} as Record<string, string>);

export const PREF_REGION_MAP: Record<string, string> = PREFECTURE_DATA.reduce((acc, curr) => {
  acc[curr.name] = curr.region;
  return acc;
}, {} as Record<string, string>);

export const REGION_COLORS: Record<string, string> = {
  Hokkaido: '#7c3aed',
  Tohoku: '#0891b2',
  Kanto: '#2563eb',
  Chubu: '#d97706',
  Kansai: '#e11d48',
  Chugoku: '#4f46e5',
  Shikoku: '#ea580c',
  Kyushu: '#db2777',
};

// --- Email generator -------------------------------------------------------

export const JAPANESE_LEVELS = [
  { id: 'n1', label: 'JLPT N1', jp: 'JLPT N1' },
  { id: 'n2', label: 'JLPT N2', jp: 'JLPT N2' },
  { id: 'n3', label: 'JLPT N3', jp: 'JLPT N3' },
  { id: 'n4', label: 'JLPT N4', jp: 'JLPT N4' },
  { id: 'n5', label: 'JLPT N5', jp: 'JLPT N5' },
  { id: 'jft', label: 'JFT-Basic A2', jp: 'JFT-Basic A2' },
  { id: 'nat1', label: 'NAT-TEST 1Q', jp: 'NAT-TEST 1級' },
  { id: 'nat2', label: 'NAT-TEST 2Q', jp: 'NAT-TEST 2級' },
  { id: 'nat3', label: 'NAT-TEST 3Q', jp: 'NAT-TEST 3級' },
  { id: 'nat4', label: 'NAT-TEST 4Q', jp: 'NAT-TEST 4級' },
  { id: 'nat5', label: 'NAT-TEST 5Q', jp: 'NAT-TEST 5級' },
];

/**
 * 19 bidang SSW untuk keperluan email lamaran.
 * `jp_exam` hanya diisi untuk bidang yang nama ujiannya memang diketahui;
 * bidang lain dibiarkan kosong supaya baris "資格" tidak dicetak dengan teks karangan.
 */
export const SSW_FIELDS = [
  { id: 'kaigo', label: '1. Perawat Lansia (Kaigo)', jp_field: '介護', jp_exam: '介護技能評価試験、介護日本語評価試験' },
  { id: 'food-service', label: '2. Layanan Makanan (Restoran)', jp_field: '外食業', jp_exam: '外食業特定技能1号技能測定試験' },
  { id: 'agriculture', label: '3. Pertanian (Nogyo)', jp_field: '農業', jp_exam: '農業技能測定試験1号' },
  { id: 'food-manufacturing', label: '4. Pengolahan Makanan & Minuman', jp_field: '飲食料品製造業', jp_exam: '飲食料品製造業特定技能1号技能測定試験' },
  { id: 'auto-repair', label: '5. Perbaikan Mobil (Otomotif)', jp_field: '自動車整備', jp_exam: '自動車整備分野特定技能1号評価試験' },
  { id: 'fishery', label: '6. Perikanan (Budidaya & Tangkap)', jp_field: '漁業', jp_exam: '1号漁業技能測定試験' },
  { id: 'construction', label: '7. Konstruksi', jp_field: '建設', jp_exam: '建設分野特定技能1号評価試験' },
  { id: 'accommodation', label: '8. Perhotelan (Akomodasi)', jp_field: '宿泊', jp_exam: '宿泊分野特定技能1号評価試験' },
  { id: 'manufacturing', label: '9. Manufaktur Industri (Pabrik)', jp_field: '素形材・産業機械・電気電子情報関連製造業', jp_exam: '製造分野特定技能1号評価試験' },
  { id: 'building-cleaning', label: '10. Pembersihan Gedung', jp_field: 'ビルクリーニング', jp_exam: '' },
  { id: 'linen-supply', label: '11. Linen & Laundry', jp_field: 'リネンサプライ', jp_exam: '' },
  { id: 'shipbuilding', label: '12. Galangan Kapal', jp_field: '造船・舶用工業', jp_exam: '' },
  { id: 'aviation', label: '13. Penerbangan', jp_field: '航空', jp_exam: '' },
  { id: 'road-transport', label: '14. Transportasi Darat', jp_field: '自動車運送業', jp_exam: '' },
  { id: 'railway', label: '15. Perkeretaapian', jp_field: '鉄道', jp_exam: '' },
  { id: 'warehousing', label: '16. Pergudangan & Logistik', jp_field: '物流倉庫', jp_exam: '' },
  { id: 'forestry', label: '17. Kehutanan', jp_field: '林業', jp_exam: '' },
  { id: 'wood-products', label: '18. Industri Kayu', jp_field: '木材産業', jp_exam: '' },
  { id: 'resource-circulation', label: '19. Daur Ulang', jp_field: '資源循環', jp_exam: '' },
];

// Bidang yang sudah punya daftar pekerjaan spesifik. Bidang lain memakai input manual.
export const SSW_SPECIFIC_JOBS: Record<string, { label: string; value: string }[]> = {
  kaigo: [
    { label: 'Caregiver Panti Jompo', value: '介護職員（特別養護老人ホーム等）' },
    { label: 'Caregiver Kunjungan Rumah (Home Care)', value: '訪問介護員' },
    { label: 'Staff Day Service', value: 'デイサービススタッフ' },
    { label: 'Staff Group Home', value: 'グループホームスタッフ' },
    { label: 'Asisten Rehabilitasi', value: 'リハビリ助手' },
  ],
  'food-service': [
    { label: 'Koki Restoran', value: '調理スタッフ' },
    { label: 'Asisten Koki / Dapur', value: '調理補助' },
    { label: 'Staff Dapur (Prep/Cook)', value: 'キッチンスタッフ' },
    { label: 'Pelayan / Waiter-Waitress', value: 'ホールスタッフ' },
    { label: 'Crew Restoran Cepat Saji', value: 'ファストフードクルー' },
    { label: 'Barista / Staff Kafe', value: 'バリスタ・カフェスタッフ' },
  ],
  agriculture: [
    { label: 'Pekerja Sayur-sayuran', value: '農業作業員（野菜栽培）' },
    { label: 'Pekerja Buah / Kebun', value: '農業作業員（果樹栽培）' },
    { label: 'Pekerja Sawah / Padi', value: '農業作業員（稲作）' },
    { label: 'Operator Rumah Kaca', value: '施設園芸作業員' },
    { label: 'Peternak Unggas (Ayam)', value: '養鶏場作業員' },
    { label: 'Peternak Sapi / Ternak', value: '酪農・畜産作業員' },
  ],
  'food-manufacturing': [
    { label: 'Pabrik Pengolahan Makanan', value: '食品製造作業員' },
    { label: 'Pabrik Minuman', value: '清涼飲料水製造作業員' },
    { label: 'Pengolahan Ikan/Daging', value: '水産・食肉加工' },
    { label: 'Produksi Roti & Kue', value: 'パン・菓子製造' },
    { label: 'Operator Lini Pengemasan', value: '包装ラインオペレーター' },
    { label: 'Petugas Kontrol Kualitas (QC)', value: '品質管理スタッフ' },
  ],
  'auto-repair': [
    { label: 'Mekanik Mobil Umum', value: '自動車整備士' },
    { label: 'Teknisi Servis & Perawatan', value: '点検・整備スタッフ' },
    { label: 'Mekanik Mesin Diesel/Truk', value: '大型・ディーゼル整備士' },
    { label: 'Teknisi Inspeksi (Shaken)', value: '車検・検査員' },
    { label: 'Spesialis Ban', value: 'タイヤ交換・整備士' },
  ],
  fishery: [
    { label: 'Budidaya Ikan (Kolam)', value: '養殖作業員（魚類）' },
    { label: 'Budidaya Kerang/Mollusca', value: '養殖作業員（貝類）' },
    { label: 'Budidaya Rumput Laut', value: '養殖作業員（海藻）' },
    { label: 'Petugas Penetasan (Hatchery)', value: '種苗生産スタッフ' },
    { label: 'Awak Kapal (Deckhand)', value: '漁船甲板員' },
    { label: 'Nelayan Lepas Pantai', value: '沖合漁業従事者' },
    { label: 'Nelayan Pesisir', value: '沿岸漁業従事者' },
    { label: 'Penanganan Ikan Onboard', value: '船上加工スタッフ' },
  ],
  construction: [
    { label: 'Tukang Bangunan (General)', value: '多能工' },
    { label: 'Tukang Kayu (Carpentry)', value: '建築大工' },
    { label: 'Tukang Besi (Steelworker)', value: '鉄筋施工' },
    { label: 'Tukang Las (Welding)', value: '溶接工' },
    { label: 'Operator Alat Berat', value: '建設機械施工' },
    { label: 'Finishing Beton', value: 'コンクリート仕上げ' },
    { label: 'Pemasang Perancah (Scaffolder)', value: 'とび職' },
  ],
  accommodation: [
    { label: 'Front Desk / Resepsionis', value: 'ホテルフロント' },
    { label: 'Housekeeping / Cleaning', value: '客室清掃・ハウスキーピング' },
    { label: 'Concierge / Layanan Tamu', value: 'コンシェルジュ' },
    { label: 'Staff Ryokan (Tradisional)', value: '旅館業務（仲居等）' },
    { label: 'Staff Banquet / Event', value: '宴会スタッフ' },
    { label: 'Staff Food & Beverage Hotel', value: 'ホテルレストランサービス' },
  ],
  manufacturing: [
    { label: 'Pekerja Perakitan (Assembly)', value: '組立・加工スタッフ' },
    { label: 'Operator Mesin (CNC/Milling)', value: '機械加工オペレーター' },
    { label: 'Tukang Fabrikasi Logam', value: '金属プレス加工' },
    { label: 'Pekerja Elektronik', value: '電子機器組立て' },
    { label: 'Operator Kontrol Kualitas', value: '品質管理スタッフ' },
    { label: 'Packer / Pengepakan', value: '梱包・出荷作業員' },
  ],
};
