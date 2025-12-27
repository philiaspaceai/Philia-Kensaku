import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Languages, Briefcase, CheckCircle, XCircle, ExternalLink, Heart, Calendar, History, Mail } from 'lucide-react';
import { TSKData } from '../types';
import { toggleLikeTSK } from '../services/tskService';
import { EmailGeneratorModal } from './modals/EmailGeneratorModal';
import { TagsModal } from './modals/TagsModal';
import { TSK_TAGS } from '../constants';

interface TSKCardProps {
  item: TSKData;
  index: number;
  initialLiked: boolean;
  onCariTahu: (item: TSKData) => void; // Parent handler for AI process
}

export const TSKCard: React.FC<TSKCardProps> = ({ item, index, initialLiked, onCariTahu }) => {
  // Update logic based on new DB values: 'Branch' vs 'Head Office'
  const isBranch = item.office_type === 'Branch';
  const officeTypeLabel = isBranch ? 'Kantor Cabang' : 'Kantor Pusat';
  
  // Local state for optimistic UI updates
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(item.total_likes || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  // Format count (e.g., 1200 -> 1.2k)
  const formattedLikeCount = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  }).format(likeCount);

  // Helper to format date to Indonesian (e.g., "20 Agustus 2023")
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isLikeLoading) return;

    // Optimistic Update
    const previousLiked = liked;
    const previousCount = likeCount;

    setLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
    setIsLikeLoading(true);

    try {
      const result = await toggleLikeTSK(item.id);
      // Sync with server truth (just in case)
      setLiked(result.liked);
      setLikeCount(result.total);
    } catch (error) {
      console.error("Failed to toggle like", error);
      // Revert on error
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  // Display logic: strict check based on isBranch
  // If isBranch is true, we trust the DB guarantee that branch fields are populated.
  const displayName = (isBranch && item.branch_name) ? item.branch_name : item.company_name;
  const displayAddress = (isBranch && item.branch_address) ? item.branch_address : item.address;
  const displayZip = (isBranch && item.branch_zipcode) ? item.branch_zipcode : item.zipcode;

  // Render Tags
  const renderTags = () => {
    if (!item.tags) return null;
    
    // NEW FORMAT: "A90,B85" -> split
    const rawTags = item.tags.split(',').filter(c => c.trim() !== '');
    if (rawTags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5 mb-3">
            {rawTags.slice(0, 3).map(rawTag => {
                // Parse "A90" -> Code: A, Percent: 90
                const code = rawTag.charAt(0);
                const percent = rawTag.substring(1);
                
                const tag = TSK_TAGS[code];
                if (!tag) return null;
                
                return (
                    <span key={rawTag} className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-current opacity-90 ${tag.color} ${tag.bg}`}>
                        <span>{tag.label}</span>
                        {percent && <span className="text-[9px] opacity-70 border-l border-current pl-1 ml-0.5">{percent}%</span>}
                    </span>
                );
            })}
            
            {/* TAGS OVERFLOW MODAL TRIGGER */}
            {rawTags.length > 3 && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsTagsModalOpen(true);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                    +{rawTags.length - 3}
                </button>
            )}
        </div>
    );
  };

  return (
    <>
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 relative"
        >
        <div className="p-5 flex-grow relative">
            <div className="flex justify-between items-start mb-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${isBranch ? 'bg-orange-100 text-orange-700' : 'bg-primary-100 text-primary-700'}`}>
                {officeTypeLabel}
            </span>
            
            <div className="flex items-center space-x-2">
                {/* Like Button */}
                <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className="flex items-center space-x-1 group focus:outline-none"
                >
                <div className={`p-1.5 rounded-full transition-colors ${liked ? 'bg-sakura-50' : 'hover:bg-slate-100'}`}>
                    <Heart 
                        className={`w-5 h-5 transition-all duration-300 ${
                            liked 
                            ? 'fill-sakura-500 text-sakura-500' 
                            : 'text-slate-300 group-hover:text-slate-400'
                        }`} 
                    />
                </div>
                <span className={`text-xs font-bold transition-colors ${liked ? 'text-sakura-500' : 'text-slate-400'}`}>
                    {formattedLikeCount}
                </span>
                </motion.button>
            </div>
            </div>

            <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-800 leading-tight flex-grow pr-2">{displayName}</h3>
            </div>
            
            {isBranch && <p className="text-xs text-slate-500 mb-3">HQ: {item.company_name}</p>}
            <div className="text-xs text-slate-400 font-mono mb-2">#{item.reg_number}</div>

            {/* AI Tags Display (NOW WITH %) */}
            {renderTags()}

            {/* Info Dates (Registration & Operation) */}
            <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3 h-3 text-primary-500" /> Tanggal Registrasi
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                        {formatDate(item.reg_date)}
                    </span>
                </div>
                {item.support_start_date && (
                    <div className="flex flex-col border-l border-slate-200 pl-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mb-1">
                            <History className="w-3 h-3 text-sakura-500" /> Mulai Operasi
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                            {formatDate(item.support_start_date)}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-2.5">
            <div className="flex items-start text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-primary-500 shrink-0" />
                <span>
                <span className="block text-xs text-slate-400">〒{displayZip}</span>
                {displayAddress}
                </span>
            </div>

            <div className="flex items-center text-sm text-slate-600">
                <Phone className="w-4 h-4 mr-2 text-primary-500 shrink-0" />
                <span>{item.phone}</span>
            </div>
            
            <div className="flex items-start text-sm text-slate-600">
                <Languages className="w-4 h-4 mr-2 mt-0.5 text-primary-500 shrink-0" />
                <span className="line-clamp-2" title={item.language || "N/A"}>
                {item.language ? item.language.replace(/,/g, ', ') : 'Bahasa tidak tercatat'}
                </span>
            </div>
            
            {item.representative && (
                <div className="flex items-center text-sm text-slate-600">
                    <Briefcase className="w-4 h-4 mr-2 text-primary-500 shrink-0" />
                    <span className="truncate" title={item.representative}>CEO: {item.representative}</span>
                </div>
            )}
            </div>
        </div>

        <div className="bg-slate-50 px-5 pt-3 pb-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Legal Support</span>
                {item.support_legal === 'Yes' ? (
                    <div className="flex items-center text-green-600 text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" /> Ya
                    </div>
                ) : (
                    <div className="flex items-center text-slate-400 text-xs font-bold">
                        <XCircle className="w-3 h-3 mr-1" /> Tidak
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Optional Support</span>
                {item.support_optional === 'Yes' ? (
                    <div className="flex items-center text-blue-600 text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" /> Ya
                    </div>
                ) : (
                    <div className="flex items-center text-slate-400 text-xs font-bold">
                        <XCircle className="w-3 h-3 mr-1" /> Tidak
                    </div>
                )}
            </div>
        </div>

        <div className="bg-slate-50 px-5 pb-5 grid grid-cols-2 gap-3">
            {/* Tombol Buat Email */}
            <button 
                onClick={() => setIsEmailModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-[10px] text-sm transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 shadow-sm"
            >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Buat Email</span>
            </button>

            {/* Tombol Cari TSK (Super Prompt) */}
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

        {/* MODALS */}
        <EmailGeneratorModal 
            isOpen={isEmailModalOpen} 
            onClose={() => setIsEmailModalOpen(false)} 
            companyName={displayName} 
        />
        
        <TagsModal 
            isOpen={isTagsModalOpen}
            onClose={() => setIsTagsModalOpen(false)}
            tagsString={item.tags || ""}
            companyName={displayName}
        />
        </motion.div>
    </>
  );
};