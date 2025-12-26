
export const SUPABASE_URL = "https://xxnsvylzzkgcnubaegyv.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bnN2eWx6emtnY251YmFlZ3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDE0MjcsImV4cCI6MjA3OTk3NzQyN30.x0wz0v_qqvg6riMipKMr3IM30YnGaGs1b9uMvJRGG5M";

// Updated to International Format
export const LANGUAGES = [
  "Indonesian",
  "English", 
  "Vietnamese", 
  "Chinese", 
  "Filipino (Tagalog)", 
  "Burmese", 
  "Nepali",
  "Thai",
  "Cambodian (Khmer)",
  "Mongolian",
  "Uzbek",
  "Sinhalese"
];

// DATA MASTER: Single Source of Truth
// Mengikat ID SVG (JPxx) dengan Nama Prefektur dan Region.
// Menggunakan ejaan standar (Osaka, bukan Ōsaka) untuk kemudahan pencarian user Indonesia.
const PREFECTURE_DATA = [
  { id: "JP01", name: "Hokkaido", region: "Hokkaido" },
  { id: "JP02", name: "Aomori", region: "Tohoku" },
  { id: "JP03", name: "Iwate", region: "Tohoku" },
  { id: "JP04", name: "Miyagi", region: "Tohoku" },
  { id: "JP05", name: "Akita", region: "Tohoku" },
  { id: "JP06", name: "Yamagata", region: "Tohoku" },
  { id: "JP07", name: "Fukushima", region: "Tohoku" },
  { id: "JP08", name: "Ibaraki", region: "Kanto" },
  { id: "JP09", name: "Tochigi", region: "Kanto" },
  { id: "JP10", name: "Gunma", region: "Kanto" },
  { id: "JP11", name: "Saitama", region: "Kanto" },
  { id: "JP12", name: "Chiba", region: "Kanto" },
  { id: "JP13", name: "Tokyo", region: "Kanto" },
  { id: "JP14", name: "Kanagawa", region: "Kanto" },
  { id: "JP15", name: "Niigata", region: "Chubu" },
  { id: "JP16", name: "Toyama", region: "Chubu" },
  { id: "JP17", name: "Ishikawa", region: "Chubu" },
  { id: "JP18", name: "Fukui", region: "Chubu" },
  { id: "JP19", name: "Yamanashi", region: "Chubu" },
  { id: "JP20", name: "Nagano", region: "Chubu" },
  { id: "JP21", name: "Gifu", region: "Chubu" },
  { id: "JP22", name: "Shizuoka", region: "Chubu" },
  { id: "JP23", name: "Aichi", region: "Chubu" },
  { id: "JP24", name: "Mie", region: "Kansai" },
  { id: "JP25", name: "Shiga", region: "Kansai" },
  { id: "JP26", name: "Kyoto", region: "Kansai" },
  { id: "JP27", name: "Osaka", region: "Kansai" },
  { id: "JP28", name: "Hyogo", region: "Kansai" },
  { id: "JP29", name: "Nara", region: "Kansai" },
  { id: "JP30", name: "Wakayama", region: "Kansai" },
  { id: "JP31", name: "Tottori", region: "Chugoku" },
  { id: "JP32", name: "Shimane", region: "Chugoku" },
  { id: "JP33", name: "Okayama", region: "Chugoku" },
  { id: "JP34", name: "Hiroshima", region: "Chugoku" },
  { id: "JP35", name: "Yamaguchi", region: "Chugoku" },
  { id: "JP36", name: "Tokushima", region: "Shikoku" },
  { id: "JP37", name: "Kagawa", region: "Shikoku" },
  { id: "JP38", name: "Ehime", region: "Shikoku" },
  { id: "JP39", name: "Kochi", region: "Shikoku" },
  { id: "JP40", name: "Fukuoka", region: "Kyushu" },
  { id: "JP41", name: "Saga", region: "Kyushu" },
  { id: "JP42", name: "Nagasaki", region: "Kyushu" },
  { id: "JP43", name: "Kumamoto", region: "Kyushu" },
  { id: "JP44", name: "Oita", region: "Kyushu" },
  { id: "JP45", name: "Miyazaki", region: "Kyushu" },
  { id: "JP46", name: "Kagoshima", region: "Kyushu" },
  { id: "JP47", name: "Okinawa", region: "Kyushu" }
];

// Generated List of Prefectures (for Dropdowns/Lists)
export const PREFECTURES = PREFECTURE_DATA.map(p => p.name);

// Generated Map: ID (JPxx) -> Name (for SVG Interaction)
export const ID_TO_PREF_MAP: Record<string, string> = PREFECTURE_DATA.reduce((acc, curr) => {
  acc[curr.id] = curr.name;
  return acc;
}, {} as Record<string, string>);

// Generated Map: Name -> ID (for Reverse Lookup)
export const PREF_TO_ID_MAP: Record<string, string> = PREFECTURE_DATA.reduce((acc, curr) => {
  acc[curr.name] = curr.id;
  return acc;
}, {} as Record<string, string>);

// Generated Map: Name -> Region (for Coloring/Grouping)
export const PREF_REGION_MAP: Record<string, string> = PREFECTURE_DATA.reduce((acc, curr) => {
  acc[curr.name] = curr.region;
  return acc;
}, {} as Record<string, string>);

// REGIONAL COLORS (Warna unik per region)
export const REGION_COLORS: Record<string, string> = {
  "Hokkaido": "#7c3aed", // Violet
  "Tohoku": "#0891b2",   // Cyan
  "Kanto": "#2563eb",    // Blue
  "Chubu": "#d97706",    // Amber
  "Kansai": "#e11d48",   // Rose
  "Chugoku": "#4f46e5",  // Indigo
  "Shikoku": "#ea580c",  // Orange
  "Kyushu": "#db2777",   // Pink
};

// SSW FIELDS (Tokutei Ginou 1 - Prometric List)
export const SSW_FIELDS = [
  { id: 'caregiver', label: '1. Perawat Lansia (Kaigo)', jp_exam: '介護技能評価試験、介護日本語評価試験', jp_field: '介護' },
  { id: 'food_service', label: '2. Layanan Makanan (Restoran)', jp_exam: '外食業特定技能1号技能測定試験', jp_field: '外食業' },
  { id: 'agriculture', label: '3. Pertanian (Nogyo)', jp_exam: '農業技能測定試験1号', jp_field: '農業' },
  { id: 'food_manufacturing', label: '4. Pengolahan Makanan & Minuman', jp_exam: '飲食料品製造業特定技能1号技能測定試験', jp_field: '飲食料品製造業' },
  { id: 'auto_repair', label: '5. Perbaikan Mobil (Otomotif)', jp_exam: '自動車整備分野特定技能1号評価試験', jp_field: '自動車整備' },
  { id: 'fishery_aquaculture', label: '6. Perikanan (Budidaya)', jp_exam: '1号漁業技能測定試験(養殖業)', jp_field: '漁業（養殖業）' },
  { id: 'fishery_fishing', label: '7. Perikanan (Penangkapan)', jp_exam: '1号漁業技能測定試験(漁業)', jp_field: '漁業（漁業）' },
  { id: 'construction', label: '8. Konstruksi', jp_exam: '建設分野特定技能1号評価試験', jp_field: '建設' },
  { id: 'accommodation', label: '9. Perhotelan (Akomodasi)', jp_exam: '宿泊分野特定技能1号評価試験', jp_field: '宿泊' },
  { id: 'manufacturing', label: '10. Manufaktur Industri (Pabrik)', jp_exam: '製造分野特定技能1号評価試験', jp_field: '素形材・産業機械・電気電子情報関連製造業' }
];

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
  { id: 'nat5', label: 'NAT-TEST 5Q', jp: 'NAT-TEST 5級' }
];

// MAPPING PEKERJAAN SPESIFIK (Indonesian Label -> Japanese Value)
export const SSW_SPECIFIC_JOBS: Record<string, { label: string, value: string }[]> = {
  caregiver: [
    { label: 'Caregiver Panti Jompo', value: '介護職員（特別養護老人ホーム等）' },
    { label: 'Caregiver Kunjungan Rumah (Home Care)', value: '訪問介護員' },
    { label: 'Staff Day Service', value: 'デイサービススタッフ' },
    { label: 'Staff Group Home', value: 'グループホームスタッフ' },
    { label: 'Asisten Rehabilitasi', value: 'リハビリ助手' }
  ],
  food_service: [
    { label: 'Koki Restoran', value: '調理スタッフ' },
    { label: 'Asisten Koki / Dapur', value: '調理補助' },
    { label: 'Staff Dapur (Prep/Cook)', value: 'キッチンスタッフ' },
    { label: 'Pelayan / Waiter-Waitress', value: 'ホールスタッフ' },
    { label: 'Crew Restoran Cepat Saji', value: 'ファストフードクルー' },
    { label: 'Barista / Staff Kafe', value: 'バリスタ・カフェスタッフ' }
  ],
  agriculture: [
    { label: 'Pekerja Sayur-sayuran', value: '農業作業員（野菜栽培）' },
    { label: 'Pekerja Buah / Kebun', value: '農業作業員（果樹栽培）' },
    { label: 'Pekerja Sawah / Padi', value: '農業作業員（稲作）' },
    { label: 'Operator Rumah Kaca', value: '施設園芸作業員' },
    { label: 'Peternak Unggas (Ayam)', value: '養鶏場作業員' },
    { label: 'Peternak Sapi / Ternak', value: '酪農・畜産作業員' }
  ],
  food_manufacturing: [
    { label: 'Pabrik Pengolahan Makanan', value: '食品製造作業員' },
    { label: 'Pabrik Minuman', value: '清涼飲料水製造作業員' },
    { label: 'Pengolahan Ikan/Daging', value: '水産・食肉加工' },
    { label: 'Produksi Roti & Kue', value: 'パン・菓子製造' },
    { label: 'Operator Lini Pengemasan', value: '包装ラインオペレーター' },
    { label: 'Petugas Kontrol Kualitas (QC)', value: '品質管理スタッフ' }
  ],
  auto_repair: [
    { label: 'Mekanik Mobil Umum', value: '自動車整備士' },
    { label: 'Teknisi Servis & Perawatan', value: '点検・整備スタッフ' },
    { label: 'Mekanik Mesin Diesel/Truk', value: '大型・ディーゼル整備士' },
    { label: 'Teknisi Inspeksi (Shaken)', value: '車検・検査員' },
    { label: 'Spesialis Ban', value: 'タイヤ交換・整備士' }
  ],
  fishery_aquaculture: [
    { label: 'Budidaya Ikan (Kolam)', value: '養殖作業員（魚類）' },
    { label: 'Budidaya Kerang/Mollusca', value: '養殖作業員（貝類）' },
    { label: 'Budidaya Rumput Laut', value: '養殖作業員（海藻）' },
    { label: 'Petugas Penetasan (Hatchery)', value: '種苗生産スタッフ' },
    { label: 'Pengelolaan Kolam/Keramba', value: '生簀管理作業員' }
  ],
  fishery_fishing: [
    { label: 'Awak Kapal (Deckhand)', value: '漁船甲板員' },
    { label: 'Nelayan Lepas Pantai', value: '沖合漁業従事者' },
    { label: 'Nelayan Pesisir', value: '沿岸漁業従事者' },
    { label: 'Spesialis Jaring & Alat Tangkap', value: '漁具・網作業員' },
    { label: 'Penanganan Ikan Onboard', value: '船上加工スタッフ' }
  ],
  construction: [
    { label: 'Tukang Bangunan (General)', value: '多能工' },
    { label: 'Tukang Kayu (Carpentry)', value: '建築大工' },
    { label: 'Tukang Besi (Steelworker)', value: '鉄筋施工' },
    { label: 'Tukang Las (Welding)', value: '溶接工' },
    { label: 'Operator Alat Berat', value: '建設機械施工' },
    { label: 'Finishing Beton', value: 'コンクリート仕上げ' },
    { label: 'Pemasang Perancah (Scaffolder)', value: 'とび職' }
  ],
  accommodation: [
    { label: 'Front Desk / Resepsionis', value: 'ホテルフロント' },
    { label: 'Housekeeping / Cleaning', value: '客室清掃・ハウスキーピング' },
    { label: 'Concierge / Layanan Tamu', value: 'コンシェルジュ' },
    { label: 'Staff Ryokan (Tradisional)', value: '旅館業務（仲居等）' },
    { label: 'Staff Banquet / Event', value: '宴会スタッフ' },
    { label: 'Staff Food & Beverage Hotel', value: 'ホテルレストランサービス' }
  ],
  manufacturing: [
    { label: 'Pekerja Perakitan (Assembly)', value: '組立・加工スタッフ' },
    { label: 'Operator Mesin (CNC/Milling)', value: '機械加工オペレーター' },
    { label: 'Tukang Fabrikasi Logam', value: '金属プレス加工' },
    { label: 'Pekerja Elektronik', value: '電子機器組立て' },
    { label: 'Operator Kontrol Kualitas', value: '品質管理スタッフ' },
    { label: 'Packer / Pengepakan', value: '梱包・出荷作業員' }
  ]
};
