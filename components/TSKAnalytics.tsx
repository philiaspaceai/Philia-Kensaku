import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, PieChart, TrendingUp, RefreshCw, MapPin, Building2, AlertCircle, ChevronDown, LayoutDashboard, Microscope } from 'lucide-react';
import { AnalyticsData, PrefectureStat } from '../types';
import { computeAnalytics, loadDataset } from '../services/dataService';
import { JapanMap } from './ui/JapanMap';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { SSW_FIELDS_META, getFieldMeta } from '../constants';
import { AlertModal } from './modals/AlertModal';

interface TSKAnalyticsProps {
  onBack: () => void;
}

const METRIC_OPTIONS = [
  { value: 'total_tsk', label: 'Semua TSK (Total)', hex: '#0ea5e9' },
  ...SSW_FIELDS_META.map((f) => ({ value: f.id, label: f.label, hex: f.hex })),
];

export const TSKAnalytics: React.FC<TSKAnalyticsProps> = ({ onBack }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeMetric, setActiveMetric] = useState<string>('total_tsk');
  const [selectedPrefecture, setSelectedPrefecture] = useState<PrefectureStat | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadDataset()
      .then(({ records, manifest }) => {
        if (!mounted) return;
        setData(computeAnalytics(records, manifest));
      })
      .catch((err: Error) => {
        if (!mounted) return;
        setError(err.message || 'Gagal memuat data analitik.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const currentMetric = METRIC_OPTIONS.find((m) => m.value === activeMetric) ?? METRIC_OPTIONS[0];

  const mapData = useMemo(() => {
    if (!data) return {};
    const map: Record<string, number> = {};
    for (const row of data.leaderboardRows) {
      const val = activeMetric === 'total_tsk' ? row.total_tsk : row.ssw[activeMetric] ?? 0;
      if (val > 0) map[row.prefecture] = val;
    }
    return map;
  }, [data, activeMetric]);

  const nationalStats = useMemo(() => {
    if (!data) return [];
    return data.national.map((entry) => ({
      ...entry,
      meta: getFieldMeta(entry.id),
    }));
  }, [data]);

  const handleMapToggle = (prefName: string) => {
    if (!data) return;
    const row = data.leaderboardRows.find((r) => r.prefecture === prefName);
    setSelectedPrefecture(row ?? null);
  };

  const getTopSectors = (row: PrefectureStat) => {
    return Object.entries(row.ssw)
      .map(([id, count]) => ({ id, count, meta: getFieldMeta(id) }))
      .filter((s) => s.meta)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
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
          <button onClick={onBack} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const coverage = data.overview.totalTSK > 0
    ? ((data.overview.labeledTSK / data.overview.totalTSK) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <AlertModal isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />

      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Data Center TSK
            </h1>
          </div>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">Snapshot: {data.snapshotDate}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Total TSK
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{data.overview.totalTSK.toLocaleString()}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Microscope className="w-4 h-4" /> Sudah Diriset
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {data.overview.labeledTSK.toLocaleString()}{' '}
              <span className="text-sm font-medium text-slate-400">Organisasi</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <PieChart className="w-4 h-4" /> Cakupan Data
            </div>
            <div className="text-3xl font-extrabold text-indigo-600">{coverage}%</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white"
          >
            <div className="flex items-center gap-2 mb-2 text-white/80 text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-4 h-4" /> Sumber Data
            </div>
            <div className="text-lg font-bold">Snapshot Lokal</div>
            <div className="text-xs text-white/70 mt-1">{data.overview.totalRows.toLocaleString()} baris kantor</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 flex flex-col space-y-4"
          >
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
                    setSelectedPrefecture(null);
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                >
                  {METRIC_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[450px] sm:h-[600px] relative">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                Mode: <span style={{ color: currentMetric.hex }}>{currentMetric.label}</span>
              </div>

              <div className="flex-grow bg-slate-50 relative overflow-hidden">
                <JapanMap heatmapData={mapData} heatmapColor={currentMetric.hex} onToggle={handleMapToggle} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full gap-6"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col flex-grow overflow-hidden min-h-[400px]">
              {selectedPrefecture ? (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Rapor Wilayah</div>
                        <h3 className="text-2xl font-extrabold text-slate-900">{selectedPrefecture.prefecture}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedPrefecture(null)}
                        className="p-1 hover:bg-slate-200 rounded-full text-slate-400"
                      >
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
                        <div className="text-xs text-emerald-700">Sudah Diriset</div>
                        <div className="text-xl font-bold text-emerald-700">{selectedPrefecture.total_tags_analyzed}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-700 text-sm mb-3">Dominasi Industri (Jumlah TSK)</h4>
                      <div className="space-y-3">
                        {getTopSectors(selectedPrefecture).map((sec) => (
                          <div key={sec.id} className="relative">
                            <div className="flex justify-between text-xs font-bold mb-1 z-10 relative">
                              <span className="text-slate-600">{sec.meta!.label}</span>
                              <span>{sec.count}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(sec.count / (selectedPrefecture.total_tags_analyzed || 1)) * 100}%`,
                                  background: sec.meta!.hex,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        {getTopSectors(selectedPrefecture).length === 0 && (
                          <p className="text-xs text-slate-400 italic">Belum ada data sektor spesifik.</p>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 italic">
                        *Menunjukkan jumlah TSK yang melayani bidang ini, bukan jumlah lowongan.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                      <p>
                        <strong>Insight:</strong> Wilayah ini memiliki {selectedPrefecture.total_tsk} TSK terdaftar.
                        Gunakan data ini untuk memperkirakan persaingan kerja di area {selectedPrefecture.prefecture}.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" /> Tren Nasional
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Statistik jumlah <strong>Perusahaan TSK</strong> yang melayani bidang SSW tertentu (Bukan jumlah
                      lowongan).
                    </p>
                  </div>

                  <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {nationalStats.map((item, idx) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-center text-sm mb-1.5">
                          <span className="font-bold text-slate-700 flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-400 w-4">#{idx + 1}</span>
                            {item.meta?.label ?? item.id}
                          </span>
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {item.count}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.count / (nationalStats[0]?.count || 1)) * 100}%` }}
                            className="h-full rounded-full"
                            style={{ background: item.meta?.hex ?? '#94a3b8' }}
                          />
                        </div>
                      </div>
                    ))}
                    {nationalStats.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Belum ada organisasi yang diriset.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-500" /> Top 10 Wilayah Terpadat
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {data.overview.prefectureUnknown > 0
                ? `${data.overview.prefectureUnknown} baris prefektur tak terdeteksi`
                : 'Semua baris terpetakan'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Prefektur</th>
                  <th className="px-6 py-3 text-right">Total TSK</th>
                  <th className="px-6 py-3 text-right">Sudah Diriset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.leaderboardRows.slice(0, 10).map((row, i) => (
                  <tr key={row.prefecture} className="hover:bg-slate-50 transition-colors">
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
      </div>
    </div>
  );
};
