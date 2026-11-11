import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PieChart } from 'lucide-react';
import { SSWField } from '../../types';
import { getFieldMeta, CONFIDENCE_LABEL, CONFIDENCE_BAR } from '../../constants';

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: SSWField[];
  companyName: string;
}

export const TagsModal: React.FC<TagsModalProps> = ({ isOpen, onClose, fields, companyName }) => {
  if (fields.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary-500" />
                  Analisa Sektor Pekerjaan
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">{companyName}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {fields.map((field) => {
                  const meta = getFieldMeta(field.id);
                  if (!meta) return null;
                  return (
                    <div key={field.id} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: meta.hex }} />
                          {meta.label}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {CONFIDENCE_LABEL[field.level] ?? field.level}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${CONFIDENCE_BAR[field.level] ?? 30}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full rounded-full"
                          style={{ background: meta.hex }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Penilaian tingkat keyakinan hasil riset OSINT terhadap jejak digital perusahaan,
                bukan angka probabilitas. Tetap lakukan verifikasi mandiri.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
