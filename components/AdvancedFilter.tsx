
import React, { useState } from 'react';
import { SearchFilters } from '../types';
import { motion } from 'framer-motion';
import { Check, Shield, ShieldCheck, MapPin, Languages, Lock, Calendar, History } from 'lucide-react';
import { LocationModal } from './modals/LocationModal';
import { LanguageModal } from './modals/LanguageModal';

interface AdvancedFilterProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ filters, onChange, onSearch }) => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Legal is locked true, no toggle function provided to UI
  const toggleOptional = () => onChange({ ...filters, supportOptional: !filters.supportOptional });

  // Date Sort Handlers
  const setSortNewest = () => onChange({ ...filters, dateSort: filters.dateSort === 'newest' ? null : 'newest' });
  const setSortOldest = () => onChange({ ...filters, dateSort: filters.dateSort === 'oldest' ? null : 'oldest' });

  const handleLocationSave = (newPrefectures: string[]) => {
      onChange({ ...filters, prefectures: newPrefectures });
  };

  const handleLanguageSave = (included: string[], excluded: string[]) => {
      onChange({ ...filters, languages: included, excludedLanguages: excluded });
  };

  // Helper to summarize language selection
  const getLanguageSummary = () => {
    const inc = filters.languages.length;
    const exc = filters.excludedLanguages?.length || 0;
    
    if (inc === 0 && exc === 0) return "Semua Bahasa";
    
    const parts = [];
    if (inc > 0) parts.push(`${inc} Dipilih`);
    if (exc > 0) parts.push(`${exc} Kecuali`);
    
    return parts.join(", ");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* 1. Filter Area (Location & Language) */}
      <section>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Area & Bahasa</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* BUTTON LOKASI */}
            <button
                onClick={() => setIsLocationModalOpen(true)}
                className={`
                    w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
                    ${filters.prefectures.length > 0 
                        ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50 text-slate-500'
                    }
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2.5 rounded-lg shrink-0 ${filters.prefectures.length > 0 ? 'bg-primary-200 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0">
                        <span className="block font-bold text-base truncate">
                            {filters.prefectures.length === 0 
                                ? "Pilih Lokasi" 
                                : `${filters.prefectures.length} Lokasi`
                            }
                        </span>
                        <span className="text-xs opacity-70 truncate block">
                            {filters.prefectures.length === 0 
                                ? "Semua Prefektur" 
                                : filters.prefectures.slice(0, 2).join(", ") + (filters.prefectures.length > 2 ? ", ..." : "")
                            }
                        </span>
                    </div>
                </div>
                
                <div className="ml-2 shrink-0">
                    {filters.prefectures.length > 0 ? (
                        <div className="bg-primary-600 text-white p-1 rounded-full">
                            <Check className="w-3 h-3" />
                        </div>
                    ) : (
                        <span className="text-slate-300 text-2xl font-light leading-none">+</span>
                    )}
                </div>
            </button>

            {/* BUTTON BAHASA */}
            <button
                onClick={() => setIsLanguageModalOpen(true)}
                className={`
                    w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
                    ${(filters.languages.length > 0 || (filters.excludedLanguages?.length || 0) > 0)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-500'
                    }
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2.5 rounded-lg shrink-0 ${(filters.languages.length > 0 || (filters.excludedLanguages?.length || 0) > 0) ? 'bg-indigo-200 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Languages className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0">
                        <span className="block font-bold text-base truncate">
                            {filters.languages.length === 0 && (filters.excludedLanguages?.length || 0) === 0
                                ? "Pilih Bahasa" 
                                : `${filters.languages.length + (filters.excludedLanguages?.length || 0)} Filter`
                            }
                        </span>
                        <span className="text-xs opacity-70 truncate block">
                            {getLanguageSummary()}
                        </span>
                    </div>
                </div>
                
                <div className="ml-2 shrink-0">
                    {(filters.languages.length > 0 || (filters.excludedLanguages?.length || 0) > 0) ? (
                        <div className="bg-indigo-600 text-white p-1 rounded-full">
                             <Check className="w-3 h-3" />
                        </div>
                    ) : (
                        <span className="text-slate-300 text-2xl font-light leading-none">+</span>
                    )}
                </div>
            </button>
        </div>

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
        />
      </section>

      {/* 2. Filter Urutan Tanggal */}
      <section>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Urutkan Tanggal Mulai Operasi</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* TERBARU */}
          <button
            onClick={setSortNewest}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
              filters.dateSort === 'newest'
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${filters.dateSort === 'newest' ? 'bg-primary-200 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
                {/* SAFE ICON: Calendar (Universal) */}
                <Calendar size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold">Terbaru</span>
                <span className="text-xs opacity-70">Operasi Paling Baru</span>
              </div>
            </div>
            {filters.dateSort === 'newest' && <Check className="w-5 h-5 text-primary-600" />}
          </button>

          {/* TERLAMA */}
          <button
            onClick={setSortOldest}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
              filters.dateSort === 'oldest'
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center">
               <div className={`p-2 rounded-lg mr-3 ${filters.dateSort === 'oldest' ? 'bg-primary-200 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
                {/* SAFE ICON: History (Universal) */}
                <History size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold">Terlama</span>
                <span className="text-xs opacity-70">Operasi Paling Lama</span>
              </div>
            </div>
            {filters.dateSort === 'oldest' && <Check className="w-5 h-5 text-primary-600" />}
          </button>
        </div>
      </section>

      {/* 3. Filter Tipe Dukungan */}
      <section>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Tipe Dukungan</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* LOCKED LEGAL BUTTON */}
          <div
            className="relative p-4 rounded-xl border-2 border-primary-500 bg-primary-50 text-primary-700 flex items-center justify-between opacity-80 cursor-not-allowed"
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3 bg-primary-200 text-primary-700">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold">Wajib (Legal)</span>
                <span className="text-xs opacity-70">Wajib Sesuai UU Jepang</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-600" />
                <Check className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          <button
            onClick={toggleOptional}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
              filters.supportOptional 
                ? 'border-sakura-500 bg-sakura-50 text-sakura-700' 
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center">
               <div className={`p-2 rounded-lg mr-3 ${filters.supportOptional ? 'bg-sakura-200 text-sakura-700' : 'bg-slate-100 text-slate-400'}`}>
                <Shield size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold">Opsional</span>
                <span className="text-xs opacity-70">Layanan Tambahan</span>
              </div>
            </div>
            {filters.supportOptional && <Check className="w-5 h-5 text-sakura-600" />}
          </button>
        </div>
      </section>

       <div className="pt-4 flex justify-end">
          <button
            onClick={onSearch}
            className="animate-gradient-xy bg-gradient-to-r from-primary-600 via-sakura-500 to-primary-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transform transition hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
          >
            Cari TSK
          </button>
       </div>
    </div>
  );
};
