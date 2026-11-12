import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Briefcase, Info } from 'lucide-react';
import { SSW_FIELDS_META } from '../../constants';

interface SSWFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onSave: (fields: string[]) => void;
  /** Jumlah kantor per id bidang, untuk ditampilkan di sebelah label. */
  counts: Record<string, number>;
  /** Jumlah organisasi yang sudah diriset, untuk catatan cakupan. */
  labeledOrganizations: number;
}

export const SSWFieldModal: React.FC<SSWFieldModalProps> = ({
  isOpen,
  onClose,
  selected,
  onSave,
  counts,
  labeledOrganizations,
}) => {
  const [temp, setTemp] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) setTemp([...selected]);
  }, [isOpen, selected]);

  const toggle = (id: string) => {
    setTemp((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = () => {
    onSave(temp);
    onClose();
  };

  // Bidang tanpa hasil (mis. label kosong di data) disembunyikan supaya
  // tidak menawarkan filter yang pasti menghasilkan nol.
  const visibleFields = SSW_FIELDS_META.filter((f) => (counts[f.id] ?? 0) > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative z-10 max-h-[85vh]"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                  Bidang SSW
                </h3>
                <p className="text-sm text-slate-500">Pilih satu atau beberapa bidang pekerjaan.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center gap-3">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Hanya <strong>{labeledOrganizations.toLocaleString('id-ID')}</strong> organisasi yang
                  sudah diriset punya label bidang. Angka di kanan = jumlah kantor.
                </span>
              </div>

              {temp.length > 0 && (
                <button
                  onClick={() => setTemp([])}
                  className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 font-bold px-2 py-1 rounded hover:bg-slate-200 transition-colors shrink-0"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visibleFields.map((field) => {
                  const isSelected = temp.includes(field.id);
                  return (
                    <button
                      key={field.id}
                      onClick={() => toggle(field.id)}
                      className={`
                        relative px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 border flex items-center justify-between gap-2
                        ${isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                      `}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: field.hex }}
                        />
                        <span className="truncate">{field.label}</span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">{counts[field.id]}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {visibleFields.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-8">
                  Belum ada bidang yang punya label.
                </p>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Simpan{temp.length > 0 ? ` (${temp.length})` : ''}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
