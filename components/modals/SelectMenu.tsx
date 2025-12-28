import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Info, Banknote, ChevronRight } from 'lucide-react';

interface SelectMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'analytics' | 'info' | 'donate') => void;
}

export const SelectMenu: React.FC<SelectMenuProps> = ({ isOpen, onClose, onSelectOption }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Menu Informasi</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* OPTION 1: ANALYTICS */}
                    <button
                        onClick={() => onSelectOption('analytics')}
                        className="w-full flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-100 rounded-2xl group transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600 mr-4 shrink-0 relative z-10">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div className="text-left relative z-10 flex-grow">
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">Informasi Lengkap TSK</h3>
                            <p className="text-xs text-slate-500 mt-1">Statistik, Peta Persebaran, & Ranking</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded-full text-indigo-400 group-hover:text-indigo-600 group-hover:bg-white transition-all relative z-10">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                        
                        {/* Decorative Blob */}
                        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-300/30 transition-all"></div>
                    </button>

                    {/* OPTION 2: INFO */}
                    <button
                        onClick={() => onSelectOption('info')}
                        className="w-full flex items-center p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-2xl group transition-all duration-300"
                    >
                        <div className="bg-white p-3 rounded-xl shadow-sm text-slate-500 mr-4 shrink-0 group-hover:text-slate-700">
                            <Info className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-grow">
                            <h3 className="font-bold text-slate-800 text-lg">Tentang Philia Kensaku</h3>
                            <p className="text-xs text-slate-500 mt-1">Legalitas, Kredit, & Teknologi</p>
                        </div>
                        <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </button>

                    {/* OPTION 3: DONATION */}
                    <button
                        onClick={() => onSelectOption('donate')}
                        className="w-full flex items-center p-4 bg-sakura-50 hover:bg-sakura-100 border border-sakura-100 rounded-2xl group transition-all duration-300"
                    >
                        <div className="bg-white p-3 rounded-xl shadow-sm text-sakura-500 mr-4 shrink-0 group-hover:text-sakura-600">
                            <Banknote className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-grow">
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-sakura-700 transition-colors">Donasi ke Philia Space</h3>
                            <p className="text-xs text-slate-500 mt-1">Dukung pengembangan server</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded-full text-sakura-400 group-hover:text-sakura-600 group-hover:bg-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
            
            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400">
                    Philia Kensaku v3.0 • Winter Edition
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};