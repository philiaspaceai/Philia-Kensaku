import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { TSKData } from '../types';
import { analyzeCompanyTags } from '../services/geminiService';
import { updateTSKTags } from '../services/tskService';

interface HiddenProcessProps {
  item: TSKData | null;
  onClose: () => void;
  onComplete: () => void;
}

export const HiddenProcess: React.FC<HiddenProcessProps> = ({ item, onClose, onComplete }) => {
  const [statusText, setStatusText] = useState("Menghubungkan ke Google AI...");

  useEffect(() => {
    if (!item) return;

    let isMounted = true;

    const runProcess = async () => {
      try {
        // STEP 1: ANALYZE (Background)
        // Teks untuk User: Seolah-olah sedang menyiapkan agen pencarian
        setStatusText("Menyiapkan agen pencarian...");
        
        // Call Gemini Service (Proses Asli dibalik layar)
        const tags = await analyzeCompanyTags(item);
        
        if (!isMounted) return;

        // STEP 2: SAVE (Only if tags found)
        if (tags) {
            // Teks untuk User: Seolah-olah sedang mengoptimalkan keyword
            // Padahal aslinya: Menyimpan data tags ke database Supabase
            setStatusText("Mengoptimalkan kata kunci...");
            await updateTSKTags(item.id, tags);
        } else {
             setStatusText("Memverifikasi parameter...");
        }

        if (!isMounted) return;

        // STEP 3: DONE
        setStatusText("Mengarahkan anda...");
        
        // Wait a bit then complete
        setTimeout(() => {
            if (isMounted) onComplete();
        }, 800);

      } catch (error) {
        console.error("Process failed", error);
        // On error, just proceed to google search anyway
        if (isMounted) onComplete(); 
      }
    };

    runProcess();

    return () => { isMounted = false; };
  }, [item, onComplete]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
        
        <div className="mb-8 relative mt-4">
            {/* Pulsing Background */}
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse"></div>
            
            {/* Icon Animation: Searching Motion */}
            <motion.div 
                className="bg-white p-6 rounded-full shadow-lg relative z-10 border border-slate-100"
                animate={{ 
                    x: [0, 8, 0, -8, 0],
                    y: [0, -5, 5, -5, 0],
                    rotate: [0, 10, 0, -10, 0] 
                }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Search className="w-10 h-10 text-primary-600" />
            </motion.div>
        </div>

        <h3 className="text-xl font-extrabold text-slate-800 mb-2">Google Deep Search</h3>
        <p className="text-slate-500 text-sm font-medium animate-pulse">{statusText}</p>
        
        <div className="mt-8 flex gap-1.5">
            <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 rounded-full bg-primary-400" 
            />
            <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-primary-400" 
            />
            <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-primary-400" 
            />
        </div>

      </motion.div>
    </div>
  );
};