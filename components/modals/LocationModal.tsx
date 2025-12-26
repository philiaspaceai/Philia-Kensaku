
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check, Info, Trash2, CheckSquare } from 'lucide-react';
import { JapanMap } from '../ui/JapanMap';
import { PREFECTURES } from '../../constants';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrefectures: string[];
  onSave: (prefs: string[]) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, selectedPrefectures, onSave }) => {
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTempSelected([...selectedPrefectures]);
    }
  }, [isOpen, selectedPrefectures]);

  const togglePrefecture = (pref: string) => {
    setTempSelected(prev => {
      if (prev.includes(pref)) {
        return prev.filter(p => p !== pref);
      } else {
        return [...prev, pref];
      }
    });
  };

  const handleSelectAll = () => {
    setTempSelected([...PREFECTURES]);
  };

  const handleSave = () => {
    onSave(tempSelected);
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden relative z-10"
          >
            {/* 1. Header (Fixed Height) */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  Pilih Lokasi Target
                </h3>
                <p className="text-sm text-slate-500 hidden sm:block">Klik peta atau nama wilayah untuk memilih.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 2. Body (Flexible Content) */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-slate-50">
              
              {/* KIRI: PETA */}
              {/* Mobile: Tinggi dikurangi jadi 280px agar list terlihat. Desktop: Lebar 50% dan isi tinggi penuh. */}
              <div className="w-full md:w-6/12 h-[280px] md:h-auto bg-slate-100 relative border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
                 <div className="absolute inset-0 p-2 md:p-4">
                    <JapanMap 
                        selectedPrefectures={tempSelected}
                        onToggle={togglePrefecture}
                    />
                 </div>

                 {/* Legend */}
                 <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex justify-center md:justify-start">
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full shadow-sm flex gap-4 text-[10px] font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-slate-300 rounded-sm border border-slate-400"></div>
                            <span>Belum Dipilih</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-sm border border-blue-600"></div>
                            <span>Terpilih</span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* KANAN: LIST WILAYAH */}
              {/* Kunci Scroll Desktop: flex-col + flex-1 + overflow-hidden pada parent, overflow-y-auto pada list */}
              <div className="flex flex-col flex-1 w-full md:w-6/12 bg-white min-h-0">
                 {/* List Header */}
                 <div className="px-4 py-3 border-b border-slate-100 bg-white shrink-0 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Info className="w-4 h-4 text-primary-500" />
                        Daftar Prefektur
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {tempSelected.length < PREFECTURES.length && (
                            <button 
                                onClick={handleSelectAll}
                                className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-800 font-bold px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                            >
                                <CheckSquare className="w-3 h-3" /> Pilih Semua
                            </button>
                        )}
                        
                        {tempSelected.length > 0 && (
                            <button 
                                onClick={() => setTempSelected([])}
                                className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> Reset ({tempSelected.length})
                            </button>
                        )}
                    </div>
                 </div>

                 {/* SCROLLABLE AREA */}
                 {/* Tambahkan padding bawah (pb-20) agar item terakhir tidak tertutup footer di layar pendek */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-20 md:pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {PREFECTURES.map(pref => {
                            const isSelected = tempSelected.includes(pref);
                            return (
                                <button
                                    key={pref}
                                    onClick={() => togglePrefecture(pref)}
                                    className={`
                                        relative px-3 py-3 rounded-lg text-xs sm:text-sm text-left transition-all duration-200 border flex items-center justify-between group
                                        ${isSelected 
                                            ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold shadow-sm ring-1 ring-primary-500' 
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-primary-300 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <span className="truncate mr-2">{pref}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                 </div>
              </div>
            </div>

            {/* 3. Footer (Fixed Height) */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 z-20">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Simpan Lokasi {tempSelected.length > 0 ? `(${tempSelected.length})` : ''}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
