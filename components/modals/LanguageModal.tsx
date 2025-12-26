
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, Languages, Ban, RotateCcw } from 'lucide-react';
import { LANGUAGES } from '../../constants';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguages: string[];
  excludedLanguages?: string[];
  onSave: (included: string[], excluded: string[]) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedLanguages, 
  excludedLanguages = [], 
  onSave 
}) => {
  // State sets
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIncluded([...selectedLanguages]);
      setExcluded([...excludedLanguages]);
    }
  }, [isOpen, selectedLanguages, excludedLanguages]);

  // 3-State Toggle Logic:
  // Neutral -> Included -> Excluded -> Neutral
  const toggleLanguage = (lang: string) => {
    if (included.includes(lang)) {
        // Change from Included to Excluded
        setIncluded(prev => prev.filter(l => l !== lang));
        setExcluded(prev => [...prev, lang]);
    } else if (excluded.includes(lang)) {
        // Change from Excluded to Neutral
        setExcluded(prev => prev.filter(l => l !== lang));
    } else {
        // Change from Neutral to Included
        setIncluded(prev => [...prev, lang]);
    }
  };

  const handleReset = () => {
    setIncluded([]);
    setExcluded([]);
  };

  const handleSave = () => {
    onSave(included, excluded);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative z-10 max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-indigo-500" />
                  Pilih Bahasa
                </h3>
                <p className="text-sm text-slate-500">
                    Klik 1x: <span className="text-indigo-600 font-bold">Pilih</span> | 
                    Klik 2x: <span className="text-red-500 font-bold">Kecualikan</span>
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-indigo-600"/> {included.length} Dipilih</span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1"><Ban className="w-3 h-3 text-red-500"/> {excluded.length} Dikecualikan</span>
                </div>
                
                {(included.length > 0 || excluded.length > 0) && (
                    <button 
                        onClick={handleReset}
                        className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 font-bold px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LANGUAGES.map(lang => {
                        const isIncluded = included.includes(lang);
                        const isExcluded = excluded.includes(lang);
                        
                        let baseClass = "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50";
                        let icon = null;
                        let indicatorClass = "bg-slate-300";

                        if (isIncluded) {
                            baseClass = "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-500";
                            icon = <Check className="w-4 h-4 text-indigo-600" />;
                            indicatorClass = "bg-indigo-500";
                        } else if (isExcluded) {
                            baseClass = "bg-red-50 border-red-500 text-red-700 font-bold shadow-sm ring-1 ring-red-500";
                            icon = <Ban className="w-4 h-4 text-red-600" />;
                            indicatorClass = "bg-red-500";
                        }

                        return (
                            <button
                                key={lang}
                                onClick={() => toggleLanguage(lang)}
                                className={`
                                    relative px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 border flex items-center justify-between group
                                    ${baseClass}
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${indicatorClass}`}></span>
                                    {lang}
                                </span>
                                {icon}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Simpan
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
