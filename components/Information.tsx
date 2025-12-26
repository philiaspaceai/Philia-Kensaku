
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Database, ExternalLink, ShieldAlert, Heart, Cpu, FileText, Scale, Globe, UserCheck, Copyright } from 'lucide-react';
import { fetchTotalCount } from '../services/tskService';
import { motion } from 'framer-motion';

interface InformationProps {
  onBack: () => void;
}

export const Information: React.FC<InformationProps> = ({ onBack }) => {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    fetchTotalCount().then(setTotalCount);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800">Tentang Philia Kensaku</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        
        {/* BLOCK A: DATA STATS */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
            <div className="p-6 sm:p-8 relative">
                <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                             <Database className="w-4 h-4" /> Statistik Data
                        </h2>
                        <div className="flex items-baseline gap-2">
                            {totalCount === null ? (
                                <div className="h-10 w-32 bg-slate-200 rounded animate-pulse my-1"></div>
                            ) : (
                                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                                    {totalCount.toLocaleString()}
                                </span>
                            )}
                            <span className="text-sm font-semibold text-slate-500">Perusahaan TSK</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 max-w-lg">
                            Data diambil secara <em>real-time</em> dari database kami yang disinkronisasi dengan publikasi resmi.
                        </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-w-xs w-full">
                        <p className="text-xs font-bold text-slate-500 mb-2">Sumber Data Resmi:</p>
                        <a 
                            href="https://www.moj.go.jp/isa/applications/ssw/nyuukokukanri07_00205.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group"
                        >
                            <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:border-primary-300 transition-colors">
                                <Globe className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">Kementerian Kehakiman Jepang (MOJ)</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                                    Buka File Asli <ExternalLink className="w-3 h-3" />
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-green-50 px-6 py-3 border-t border-green-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-green-700">Sistem Database Online & Aktif</span>
            </div>
        </motion.div>

        {/* BLOCK B: CREDITS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Operator */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full"
            >
                <div className="flex items-center gap-2 mb-4">
                     <div className="bg-indigo-100 p-2 rounded-lg">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                     </div>
                     <h3 className="font-bold text-lg text-slate-800">Operator & Penanggung Jawab</h3>
                </div>
                
                <div className="flex-grow space-y-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Dioperasikan Oleh</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">Putera Perdana Gemilang Baang</p>
                        <p className="text-sm text-indigo-600 font-medium">Philia Space Community</p>
                    </div>
                    
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "Saya bertanggung jawab penuh atas operasional prompt AI, kurasi data, dan pemeliharaan sistem. Segala ketidakakuratan yang mungkin timbul dari hasil generasi AI atau <em>human-error</em> adalah tanggung jawab saya sebagai operator, bukan afiliasi pihak ketiga manapun."
                    </p>
                </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full"
            >
                <div className="flex items-center gap-2 mb-4">
                     <div className="bg-rose-100 p-2 rounded-lg">
                        <Cpu className="w-5 h-5 text-rose-600" />
                     </div>
                     <h3 className="font-bold text-lg text-slate-800">Teknologi</h3>
                </div>
                
                <div className="space-y-4 flex-grow">
                    <div className="flex items-center gap-3">
                         {/* Fake Logo for Google AI Studio */}
                         <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                            AI
                         </div>
                         <div>
                            <p className="font-bold text-slate-800">Google AI Studio</p>
                            <p className="text-xs text-slate-500">Gemini Models</p>
                         </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Aplikasi ini menggunakan teknologi AI terbaru dari Google untuk membantu menganalisis data, memberikan rekomendasi strategi, dan menghasilkan konten bantuan (seperti email lamaran).
                    </p>
                </div>
            </motion.div>
        </div>

        {/* BLOCK C: LICENSE */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <Scale className="w-6 h-6 text-primary-400" />
                    <h3 className="text-xl font-bold">Lisensi & Hak Cipta</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                        <p className="text-slate-300 mb-4 leading-relaxed">
                            Philia Kensaku dibuat untuk publik dengan prinsip <strong>Non-Profit</strong>. Kode sumber dan data olahan dilisensikan di bawah:
                        </p>
                        <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-lg font-mono text-sm font-bold text-primary-300 mb-4">
                            CC BY-NC-SA 4.0
                        </div>
                        <p className="text-xs text-slate-400">
                            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <UserCheck className="w-5 h-5 text-green-400 mb-2" />
                            <p className="text-xs font-bold text-white mb-1">BY (Atribusi)</p>
                            <p className="text-[10px] text-slate-400">Wajib mencantumkan kredit ke Philia Kensaku.</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <Copyright className="w-5 h-5 text-yellow-400 mb-2" />
                            <p className="text-xs font-bold text-white mb-1">NC (Non-Komersial)</p>
                            <p className="text-[10px] text-slate-400">Dilarang menjual data ini untuk keuntungan.</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <Heart className="w-5 h-5 text-pink-400 mb-2" />
                            <p className="text-xs font-bold text-white mb-1">SA (Berbagi Serupa)</p>
                            <p className="text-[10px] text-slate-400">Karya turunan harus gratis juga.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* BLOCK D: DISCLAIMER */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start gap-4"
        >
            <ShieldAlert className="w-8 h-8 text-orange-500 shrink-0" />
            <div>
                <h3 className="text-base font-bold text-orange-800 mb-2">Disclaimer Hukum (Penafian)</h3>
                <p className="text-sm text-orange-700/80 leading-relaxed">
                    Aplikasi ini adalah <strong>Alat Bantu Riset (Research Tool)</strong> semata. Philia Kensaku <strong>BUKAN</strong> agen penyalur (LPK/SO), bukan perwakilan pemerintah, dan <strong>TIDAK</strong> memungut biaya sepeserpun dari pengguna.
                </p>
                <p className="text-sm text-orange-700/80 leading-relaxed mt-2">
                    Keputusan akhir untuk menandatangani kontrak kerja adalah tanggung jawab penuh pengguna. Kami tidak bertanggung jawab atas sengketa kerja, kerugian finansial, atau masalah hukum yang mungkin terjadi antara pengguna dan perusahaan TSK. Selalu lakukan verifikasi mandiri.
                </p>
            </div>
        </motion.div>

        <div className="text-center pt-8 pb-4">
             <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Philia Space Community. Built for Indonesian Tokutei Ginou Warriors.
             </p>
        </div>

      </div>
    </div>
  );
};
