import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Map, PieChart, TrendingUp, RefreshCw, Heart, MapPin, Building2, AlertCircle, ChevronDown, LayoutDashboard, Microscope } from 'lucide-react';
import { AnalyticsData, LeaderboardRow } from '../types';
import { getAnalyticsData } from '../services/analyticsService';
import { JapanMap } from './ui/JapanMap';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { TSK_TAGS } from '../constants';
import { AlertModal } from './modals/AlertModal';

interface TSKAnalyticsProps {
  onBack: () => void;
  onGoToTSK: (id: number) => void;
}

// METRIC OPTIONS for Dropdown
// Maps UI Label -> Column Name in 'leaderboard_data'
const METRIC_OPTIONS = [
    { value: 'total_tsk', label: 'Semua TSK (Total)', color: '#0ea5e9' }, // Blue-500
    { value: 'ssw_a', label: 'Kaigo (Perawat)', color: '#e11d48' }, // Rose-600
    { value: 'ssw_b', label: 'Building Cleaning', color: '#0284c7' }, // Sky-600
    { value: 'ssw_c', label: 'Konstruksi', color: '#d97706' }, // Amber-600
    { value: 'ssw_d', label: 'Manufaktur Industri', color: '#475569' }, // Slate-600
    { value: 'ssw_e', label: 'Elektronik', color: '#ca8a04' }, // Yellow-600
    { value: 'ssw_f', label: 'Otomotif', color: '#dc2626' }, // Red-600
    { value: 'ssw_g', label: 'Penerbangan', color: '#2563eb' }, // Blue-600
    { value: 'ssw_h', label: 'Perhotelan', color: '#7c3aed' }, // Violet-600
    { value: 'ssw_i', label: 'Pertanian', color: '#16a34a' }, // Green-600
    { value: 'ssw_j', label: 'Perikanan', color: '#0d9488' }, // Teal-600
    { value: 'ssw_k', label: 'F&B (Pabrik Makanan)', color: '#ea580c' }, // Orange-600
    { value: 'ssw_l', label: 'Restoran', color: '#db2777' }, // Pink-600
];

export const TSKAnalytics: React.FC<TSKAnalyticsProps> = ({ onBack }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // STATE: Active Visualization
  const [activeMetric, setActiveMetric] = useState<string>('total_tsk'); // Column Name
  const [selectedPrefecture, setSelectedPrefecture] = useState<LeaderboardRow | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalyticsData();
        setData(res);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data analitik.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- HELPERS ---

  // 1. Get current metric detail
  const currentMetric = METRIC_OPTIONS.find(m => m.value === activeMetric) || METRIC_OPTIONS[0];

  // 2. Prepare Map Data (Record<Prefecture, Count>)
  const mapData = useMemo(() => {
      if (!data) return {};
      const map: Record<string, number> = {};
      data.leaderboardRows.forEach(row => {
          // Dynamic Access: row['ssw_a'] etc
          // @ts-ignore
          const val = row[activeMetric];
          if (val > 0) map[row.prefecture] = val;
      });
      return map;
  }, [data, activeMetric]);

  // 3. Prepare National SSW Totals (For Bar Chart)
  const nationalSSWStats = useMemo(() => {
      if (!data) return [];
      const stats: { code: string; count: number; meta: any }[] = [];
      const keys = Object.keys(TSK_TAGS); // ["A", "B", ...]
      
      keys.forEach(code => {
          const colName = `ssw_${code.toLowerCase()}`;
          let total = 0;
          data.leaderboardRows.forEach(row => {
               // @ts-ignore
               total += (row[colName] || 0);
          });
          if (total > 0) {
              stats.push({ code, count: total, meta: TSK_TAGS[code] });
          }
      });
      
      return stats.sort((a, b) => b.count - a.count); // Sort Descending
  }, [data]);

  // 4. Handle Map Click
  const handleMapToggle = (prefName: string) => {
      if (!data) return;
      const row = data.leaderboardRows.find(r => r.prefecture === prefName);
      setSelectedPrefecture(row || null);
  };

  // 5. Get Top 3 Sectors for Selected Prefecture
  const getPrefectureTopSectors = (row: LeaderboardRow) => {
      const sectors = [];
      const keys = Object.keys(TSK_TAGS);
      keys.forEach(code => {
          const colName = `ssw_${code.toLowerCase()}`;
          // @ts-ignore
          const val = row[colName];
          if (val > 0) sectors.push({ label: TSK_TAGS[code].label, count: val });
      });
      return sectors.sort((a, b) => b.count - a.count).slice(0, 3);
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-500 font-medium animate-pulse">Menghitung Statistik...</p>
        </div>
    );
  }

  if (error || !data) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Gagal Memuat Data</h3>
                <p className="text-slate-500 mt-2 mb-6">{error}</p>
                <button onClick={onBack} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Kembali</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
       
       <AlertModal isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />

       {/* Header */}
       <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button 
                onClick={onBack}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Data Center TSK
                </h1>
            </div>
            
            <div className="text-xs text-slate-400 font-mono hidden sm:block">
                Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        
        {/* HERO STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-4 h-4" /> Total TSK
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{data.overview.totalTSK.toLocaleString()}</div>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Microscope className="w-4 h-4" /> Teranalisa AI
                </div>
                <div className="text-3xl font-extrabold text-emerald-600">
                    {data.overview.analyzedTSK.toLocaleString()} <span className="text-sm font-medium text-slate-400">Perusahaan</span>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <PieChart className="w-4 h-4" /> Cakupan Data
                </div>
                <div className="text-3xl font-extrabold text-indigo-600">
                     {((data.overview.analyzedTSK / data.overview.totalTSK) * 100).toFixed(1)}%
                </div>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-indigo-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white">
                <div className="flex items-center gap-2 mb-2 text-white/80 text-xs font-bold uppercase tracking-wider">
                    <RefreshCw className="w-4 h-4" /> Status Server
                </div>
                <div className="text-lg font-bold">Online & Live</div>
                <div className="text-xs text-white/70 mt-1">Aggregated via Supabase</div>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: MAP & CONTROLS */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 flex flex-col space-y-4"
            >
                 {/* CONTROL BAR */}
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                             <LayoutDashboard className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800 text-sm">Visualisasi Peta</h3>
                             <p className="text-xs text-slate-500">Pilih data yang ingin ditampilkan</p>
                         </div>
                     </div>
                     
                     <div className="relative w-full sm:w-64">
                         <select
                            value={activeMetric}
                            onChange={(e) => {
                                setActiveMetric(e.target.value);
                                setSelectedPrefecture(null); // Reset detail view
                            }}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                         >
                             {METRIC_OPTIONS.map(opt => (
                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
                             ))}
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                     </div>
                 </div>

                 {/* MAP CONTAINER */}
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[450px] sm:h-[600px] relative">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                        Mode: <span style={{ color: currentMetric.color }}>{currentMetric.label}</span>
                    </div>

                    <div className="flex-grow bg-slate-50 relative overflow-hidden">
                        <JapanMap 
                            heatmapData={mapData} 
                            heatmapColor={currentMetric.color}
                            onToggle={handleMapToggle} 
                        />
                    </div>
                 </div>
            </motion.div>

            {/* RIGHT: DETAIL PANEL (SPOTLIGHT OR NATIONAL STATS) */}
            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex flex-col h-full gap-6"
            >
                {/* PANEL 1: DYNAMIC INFO */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col flex-grow overflow-hidden min-h-[400px]">
                    
                    {selectedPrefecture ? (
                        // STATE A: PREFECTURE SPOTLIGHT
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Rapor Wilayah</div>
                                        <h3 className="text-2xl font-extrabold text-slate-900">{selectedPrefecture.prefecture}</h3>
                                    </div>
                                    <button onClick={() => setSelectedPrefecture(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
                                        <ChevronDown className="w-5 h-5 rotate-180" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="text-xs text-slate-500">Total TSK</div>
                                        <div className="text-xl font-bold text-slate-800">{selectedPrefecture.total_tsk}</div>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                        <div className="text-xs text-emerald-700">Teranalisa</div>
                                        <div className="text-xl font-bold text-emerald-700">{selectedPrefecture.total_tags_analyzed}</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm mb-3">Dominasi Industri (Jumlah TSK)</h4>
                                    <div className="space-y-3">
                                        {getPrefectureTopSectors(selectedPrefecture).map((sec, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="flex justify-between text-xs font-bold mb-1 z-10 relative">
                                                    <span className="text-slate-600">{sec.label}</span>
                                                    <span>{sec.count}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-indigo-500 rounded-full" 
                                                        style={{ width: `${(sec.count / (selectedPrefecture.total_tags_analyzed || 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                        {getPrefectureTopSectors(selectedPrefecture).length === 0 && (
                                            <p className="text-xs text-slate-400 italic">Belum ada data sektor spesifik.</p>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 italic">*Menunjukkan jumlah TSK yang melayani bidang ini, bukan jumlah lowongan.</p>
                                </div>
                                
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                                    <p><strong>Insight:</strong> Wilayah ini memiliki {selectedPrefecture.total_tsk} TSK terdaftar. Gunakan data ini untuk memperkirakan persaingan kerja di area {selectedPrefecture.prefecture}.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // STATE B: NATIONAL OVERVIEW (DEFAULT)
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Tren Nasional
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Statistik jumlah <strong>Perusahaan TSK</strong> yang melayani bidang SSW tertentu (Bukan jumlah lowongan).
                                </p>
                            </div>
                            
                            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4">
                                {nationalSSWStats.map((item, idx) => (
                                    <div key={item.code}>
                                        <div className="flex justify-between items-center text-sm mb-1.5">
                                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                                <span className="font-mono text-xs text-slate-400 w-4">#{idx+1}</span>
                                                {item.meta.label}
                                            </span>
                                            <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.count}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.count / (nationalSSWStats[0]?.count || 1)) * 100}%` }}
                                                className={`h-full rounded-full ${item.meta.color.replace('text-', 'bg-')}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>

        {/* BOTTOM: DATA TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* TABLE 1: TOP 10 PREFECTURES */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Map className="w-5 h-5 text-indigo-500" /> Top 10 Wilayah Terpadat
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Prefektur</th>
                                <th className="px-6 py-3 text-right">Total TSK</th>
                                <th className="px-6 py-3 text-right">Teranalisa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.leaderboardRows.slice(0, 10).map((row, i) => (
                                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-slate-400">{i + 1}</td>
                                    <td className="px-6 py-3 font-bold text-slate-800">{row.prefecture}</td>
                                    <td className="px-6 py-3 text-right font-mono text-indigo-600">{row.total_tsk}</td>
                                    <td className="px-6 py-3 text-right font-mono text-emerald-600">{row.total_tags_analyzed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

             {/* TABLE 2: TOP LIKED TSK (EXISTING) */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" /> Top 5 TSK Terfavorit
                    </h3>
                </div>
                <div className="p-0">
                    {data.topLikedTSK.map((tsk, idx) => (
                        <div key={tsk.id} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0
                                ${idx === 0 ? 'bg-amber-100 text-amber-600' : 
                                  idx === 1 ? 'bg-slate-200 text-slate-600' : 
                                  idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}
                            `}>
                                #{idx + 1}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-sm text-slate-800 truncate">{tsk.company_name}</h4>
                                <p className="text-xs text-slate-500 truncate">{tsk.address}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-sakura-500 bg-sakura-50 px-2 py-1 rounded-full shrink-0">
                                <Heart className="w-3 h-3 fill-sakura-500" />
                                {tsk.total_likes}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};
