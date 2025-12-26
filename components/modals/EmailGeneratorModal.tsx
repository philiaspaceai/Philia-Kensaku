
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Check, AlertCircle, FileText, Send, Briefcase, GraduationCap, Globe, User, MapPin, Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import { SSW_FIELDS, JAPANESE_LEVELS, SSW_SPECIFIC_JOBS } from '../../constants';

interface EmailGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export const EmailGeneratorModal: React.FC<EmailGeneratorModalProps> = ({ isOpen, onClose, companyName }) => {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [copied, setCopied] = useState(false);

  // Form State - CLEAN DATA (No Personal Info)
  const [formData, setFormData] = useState({
    country: 'インドネシア',
    nicknameKana: '',
    sswFieldId: '',
    experience: 'no', // 'yes' | 'no'
    jlptId: '',
    jlptDate: '', // YYYY-MM
    sswCertId: '',
    sswCertDate: '', // YYYY-MM
    desiredJob: '', // This will hold the Japanese Value from Constant OR 'OTHER'
    manualJobInput: '', // Only used if desiredJob === 'OTHER'
    fullNameKana: '',
    fullName: '',
    address: 'インドネシア',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset desired job when SSW Field changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, desiredJob: '', manualJobInput: '' }));
  }, [formData.sswFieldId]);

  // Clean Company Name Logic
  const cleanCompanyName = (name: string) => {
    return name.replace(/(\s+(Company\s+Limited|Co\.,\s*Ltd\.?|Ltd\.?|Inc\.?|K\.K\.?|Corp\.?|Corporation))\s*$/i, '');
  };

  // Validation Logic
  const validate = () => {
    const newErrors: Record<string, string> = {};
    const katakanaRegex = /^[\u30A0-\u30FF\u30FC\s]+$/; 

    if (!formData.nicknameKana || !katakanaRegex.test(formData.nicknameKana)) {
      newErrors.nicknameKana = 'Wajib Katakana (Contoh: ヤマダ)';
    }
    if (!formData.fullNameKana || !katakanaRegex.test(formData.fullNameKana)) {
      newErrors.fullNameKana = 'Wajib Katakana';
    }
    if (!formData.sswFieldId) newErrors.sswFieldId = 'Pilih bidang SSW';
    if (!formData.jlptId) newErrors.jlptId = 'Pilih sertifikat bahasa';
    if (!formData.sswCertId) newErrors.sswCertId = 'Pilih sertifikat SSW';
    
    // Validate Job
    if (!formData.desiredJob) {
        newErrors.desiredJob = 'Pilih pekerjaan yang diinginkan';
    } else if (formData.desiredJob === 'OTHER' && !formData.manualJobInput) {
        newErrors.manualJobInput = 'Isi nama pekerjaan (Wajib Kanji/Jepang)';
    }

    if (!formData.email) newErrors.email = 'Email wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validate()) {
      setStep('preview');
    }
  };

  const formatDateJP = (dateStr: string) => {
    if (!dateStr) return '----年--月';
    const [year, month] = dateStr.split('-');
    return `${year}年${month}月`;
  };

  const generateTemplate = () => {
    const sswField = SSW_FIELDS.find(f => f.id === formData.sswFieldId);
    const sswCert = SSW_FIELDS.find(f => f.id === formData.sswCertId);
    const jlpt = JAPANESE_LEVELS.find(l => l.id === formData.jlptId);
    
    const experienceText = formData.experience === 'yes' ? '経験者' : '未経験';
    const cleanedCompany = cleanCompanyName(companyName);

    // Determine Final Job Title
    const finalJobTitle = formData.desiredJob === 'OTHER' ? formData.manualJobInput : formData.desiredJob;

    return `株式会社${cleanedCompany}
採用ご担当者様

はじめまして。
${formData.country}国籍の${formData.nicknameKana}と申します。

特定技能「${sswField?.jp_field || ''}」で就職先を探しております。${experienceText}でも応募可能な求人をご紹介いただくことは可能でしょうか。

日本語力：${jlpt?.jp || ''}（${formatDateJP(formData.jlptDate)} 合格）
資格：${sswCert?.jp_exam || ''}（${formatDateJP(formData.sswCertDate)} 合格）
希望職種：${finalJobTitle}

体を動かす仕事や、
シフト勤務は問題ありません。
日本で長く働きたいと考えています。

入社時期や在留資格の手続きについては、
会社の方針に従います。

履歴書（CV）を添付いたします。ご確認のほどよろしくお願いいたします。

氏名：${formData.fullNameKana}
(${formData.fullName}）
住所：${formData.address}
メール：${formData.email}
電話：${formData.phone}（WhatsApp可）`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTemplate());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStep('form');
    setCopied(false);
  };

  // Reusable Input Styles
  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl border transition-all outline-none font-medium text-slate-700
    ${hasError 
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
      : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'
    }
  `;

  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";

  // Get specific jobs based on selected SSW Field
  const availableJobs = formData.sswFieldId ? SSW_SPECIFIC_JOBS[formData.sswFieldId] || [] : [];

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden relative z-10 max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  Generator Email Lamaran
                </h3>
                <p className="text-sm text-slate-500">Buat email profesional bahasa Jepang secara otomatis.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
              {step === 'form' ? (
                <div className="p-6 space-y-8">
                  
                  {/* Section 1: Perkenalan */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-indigo-100 p-1.5 rounded-lg">
                            <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">1. Perkenalan Diri</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Negara Asal</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              value={formData.country} 
                              onChange={e => setFormData({...formData, country: e.target.value})}
                              className={`${inputClass(false)} pl-11`}
                            />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>
                            Nama Panggilan <span className="text-red-500 ml-1 normal-case">(Wajib Katakana)</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Contoh: ヤマダ"
                          value={formData.nicknameKana} 
                          onChange={e => setFormData({...formData, nicknameKana: e.target.value})}
                          className={inputClass(!!errors.nicknameKana)}
                        />
                        {errors.nicknameKana && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nicknameKana}</p>}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Section 2: Kualifikasi */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-emerald-100 p-1.5 rounded-lg">
                            <Briefcase className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">2. Kualifikasi & Pengalaman</h4>
                    </div>
                    
                    {/* Bidang SSW & Pengalaman */}
                    <div className="grid grid-cols-1 gap-5">
                         <div>
                            <label className={labelClass}>Bidang SSW Tujuan</label>
                            <select 
                                value={formData.sswFieldId}
                                onChange={e => setFormData({...formData, sswFieldId: e.target.value})}
                                className={inputClass(!!errors.sswFieldId)}
                            >
                                <option value="">-- Pilih Bidang SSW --</option>
                                {SSW_FIELDS.map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                                ))}
                            </select>
                            {errors.sswFieldId && <p className="text-red-500 text-xs mt-1 ml-1">{errors.sswFieldId}</p>}
                        </div>

                        {/* Experience Selection Cards */}
                        <div>
                             <label className={labelClass}>Pengalaman Kerja di Bidang Ini</label>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                {/* Option: Berpengalaman */}
                                <div 
                                    onClick={() => setFormData({...formData, experience: 'yes'})}
                                    className={`
                                        cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                                        ${formData.experience === 'yes' 
                                            ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <div className={`p-3 rounded-full ${formData.experience === 'yes' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className={`block font-bold ${formData.experience === 'yes' ? 'text-indigo-900' : 'text-slate-600'}`}>Berpengalaman</span>
                                        <span className="text-xs text-slate-500">Pernah kerja/magang</span>
                                    </div>
                                    {formData.experience === 'yes' && <div className="absolute top-3 right-3 text-indigo-500"><Check className="w-4 h-4" /></div>}
                                </div>

                                {/* Option: Pemula */}
                                <div 
                                    onClick={() => setFormData({...formData, experience: 'no'})}
                                    className={`
                                        cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                                        ${formData.experience === 'no' 
                                            ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <div className={`p-3 rounded-full ${formData.experience === 'no' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className={`block font-bold ${formData.experience === 'no' ? 'text-indigo-900' : 'text-slate-600'}`}>Pemula (Non-Ex)</span>
                                        <span className="text-xs text-slate-500">Belum ada pengalaman</span>
                                    </div>
                                    {formData.experience === 'no' && <div className="absolute top-3 right-3 text-indigo-500"><Check className="w-4 h-4" /></div>}
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Sertifikat & Tanggal */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                         {/* JLPT */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Sertifikat Bahasa (JLPT/JFT)</label>
                                <select 
                                    value={formData.jlptId}
                                    onChange={e => setFormData({...formData, jlptId: e.target.value})}
                                    className={inputClass(!!errors.jlptId)}
                                >
                                    <option value="">-- Pilih Sertifikat --</option>
                                    {JAPANESE_LEVELS.map(l => (
                                    <option key={l.id} value={l.id}>{l.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Bulan Lulus</label>
                                <input 
                                    type="month" 
                                    value={formData.jlptDate}
                                    onChange={e => setFormData({...formData, jlptDate: e.target.value})}
                                    className={inputClass(false)}
                                />
                            </div>
                         </div>

                         {/* SSW Cert */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Sertifikat Skill (SSW/Prometric)</label>
                                <select 
                                    value={formData.sswCertId}
                                    onChange={e => setFormData({...formData, sswCertId: e.target.value})}
                                    className={inputClass(!!errors.sswCertId)}
                                >
                                    <option value="">-- Pilih Ujian Lulus --</option>
                                    {SSW_FIELDS.map(f => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Bulan Lulus</label>
                                <input 
                                    type="month" 
                                    value={formData.sswCertDate}
                                    onChange={e => setFormData({...formData, sswCertDate: e.target.value})}
                                    className={inputClass(false)}
                                />
                            </div>
                         </div>
                    </div>

                    {/* Desired Job (Dynamic) */}
                    <div>
                        <label className={labelClass}>Pekerjaan Spesifik yang Diinginkan</label>
                        
                        {formData.sswFieldId ? (
                             <select 
                                value={formData.desiredJob}
                                onChange={e => setFormData({...formData, desiredJob: e.target.value})}
                                className={inputClass(!!errors.desiredJob)}
                            >
                                <option value="">-- Pilih Pekerjaan --</option>
                                {availableJobs.map((job, idx) => (
                                    <option key={idx} value={job.value}>{job.label}</option>
                                ))}
                                <option value="OTHER">Lainnya (Isi Manual)</option>
                            </select>
                        ) : (
                            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 text-sm">
                                Pilih Bidang SSW terlebih dahulu untuk melihat opsi pekerjaan.
                            </div>
                        )}
                        {errors.desiredJob && <p className="text-red-500 text-xs mt-1 ml-1">{errors.desiredJob}</p>}

                        {/* Manual Input for OTHER */}
                        <AnimatePresence>
                            {formData.desiredJob === 'OTHER' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3"
                                >
                                    <div className="flex items-center gap-2 mb-1.5 ml-1 text-orange-600">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wide">Wajib Diisi dalam Kanji / Bahasa Jepang</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: 溶接工 (Welder) / 介護助手"
                                        value={formData.manualJobInput}
                                        onChange={e => setFormData({...formData, manualJobInput: e.target.value})}
                                        className={inputClass(!!errors.manualJobInput)}
                                    />
                                    {errors.manualJobInput && <p className="text-red-500 text-xs mt-1 ml-1">{errors.manualJobInput}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Section 3: Kontak */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-orange-100 p-1.5 rounded-lg">
                            <MessageCircle className="w-4 h-4 text-orange-600" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">3. Data Kontak (Tanda Tangan)</h4>
                    </div>

                    <div className="bg-slate-100 p-5 rounded-2xl space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Nama Lengkap <span className="text-red-500 normal-case">(Katakana)</span></label>
                                <input 
                                    type="text" 
                                    placeholder="ヤマダ・タロウ"
                                    value={formData.fullNameKana} 
                                    onChange={e => setFormData({...formData, fullNameKana: e.target.value})}
                                    className={inputClass(!!errors.fullNameKana)}
                                />
                                {errors.fullNameKana && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullNameKana}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Nama Lengkap (Alphabet)</label>
                                <input 
                                    type="text" 
                                    placeholder="Yamada Taro"
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className={inputClass(false)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Alamat (Negara)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        value={formData.address} 
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className={`${inputClass(false)} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="email" 
                                        placeholder="nama@email.com"
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className={`${inputClass(!!errors.email)} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                             <label className={labelClass}>Nomor HP / WhatsApp</label>
                             <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="tel" 
                                    placeholder="+62 812..."
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className={`${inputClass(false)} pl-11`}
                                />
                             </div>
                        </div>
                    </div>
                  </div>

                </div>
              ) : (
                // PREVIEW SECTION - UPDATED TO LIGHT THEME
                <div className="p-6 space-y-4 h-full flex flex-col">
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start shrink-0">
                      <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">Preview Email</p>
                        <p>Silakan copy template di bawah ini, lalu kirimkan melalui Gmail atau aplikasi email Anda. Jangan lupa lampirkan CV!</p>
                      </div>
                   </div>

                   {/* BIG TEXTBOX: h-[60vh] and min-h-[500px] ensures it dominates the screen */}
                   <div className="relative h-[60vh] min-h-[500px]">
                      <textarea 
                        readOnly
                        value={generateTemplate()}
                        className="w-full h-full p-6 font-mono text-sm bg-white text-slate-700 border border-slate-200 rounded-xl focus:outline-none resize-none leading-relaxed shadow-sm ring-1 ring-transparent focus:ring-indigo-100 transition-all custom-scrollbar"
                      />
                      <button 
                        onClick={handleCopy}
                        className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors border border-slate-200"
                        title="Copy to Clipboard"
                      >
                         {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between shrink-0 z-20">
               {step === 'preview' ? (
                 <button 
                   onClick={handleReset}
                   className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                 >
                   Kembali Edit
                 </button>
               ) : (
                 <button 
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                 >
                    Batal
                 </button>
               )}

               {step === 'form' ? (
                 <button 
                    onClick={handleGenerate}
                    className="px-8 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm flex items-center gap-2"
                 >
                    <FileText className="w-4 h-4" />
                    Generate Template
                 </button>
               ) : (
                 <div className="flex gap-2">
                    {/* REMOVED GMAIL BUTTON */}
                    <button 
                        onClick={handleCopy}
                        className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2 ${copied ? 'bg-green-600 shadow-green-200' : 'bg-slate-800 shadow-slate-300 hover:bg-slate-900'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Tersalin!' : 'Copy Template'}
                    </button>
                 </div>
               )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
