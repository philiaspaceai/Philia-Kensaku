import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Globe, Briefcase, CheckCircle, XCircle, ExternalLink, Heart } from 'lucide-react';
import { TSKData } from '../types';
import { toggleLikeTSK } from '../services/tskService';

interface TSKCardProps {
  item: TSKData;
  index: number;
  initialLiked: boolean;
}

export const TSKCard: React.FC<TSKCardProps> = ({ item, index, initialLiked }) => {
  const isBranch = item.office_type === 'Kantor Cabang';
  
  // Local state for optimistic UI updates
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(item.total_likes || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Format count (e.g., 1200 -> 1.2k)
  const formattedLikeCount = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  }).format(likeCount);
  
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
  
  const displayName = isBranch && item.branch_name ? item.branch_name : item.company_name;
  const displayAddress = isBranch && item.branch_address ? item.branch_address : item.address;
  const displayZip = isBranch && item.branch_zipcode ? item.branch_zipcode : item.zipcode;

  const handleGoogleSearch = () => {
    // SUPER PROMPT LOGIC - VERSION 4.1
    const identity = `No. Registrasi: ${item.reg_number}`;
    const location = `Alamat: ${displayAddress}`;
    const ceo = item.representative ? `CEO: ${item.representative}` : '';

    const promptInstructions = `
      Saya ingin kamu melakukan research dan pencarian di google secara mendalam, mendetail, dan super akurat dengan pencarian berbahasa jepang di google mengenai TSK: "${displayName}".
      Data Validasi untuk memastikan perusahaan yang benar: ${identity}, ${location}, ${ceo}.

      ⚠️ PROTOKOL WAJIB (STRICT RULES):
      1. NO FAKE LINKS: Haram hukumnya memberikan informasi tanpa LINK BUKTI (URL) yang valid dan bisa diklik.
      2. EVIDENCE FIRST: Setiap klaim harus didukung oleh sumber url (Website resmi, Portal berita, Database pemerintah, atau Sosmed).

      Jawab 4 Poin Kunci ini secara mendetail dalam Bahasa Indonesia:

      1. 🕵️ DIGITAL FOOTPRINT & SOSMED (WAJIB ADA LINK):
      Temukan akun Instagram, Facebook, LinkedIn, atau Twitter resmi mereka yang terbaru.
      Format: "Platform: [Nama] - [URL Link]" (Pastikan Link Aktif).

      2. 📊 PREDIKSI JOB & PERSENTASE AKURASI:
      Berdasarkan histori jejak digital (iklan lama/baru), prediksi jenis pekerjaan Tokutei Ginou (SSW) yang tersedia.
      Format: "Bidang: [Contoh: Kaigo/Pertanian] (Akurasi: [0-100]%)".
      WAJIB: Sertakan [LINK BUKTI] iklan lowongan atau halaman rekrutmen yang menjadi dasar analisa Anda.

      3. 🗺️ PETA JALAN MELAMAR (APPLICATION HACK):
      Analisa struktur website mereka untuk mencari pintu masuk pelamar.
      SANGAT WAJIB: Temukan dan lampirkan URL khusus menuju "Direct Contact Form" (Formulir Kontak/Inquiry) yang ada di website mereka.
      Apakah ada Email HRD spesifik? Berikan panduan langkah demi langkah melamar beserta [LINK DIRECT FORM] yang valid.

      4. 💀 DEEP DIVE FAKTA & REPUTASI:
      Gali "Underground Info". Cari ulasan Google Maps, artikel berita lokal, atau daftar "Black Kigyou".
      Apakah perusahaan ini bersih? Atau ada skandal?
      Sertakan [LINK SUMBER] untuk setiap fakta yang Anda temukan.
    `.trim().replace(/\s+/g, ' '); 

    const url = `https://www.google.com/search?q=${encodeURIComponent(promptInstructions)}&udm=50`;
    window.open(url, '_blank');
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
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isBranch ? 'bg-orange-100 text-orange-700' : 'bg-primary-100 text-primary-700'}`}>
            {item.office_type}
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
        <div className="text-xs text-slate-400 font-mono mb-4">#{item.reg_number}</div>

        <div className="space-y-2 mt-4">
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
            <Globe className="w-4 h-4 mr-2 mt-0.5 text-primary-500 shrink-0" />
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

      <div className="bg-slate-50 px-5 pb-5">
        {/* Animated Gradient Outline Effect */}
        <div className="p-[2px] rounded-xl bg-gradient-to-r from-primary-600 via-sakura-500 to-primary-600 animate-gradient-xy group shadow-sm hover:shadow-md transition-shadow">
          <button 
            onClick={handleGoogleSearch}
            className="w-full h-full flex items-center justify-center gap-2 bg-white text-slate-800 font-bold py-3 rounded-[10px] text-sm transition-all duration-200 hover:bg-slate-50"
          >
            <span>Cari tahu TSK ini</span>
            <ExternalLink className="w-4 h-4 text-primary-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};