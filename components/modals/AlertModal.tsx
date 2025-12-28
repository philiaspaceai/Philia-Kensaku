import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Info } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 text-center sm:text-left">
                    Penting: Pahami Data Ini
                </h3>

                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                    <p>
                        Halo! Sebelum Anda melihat data statistik, mohon pahami dua hal berikut agar tidak terjadi kesalahpahaman:
                    </p>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3">
                        <div className="mt-0.5 shrink-0">
                            <Info className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-800 block mb-1">Bukan Jumlah Lowongan</span>
                            Angka yang ditampilkan adalah <strong className="text-indigo-600">Jumlah Perusahaan TSK</strong> yang melayani bidang SSW tertentu, <strong>BUKAN</strong> jumlah lowongan kerja yang sedang aktif.
                        </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3">
                        <div className="mt-0.5 shrink-0">
                            <Info className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-800 block mb-1">Data Masih Berkembang</span>
                            Data spesialisasi (Tags) didapatkan dari analisis AI yang berjalan setiap hari. Masih banyak perusahaan yang belum memiliki tags (data belum lengkap). Tren nasional mungkin berubah seiring bertambahnya data yang teranalisa.
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Saya Mengerti
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
