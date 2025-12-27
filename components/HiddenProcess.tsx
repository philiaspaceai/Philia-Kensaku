import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Search, Database, ShieldCheck } from 'lucide-react';
import { TSKData } from '../types';
import { analyzeCompanyTags } from '../services/geminiService';
import { updateTSKTags } from '../services/tskService';

interface HiddenProcessProps {
  item: TSKData | null;
  onClose: () => void;
  onComplete: () => void; // Triggered after saving to open Google
}

export const HiddenProcess: React.FC<HiddenProcessProps> = ({ item, onClose, onComplete }) => {
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0: Analyze, 1: Save, 2: Done
  const [statusText, setStatusText] = useState("Menghubungi Agen AI...");

  useEffect(() => {
    if (!item) return;

    let isMounted = true;

    const runProcess = async () => {
      try {
        // STEP 1: ANALYZE
        setStep(0);
        setStatusText(`Deep Research: ${item.company_name}...`);
        
        // Call Gemini Service
        const tags = await analyzeCompanyTags(item);
        
        if (!isMounted) return;

        // STEP 2: SAVE (Only if tags found)
        if (tags) {
            setStep(1);
            setStatusText("Menyimpan Analisis Sektor...");
            await updateTSKTags(item.id, tags);
        } else {
            setStatusText("Data spesifik tidak terdeteksi, melanjutkan...");
        }

        if (!isMounted) return;

        // STEP 3: DONE
        setStep(2);
        setStatusText("Selesai! Membuka Google...");
        
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <motion.div 
                className="h-full bg-gradient-to-r from-primary-500 via-indigo-500 to-sakura-500 animate-gradient-xy"
                initial={{ width: "0%" }}
                animate={{ width: step === 0 ? "40%" : step === 1 ? "80%" : "100%" }}
                transition={{ duration: 0.5 }}
            />
        </div>

        <div className="mb-6 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse"></div>
                <div className="bg-white p-4 rounded-full shadow-lg relative z-10">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />
                            </motion.div>
                        )}
                        {step === 1 && (
                            <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Database className="w-8 h-8 text-sakura-500 animate-bounce" />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <ShieldCheck className="w-8 h-8 text-green-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">Philia AI Intelligence</h3>
        <p className="text-slate-500 text-sm mb-6 font-medium">{statusText}</p>

        <div className="space-y-2">
            <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${step >= 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <Search className="w-5 h-5" />
                <span className="text-sm font-semibold">Gemini 2.5/3.0 Deep Scan</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${step >= 1 ? 'bg-sakura-50 border-sakura-100 text-sakura-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <Database className="w-5 h-5" />
                <span className="text-sm font-semibold">Validasi & Parsing Sektor</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};