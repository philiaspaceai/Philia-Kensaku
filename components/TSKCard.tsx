import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Languages, Briefcase, CheckCircle, XCircle, ExternalLink, Calendar, History, Mail, MinusCircle } from 'lucide-react';
import { TSKRecord } from '../types';
import { EmailGeneratorModal } from './modals/EmailGeneratorModal';
import { TagsModal } from './modals/TagsModal';
import { getFieldMeta, CONFIDENCE_LABEL } from '../constants';

interface TSKCardProps {
  item: TSKRecord;
  index: number;
  onCariTahu: (item: TSKRecord) => void;
}

const MAX_VISIBLE_FIELDS = 3;

export const TSKCard: React.FC<TSKCardProps> = ({ item, index, onCariTahu }) => {
  const isBranch = item.office_type === 'Branch';
  const officeTypeLabel = isBranch ? 'Kantor Cabang' : 'Kantor Pusat';

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const renderTags = () => {
    if (item.ssw_fields.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.ssw_fields.slice(0, MAX_VISIBLE_FIELDS).map((field) => {
          const meta = getFieldMeta(field.id);
          if (!meta) return null;
          return (
            <span
              key={field.id}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white"
              style={{ borderColor: meta.hex, color: meta.hex }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.hex }} />
              <span>{meta.label}</span>
              <span className="opacity-60 font-semibold">{CONFIDENCE_LABEL[field.level] ?? field.level}</span>
            </span>
          );
        })}

        {item.ssw_fields.length > MAX_VISIBLE_FIELDS && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTagsModalOpen(true);
            }}
            className="text-[10px] font-bold px-2 py-0.5 text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            +{item.ssw_fields.length - MAX_VISIBLE_FIELDS}
          </button>
        )}
      </div>
    );
  };

  const SupportBadge = ({ value, positiveClass }: { value: boolean | null; positiveClass: string }) => {
    if (value === null) {
      return (
        <div className="flex items-center text-slate-400 text-xs font-bold">
          <MinusCircle className="w-3 h-3 mr-1" /> —
        </div>
      );
    }
    return value ? (
      <div className={`flex items-center text-xs font-bold ${positiveClass}`}>
        <CheckCircle className="w-3 h-3 mr-1" /> Ya
      </div>
    ) : (
      <div className="flex items-center text-slate-400 text-xs font-bold">
        <XCircle className="w-3 h-3 mr-1" /> Tidak
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 relative"
    >
      <div className="p-5 flex-grow relative">
        <div className="flex justify-between items-start mb-3">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              isBranch ? 'bg-orange-100 text-orange-700' : 'bg-primary-100 text-primary-700'
            }`}
          >
            {officeTypeLabel}
          </span>
        </div>

        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-slate-800 leading-tight flex-grow pr-2">{item.name}</h3>
        </div>

        {isBranch && item.hq_name && <p className="text-xs text-slate-500 mb-3">HQ: {item.hq_name}</p>}
        <div className="text-xs text-slate-400 font-mono mb-2">#{item.reg_number}</div>

        {renderTags()}

        <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
              <Calendar className="w-3 h-3 text-primary-500" /> Tanggal Registrasi
            </span>
            <span className="text-xs font-semibold text-slate-700">{formatDate(item.reg_date)}</span>
          </div>
          {item.support_start_date && (
            <div className="flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                <History className="w-3 h-3 text-sakura-500" /> Mulai Operasi
              </span>
              <span className="text-xs font-semibold text-slate-700">{formatDate(item.support_start_date)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start text-sm text-slate-600">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-primary-500 shrink-0" />
            <span>
              <span className="block text-xs text-slate-400">〒{item.zipcode ?? '-'}</span>
              {item.address ?? 'Alamat tidak tercatat'}
            </span>
          </div>

          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-4 h-4 mr-2 text-primary-500 shrink-0" />
            <span>{item.phone ?? '-'}</span>
          </div>

          <div className="flex items-start text-sm text-slate-600">
            <Languages className="w-4 h-4 mr-2 mt-0.5 text-primary-500 shrink-0" />
            <span className="line-clamp-2" title={item.languages.join(', ') || 'N/A'}>
              {item.languages.length > 0 ? item.languages.join(', ') : 'Bahasa tidak tercatat'}
            </span>
          </div>

          {item.representative && (
            <div className="flex items-center text-sm text-slate-600">
              <Briefcase className="w-4 h-4 mr-2 text-primary-500 shrink-0" />
              <span className="truncate" title={item.representative}>
                CEO: {item.representative}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 px-5 pt-3 pb-2 border-t border-slate-100 grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Legal Support</span>
          <SupportBadge value={item.support_legal} positiveClass="text-green-600" />
        </div>
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Optional Support</span>
          <SupportBadge value={item.support_optional} positiveClass="text-blue-600" />
        </div>
      </div>

      <div className="bg-slate-50 px-5 pb-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-[10px] text-sm transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 shadow-sm"
        >
          <Mail className="w-4 h-4 text-slate-500" />
          <span>Buat Email</span>
        </button>

        <div className="p-[2px] rounded-xl bg-gradient-to-r from-primary-600 via-sakura-500 to-primary-600 animate-gradient-xy group shadow-sm hover:shadow-md transition-shadow">
          <button
            onClick={() => onCariTahu(item)}
            className="w-full h-full flex items-center justify-center gap-2 bg-white text-slate-800 font-bold py-3 rounded-[10px] text-sm transition-all duration-200 hover:bg-slate-50"
          >
            <span>Cari tahu</span>
            <ExternalLink className="w-4 h-4 text-primary-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <EmailGeneratorModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        companyName={item.name}
      />

      <TagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        fields={item.ssw_fields}
        companyName={item.name}
      />
    </motion.div>
  );
};
