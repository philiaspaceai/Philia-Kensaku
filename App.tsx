import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight, Info, SquareArrowOutUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTSK, fetchUserLikedIds } from './services/tskService';
import { TSKData, SearchFilters, SearchMode } from './types';
import { TSKCard } from './components/TSKCard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AdvancedFilter } from './components/AdvancedFilter';

function App() {
  // State
  const [mode, setMode] = useState<SearchMode>('simple');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    prefectures: [],
    languages: [],
    supportLegal: false,
    supportOptional: false
  });
  
  const [data, setData] = useState<TSKData[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (resetPage = true) => {
    if (resetPage) setPage(1);
    const currentPage = resetPage ? 1 : page;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const { data: resultData, count } = await fetchTSK(currentPage, filters, mode);
      setData(resultData);
      setTotalCount(count || 0);
      
      // Fetch 'liked' status for these items
      const ids = resultData.map(d => d.id);
      const userLikes = await fetchUserLikedIds(ids);
      setLikedIds(new Set(userLikes));
      
      // Smooth scroll to results
      if (resetPage && window.innerWidth < 768) {
         setTimeout(() => {
           resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }, 100);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on page change
  useEffect(() => {
    if (hasSearched) {
      handleSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 relative overflow-hidden">
         {/* Abstract Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
         <div className="absolute top-0 left-0 w-64 h-64 bg-sakura-50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-60"></div>

        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider mb-4 border border-slate-200">
              UNTUK TOKUTEI GINOU INDONESIA
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Philia <span className="animate-gradient-xy bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-sakura-500 to-primary-600">Kensaku</span>
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
              <SquareArrowOutUpRight className="w-3 h-3 ml-1.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          {/* Search Card */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 sm:p-4 max-w-3xl mx-auto"
          >
            {/* Tabs */}
            <div className="flex space-x-2 mb-4 p-1 bg-slate-100 rounded-xl w-fit mx-auto sm:mx-0">
              <button
                onClick={() => setMode('simple')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'simple' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Pencarian Cepat
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'advanced' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Pencarian Advance
              </button>
            </div>

            <div className="p-2 sm:p-4">
              {mode === 'simple' ? (
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Ketik nama perusahaan, cabang, atau nomor registrasi..."
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
                <AdvancedFilter 
                  filters={filters} 
                  onChange={setFilters} 
                  onSearch={() => handleSearch(true)} 
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div ref={resultsRef} className="max-w-6xl mx-auto px-4 py-12 flex-grow w-full scroll-mt-4">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-red-100">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : data.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                Hasil Pencarian
                <span className="ml-3 px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-md">
                  {totalCount} ditemukan
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, index) => (
                <TSKCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  initialLiked={likedIds.has(item.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-full bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : hasSearched ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Tidak ada data ditemukan.</p>
            <p className="text-slate-400 text-sm mt-2">Coba kurangi filter atau gunakan kata kunci lain.</p>
          </div>
        ) : (
           <div className="text-center py-20 opacity-50">
             <p>Silakan lakukan pencarian di atas.</p>
           </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Philia Kensaku. Data provided by moj.go.jp.</p>
      </footer>
    </div>
  );
}

export default App;