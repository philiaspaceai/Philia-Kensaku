import React from 'react';
import { PREFECTURES, LANGUAGES } from '../constants';
import { SearchFilters } from '../types';
import { motion } from 'framer-motion';
import { Check, Shield, ShieldCheck } from 'lucide-react';

interface AdvancedFilterProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ filters, onChange, onSearch }) => {

  const togglePrefecture = (pref: string) => {
    const newPrefs = filters.prefectures.includes(pref)
      ? filters.prefectures.filter(p => p !== pref)
      : [...filters.prefectures, pref];
    onChange({ ...filters, prefectures: newPrefs });
  };

  const toggleLanguage = (lang: string) => {
    const newLangs = filters.languages.includes(lang)
      ? filters.languages.filter(l => l !== lang)
      : [...filters.languages, lang];
    onChange({ ...filters, languages: newLangs });
  };

  const toggleLegal = () => onChange({ ...filters, supportLegal: !filters.supportLegal });
  const toggleOptional = () => onChange({ ...filters, supportOptional: !filters.supportOptional });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Support Status Selection */}
      <section>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Tipe Dukungan</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={toggleLegal}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
              filters.supportLegal 
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${filters.supportLegal ? 'bg-primary-200 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold">Wajib (Legal)</span>
                <span className="text-xs opacity-70">Sesuai UU Jepang</span>
              </div>
            </div>
            {filters.supportLegal && <Check className="w-5 h-5 text-primary-600" />}
          </button>

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

      {/* Language Selection */}
      <section>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Bahasa yang Didukung</h4>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filters.languages.includes(lang)
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 transform scale-105'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Prefecture Selection */}
      <section>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Lokasi (Prefektur)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {PREFECTURES.map(pref => (
            <button
              key={pref}
              onClick={() => togglePrefecture(pref)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left truncate ${
                filters.prefectures.includes(pref)
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pref}
            </button>
          ))}
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