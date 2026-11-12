import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Info, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  loadDataset,
  filterRecords,
  sortRecords,
  paginate,
  recordKey,
  countByField,
} from './services/dataService';
import { TSKRecord, SearchFilters, SearchMode, Manifest } from './types';
import { TSKCard } from './components/TSKCard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AdvancedFilter } from './components/AdvancedFilter';
import { Guidebook } from './components/Guidebook';
import { Information } from './components/Information';
import { TSKAnalytics } from './components/TSKAnalytics';
import { LocationModal } from './components/modals/LocationModal';
import { LanguageModal } from './components/modals/LanguageModal';
import { SSWFieldModal } from './components/modals/SSWFieldModal';
import { SelectMenu } from './components/modals/SelectMenu';

const EMPTY_FILTERS: SearchFilters = {
  query: '',
  prefectures: [],
  languages: [],
  excludedLanguages: [],
  sswFields: [],
  dateSort: null,
  supportLegal: true,
  supportOptional: false,
};

function App() {
  const [view, setView] = useState<'search' | 'guidebook' | 'info' | 'analytics'>('search');

  // Modal states
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSSWFieldModalOpen, setIsSSWFieldModalOpen] = useState(false);
  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);

  // Dataset (dimuat sekali di awal)
  const [records, setRecords] = useState<TSKRecord[]>([]);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Search state
  const [mode, setMode] = useState<SearchMode>('simple');
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<SearchFilters | null>(null);
  const [page, setPage] = useState(1);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    loadDataset()
      .then((d) => {
        if (!mounted) return;
        setRecords(d.records);
        setManifest(d.manifest);
        setIsLoadingData(false);
      })
      .catch((err: Error) => {
        if (!mounted) return;
        setLoadError(err.message);
        setIsLoadingData(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (resetPage = true) => {
    if (resetPage) setPage(1);
    setApplied({ ...filters });

    if (resetPage && window.innerWidth < 768 && view === 'search') {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Semua penyaringan terjadi di sini — tidak ada permintaan jaringan per pencarian.
  const result = useMemo(() => {
    if (!applied) return null;
    const filtered = filterRecords(records, applied);
    return paginate(sortRecords(filtered, applied.dateSort), page);
  }, [records, applied, page]);

  const handleLocationSave = (newPrefectures: string[]) => {
    setFilters({ ...filters, prefectures: newPrefectures });
  };

  const handleLanguageSave = (included: string[], excluded: string[]) => {
    setFilters({ ...filters, languages: included, excludedLanguages: excluded });
  };

  const handleSSWFieldSave = (fields: string[]) => {
    setFilters({ ...filters, sswFields: fields });
  };

  // Jumlah kantor per bidang — dihitung sekali per dataset, bukan tiap render.
  const fieldCounts = useMemo(() => countByField(records), [records]);

  const handleSelectMenuOption = (option: 'analytics' | 'info' | 'donate') => {
    setIsSelectMenuOpen(false);
    if (option === 'donate') {
      window.open('https://trakteer.id/philiaanimelist/tip', '_blank');
    } else {
      setView(option);
    }
  };

  const executeGoogleSearch = (item: TSKRecord) => {
    const displayName = item.name;
    const displayAddress = item.address ?? '-';

    const promptInstructions = `Saya ingin kamu melakukan research dan pencarian di google secara mendalam, mendetail, dan super akurat dengan pencarian berbahasa jepang di google mengenai perusahaan TSK ini:

Nama Perusahaan : ${displayName}
Nomor Registrasi : ${item.reg_number}
CEO : ${item.representative || '-'}
Alamat : ${displayAddress}

⚠️ PROTOKOL WAJIB (STRICT RULES):
1. NO FAKE LINKS: Haram hukumnya memberikan informasi tanpa LINK BUKTI (URL) yang valid dan bisa diklik.
2. EVIDENCE FIRST: Setiap klaim harus didukung oleh sumber url (Website resmi, Portal berita, Database pemerintah, atau Sosmed).

Jawab 4 Poin Kunci ini secara mendetail dalam Bahasa Indonesia:

1. 🕵️ DIGITAL FOOTPRINT & SOSMED (WAJIB ADA LINK):
Temukan akun Instagram, Facebook (SANGAT WAJIB), LinkedIn, atau Twitter resmi mereka yang terbaru.
Format: "Platform: [Nama] - [URL Link]" (Pastikan Link Aktif).

2. 📊 PREDIKSI JOB & PERSENTASE AKURASI:
Berdasarkan histori jejak digital (iklan lama/baru), prediksi jenis pekerjaan Tokutei Ginou (SSW) yang tersedia.
Format: "Bidang: [Contoh: Kaigo/Pertanian] (Akurasi: [0-100]%)".
WAJIB: Sertakan [LINK BUKTI] iklan lowongan atau halaman rekrutmen yang menjadi dasar analisa Anda.

3. 🗺️ PETA JALAN MELAMAR (APPLICATION HACK):
Analisa struktur website mereka untuk mencari pintu masuk pelamar.
SANGAT WAJIB: WAJIB Temukan EMAIL yang bisa dihubungi dengan cara apapun dan dari sumber manapun dan emailnya wajib 100% valid dan ADA BUKTINYA!
Temukan dan lampirkan URL khusus menuju "Direct Contact Form" (Formulir Kontak/Inquiry) yang ada di website mereka.
Berikan panduan langkah demi langkah melamar beserta [LINK DIRECT FORM] yang valid.

4. 💀 DEEP DIVE FAKTA & REPUTASI:
Gali "Underground Info". Cari ulasan Google Maps, artikel berita lokal, atau daftar "Black Kigyou".
Apakah perusahaan ini bersih? Atau ada skandal?
Sertakan [LINK SUMBER] untuk setiap fakta yang Anda temukan.`;

    const encodedPrompt = encodeURIComponent(promptInstructions)
      .replace(/%20/g, '+')
      .replace(/%0A/g, '%0D%0A');

    window.location.href = `https://www.google.com/search?q=${encodedPrompt}&udm=50`;
  };

  const activeFilterCount =
    filters.prefectures.length +
    filters.languages.length +
    filters.excludedLanguages.length +
    filters.sswFields.length +
    (filters.supportOptional ? 1 : 0) +
    (filters.dateSort ? 1 : 0);

  // --- Layar tunggu: seluruh dataset diunduh sekali di awal -----------------
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 font-bold">Mengunduh data TSK…</p>
        <p className="mt-1 text-sm text-slate-400">
          Seluruh data (±1,4 MB) disimpan di perangkat Anda, jadi pencarian berikutnya instan.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-slate-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Gagal Memuat Data</h3>
          <p className="text-slate-500 mt-2 mb-6 text-sm">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const SearchContent = (
    <>
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-sakura-50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-60"></div>

        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
          <button
            onClick={() => setIsSelectMenuOpen(true)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 px-3 py-2 rounded-full font-bold shadow-sm hover:bg-white hover:shadow-md hover:text-primary-600 transition-all group"
          >
            <Info className="w-5 h-5 text-slate-500 group-hover:text-primary-500 transition-colors" />
            <span className="hidden sm:inline text-sm">Informasi</span>
          </button>
        </div>

        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
          <button
            onClick={() => setView('guidebook')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white hover:shadow-md hover:text-primary-600 transition-all group"
          >
            <BookOpen className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Panduan Lengkap</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider mb-4 border border-slate-200">
              UNTUK TOKUTEI GINOU INDONESIA
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Philia{' '}
              <span className="animate-gradient-xy bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-sakura-500 to-primary-600">
                Kensaku
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
              Cari TSK (Registered Support Organizations) terpercaya di seluruh Jepang.
            </p>

            <a
              href="https://philiaspace.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors mb-10 group"
            >
              Dibuat oleh Philia Space Community
              <ExternalLink className="w-3 h-3 ml-1.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 sm:p-4 max-w-3xl mx-auto"
          >
            <div className="flex justify-center items-center mb-4 px-1">
              <div className="flex space-x-2 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  onClick={() => setMode('simple')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'simple' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Cari
                </button>
                <button
                  onClick={() => setMode('advanced')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    mode === 'advanced' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="ml-1 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="p-2 sm:p-4">
              {mode === 'simple' ? (
                <div className="relative group">
                  <input
                    type="text"
                    placeholder=""
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(true)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all text-lg"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary-500 transition-colors" />
                  <button
                    onClick={() => handleSearch(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
                  >
                    Cari
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AdvancedFilter
                    filters={filters}
                    onChange={setFilters}
                    onLocationOpen={() => setIsLocationModalOpen(true)}
                    onLanguageOpen={() => setIsLanguageModalOpen(true)}
                    onSSWFieldOpen={() => setIsSSWFieldModalOpen(true)}
                  />

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleSearch(true)}
                      className="animate-gradient-xy bg-gradient-to-r from-primary-600 via-sakura-500 to-primary-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transform transition hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
                    >
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div ref={resultsRef} className="max-w-6xl mx-auto px-4 py-12 flex-grow w-full scroll-mt-4">
        {!result ? (
          <div className="text-center py-20 opacity-50">
            <p>Silakan lakukan pencarian di atas.</p>
          </div>
        ) : result.total === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Tidak ada data ditemukan.</p>
            <p className="text-slate-400 text-sm mt-2">Coba kurangi filter atau gunakan kata kunci lain.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                Hasil Pencarian
                <span className="ml-3 px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-md">
                  {result.total} ditemukan
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.pageItems.map((item, index) => (
                <TSKCard key={recordKey(item)} item={item} index={index} onCariTahu={executeGoogleSearch} />
              ))}
            </div>

            {result.totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Halaman {page} dari {result.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                  disabled={page === result.totalPages}
                  className="p-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Philia Kensaku. Data provided by moj.go.jp
          {manifest ? ` · snapshot ${manifest.source_updated_at || manifest.generated_at}` : ''}
        </p>
      </footer>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <AnimatePresence mode="wait">
        {view === 'search' ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen w-full"
          >
            {SearchContent}
          </motion.div>
        ) : view === 'guidebook' ? (
          <motion.div
            key="guidebook"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen w-full"
          >
            <Guidebook onBack={() => setView('search')} />
          </motion.div>
        ) : view === 'info' ? (
          <motion.div
            key="info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen w-full"
          >
            <Information onBack={() => setView('search')} totalCount={manifest?.total_organizations ?? null} />
          </motion.div>
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen w-full"
          >
            <TSKAnalytics onBack={() => setView('search')} />
          </motion.div>
        )}
      </AnimatePresence>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedPrefectures={filters.prefectures}
        onSave={handleLocationSave}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguages={filters.languages}
        excludedLanguages={filters.excludedLanguages}
        onSave={handleLanguageSave}
        languages={manifest?.languages ?? []}
      />

      <SSWFieldModal
        isOpen={isSSWFieldModalOpen}
        onClose={() => setIsSSWFieldModalOpen(false)}
        selected={filters.sswFields}
        onSave={handleSSWFieldSave}
        counts={fieldCounts}
        labeledOrganizations={manifest?.labeled_organizations ?? 0}
      />

      <SelectMenu
        isOpen={isSelectMenuOpen}
        onClose={() => setIsSelectMenuOpen(false)}
        onSelectOption={handleSelectMenuOption}
      />
    </div>
  );
}

export default App;
