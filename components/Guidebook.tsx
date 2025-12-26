
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ShieldCheck, Mail, ArrowLeft, Menu, X, Lightbulb, AlertTriangle, CheckCircle, ExternalLink, MapPin, MousePointerClick, Target, Map, Bot, Users, Copy, Check, MessageSquare, Smartphone, FileText, Clock } from 'lucide-react';

interface GuidebookProps {
  onBack: () => void;
}

const CopyablePrompt = ({ text, label }: { text: string, label: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg ring-1 ring-black/5 group">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-3 h-3" /> {label}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors focus:outline-none"
          title="Salin Prompt"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>
      <div className="p-4 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-all bg-slate-900/50">
        {text}
      </div>
    </div>
  );
};

export const Guidebook: React.FC<GuidebookProps> = ({ onBack }) => {
  const [activeChapter, setActiveChapter] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chapters = [
    { id: 'intro', title: 'Kenalan Dulu', icon: BookOpen },
    { id: 'strategy', title: 'Strategi Mencari', icon: Search },
    { id: 'validation', title: 'Detektif TSK', icon: ShieldCheck },
    { id: 'apply', title: 'Cara Melamar', icon: Mail },
    { id: 'tips', title: 'Tips & Trik', icon: Lightbulb },
  ];

  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (const chapter of chapters) {
        const element = document.getElementById(chapter.id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveChapter(chapter.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-sakura-500">
              Philia Guidebook
            </h1>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1">
             <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                Kembali ke Pencarian
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex items-start pt-8 pb-20 px-4 gap-12">
        {/* Sidebar Navigation (Desktop) */}
        <div className="hidden md:block w-64 sticky top-24 shrink-0">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Daftar Isi</h3>
                <nav className="space-y-1">
                    {chapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => scrollToChapter(chapter.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all ${
                                activeChapter === chapter.id 
                                ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' 
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                            }`}
                        >
                            <chapter.icon className={`w-4 h-4 ${activeChapter === chapter.id ? 'text-primary-500' : 'text-slate-400'}`} />
                            {chapter.title}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl text-white shadow-lg shadow-primary-200">
                <p className="text-sm font-medium mb-3 opacity-90">Sudah siap mencari kerja?</p>
                <button 
                    onClick={onBack}
                    className="w-full bg-white text-primary-700 font-bold py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Mulai Cari TSK
                </button>
            </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-xl z-40 p-4"
            >
                <nav className="space-y-2">
                    {chapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => scrollToChapter(chapter.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${
                                activeChapter === chapter.id 
                                ? 'bg-primary-50 text-primary-700' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <chapter.icon className="w-5 h-5" />
                            {chapter.title}
                        </button>
                    ))}
                    <hr className="border-slate-100 my-2"/>
                    <button 
                        onClick={onBack}
                        className="w-full text-center bg-slate-900 text-white font-bold py-3 rounded-xl"
                    >
                        Kembali ke Pencarian
                    </button>
                </nav>
            </motion.div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-16 md:space-y-24">
            
            {/* BAB 1: INTRO */}
            <section id="intro" className="scroll-mt-24">
                <div className="mb-6">
                    <span className="text-primary-600 font-bold tracking-wide uppercase text-sm">Bab 1</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">Kenalan Dulu</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Sebelum terjun mencari kerja, pahami dulu siapa partner Anda. Jangan sampai tersesat di tengah jalan!
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-100 p-3 rounded-xl shrink-0">
                                <Lightbulb className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-indigo-900 mb-2">Apa itu TSK?</h3>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    TSK (Touroku Shien Kikan) atau <strong>Registered Support Organization</strong> adalah lembaga resmi yang ditunjuk pemerintah Jepang untuk membantu pekerja asing (Tokutei Ginou) dalam urusan kehidupan dan pekerjaan.
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    Bayangkan mereka sebagai <strong>"Sponsor"</strong> atau <strong>"Kakak Asuh"</strong> Anda selama di Jepang. Mereka wajib membantu Anda mencari apartemen, membuka rekening bank, hingga menemani ke rumah sakit.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Kenapa App Ini Ada?
                        </h3>
                        <p className="text-slate-600">
                            Banyak teman-teman Indonesia terjebak oleh "broker ilegal" atau LPK nakal yang meminta uang puluhan juta. 
                            Aplikasi ini hadir untuk memberikan data <strong>TSK Resmi</strong> yang terdaftar di Kementerian Kehakiman Jepang, sehingga Anda bisa menghindari penipuan.
                        </p>
                    </div>
                </div>
            </section>

            {/* BAB 2: STRATEGI MENCARI */}
            <section id="strategy" className="scroll-mt-24">
                <div className="mb-6">
                    <span className="text-sakura-500 font-bold tracking-wide uppercase text-sm">Bab 2</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">Strategi Mencari</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Mencari TSK itu ada seninya. Gunakan fitur pencarian kami secara maksimal dengan strategi berikut.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Tipe Pemula */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <MousePointerClick className="w-6 h-6 text-primary-500" />
                            Tipe Pemula (Pencarian Cepat)
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Cukup ketik kata kunci sederhana di kolom pencarian utama.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">Contoh 1</span>
                                <p className="font-mono text-slate-700">"Tokyo"</p>
                                <p className="text-xs text-slate-500 mt-1">Mencari semua TSK yang berkantor di Tokyo.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">Contoh 2</span>
                                <p className="font-mono text-slate-700">"Food"</p>
                                <p className="text-xs text-slate-500 mt-1">Mencari TSK dengan nama yang mengandung unsur makanan.</p>
                            </div>
                        </div>
                    </div>

                    {/* Tipe Spesialis */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-indigo-500" />
                            Tipe Spesialis (Advanced Filter)
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">1</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Filter Lokasi (Prefektur)</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Pilih lokasi strategis. <strong>Tips:</strong> Gaji di Tokyo tinggi, tapi biaya hidup mahal. Coba cari di daerah penyangga seperti <em>Saitama, Chiba, atau Aichi</em> untuk keseimbangan tabungan yang lebih baik.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">2</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Filter Bahasa</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Penting untuk pemula! Centang opsi <strong>"Indonesian"</strong> untuk menemukan TSK yang memiliki staf berbahasa Indonesia. Komunikasi lancar = hidup tenang.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">3</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Filter Dukungan (Legal vs Opsional)</h4>
                                    <p className="text-sm text-slate-600 mt-1">
                                        <span className="text-green-600 font-bold">Dukungan Legal (Wajib)</span> adalah hak dasar Anda. 
                                        <span className="text-blue-600 font-bold ml-1">Dukungan Opsional</span> adalah bonus layanan tambahan (seperti jemputan bandara gratis, wifi gratis, dll).
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* BAB 3: DETEKTIF TSK */}
            <section id="validation" className="scroll-mt-24">
                <div className="mb-6">
                    <span className="text-primary-600 font-bold tracking-wide uppercase text-sm">Bab 3</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">Detektif TSK</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Jangan asal percaya! Gunakan fitur rahasia kami untuk membongkar kredibilitas perusahaan.
                    </p>
                </div>

                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <ExternalLink className="w-6 h-6 text-primary-400" />
                            Fitur: "Cari Tahu"
                        </h3>
                        <p className="text-slate-300 mb-8 text-lg">
                            Di setiap kartu perusahaan, ada tombol pelangi bertuliskan <strong>"Cari Tahu"</strong>. 
                            Ini bukan tombol Google biasa. Ini adalah <strong>"Super Prompt"</strong> AI yang kami rancang untuk menggali data mendalam.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <h4 className="font-bold text-primary-300 mb-2">🕵️ Apa yang akan ditemukan?</h4>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary-400" />
                                        <span><strong>Jejak Digital:</strong> Akun sosmed resmi (IG/FB/LinkedIn) mereka.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary-400" />
                                        <span><strong>Prediksi Job:</strong> Apakah mereka sering posting lowongan Kaigo? Atau Pertanian?</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary-400" />
                                        <span><strong>Reputasi:</strong> Apakah ada review buruk atau tanda-tanda "Black Company"?</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30">
                                <h4 className="font-bold text-red-300 mb-2">⚠️ Red Flags (Hati-hati Jika...)</h4>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <X className="w-4 h-4 mt-0.5 text-red-400" />
                                        <span>Website tidak bisa dibuka atau terlihat sangat kuno/tidak profesional.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <X className="w-4 h-4 mt-0.5 text-red-400" />
                                        <span>Alamat kantor di Google Maps ternyata apartemen biasa (bukan gedung kantor).</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BAB 4: CARA MELAMAR */}
            <section id="apply" className="scroll-mt-24">
                <div className="mb-6">
                    <span className="text-sakura-500 font-bold tracking-wide uppercase text-sm">Bab 4</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">Cara Melamar</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Sudah ketemu TSK yang cocok? Saatnya beraksi. Jangan kirim pesan "P info loker". Itu tidak profesional!
                    </p>
                </div>

                <div className="grid gap-8">
                    <div className="flex gap-4 sm:gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-sakura-100 flex items-center justify-center text-sakura-600 font-bold text-xl shrink-0">1</div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Gunakan Generator Email</h3>
                            <p className="text-slate-600 mb-4">
                                Kami menyediakan fitur <strong>"Buat Email"</strong> di setiap kartu TSK. Isi form sederhana, dan kami akan membuatkan surat lamaran (Cover Letter) dalam Bahasa Jepang yang sopan dan profesional.
                            </p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm italic text-slate-500">
                                "Hajimemashite. Indonesia kokuseki no Budi to moshimasu..." <br/>
                                (Otomatis dibuatkan sesuai standar bisnis Jepang!)
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 sm:gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-sakura-100 flex items-center justify-center text-sakura-600 font-bold text-xl shrink-0">2</div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Kirim Kemana?</h3>
                            <p className="text-slate-600 mb-2">
                                Gunakan hasil dari fitur "Cari Tahu" (Bab 3) untuk menemukan:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1 ml-1">
                                <li>Alamat Email HRD di website mereka.</li>
                                <li>Formulir "Contact Us" / "Inquiry" di website.</li>
                                <li>DM Instagram/Facebook resmi mereka (Gunakan bahasa sopan!).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* BAB 5: TIPS & TRIK */}
            <section id="tips" className="scroll-mt-24">
                <div className="mb-8">
                    <span className="text-primary-600 font-bold tracking-wide uppercase text-sm">Bab 5</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">Tips & Trik</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Ini adalah taktik khusus untuk mencari TSK agar emailmu lebih cepat dibalas dan lebih cepat diproses hingga memasuki tahap mendan dan mensetsu. Gunakan AI eksternal (ChatGPT/Gemini) dan teknik "Stalking" untuk memenangkan persaingan.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Strategy 1: Pilih Perusahaan TSK Berskala Kecil */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                <Bot className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">1. Pilih Perusahaan TSK Berskala Kecil</h3>
                                <p className="text-slate-600 mt-2">
                                    Philia Kensaku ini memberikan datanya, tapi Anda butuh AI untuk menganalisanya. TSK raksasa persaingannya ribuan orang. TSK kecil/menengah seringkali kekurangan pelamar dan prosesnya lebih cepat.
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4">
                            <p className="text-sm text-indigo-800 font-medium">
                                <strong>Caranya:</strong> Salin prompt di bawah ini, lalu paste ke ChatGPT atau Gemini di HP Anda. Ganti bagian dalam kurung siku &lt;...&gt; dengan data dari aplikasi ini.
                            </p>
                        </div>

                        <CopyablePrompt 
                            label="Super Prompt: Analisis Korporasi"
                            text={`Bertindaklah sebagai Analis Bisnis Korporasi Jepang. Saya sedang meriset perusahaan TSK (Registered Support Organization) berikut:
Nama: <nama tsk>
No. Registrasi: <no.reg>
CEO: <nama ceo>
Alamat: <alamat tsk>

Tolong lakukan Deep Research dan jawab 4 poin ini secara mendetail:
1. **Skala & Kesehatan Bisnis**: Cari data "Shihonkin" (Modal) dan jumlah karyawan. Apakah ini perusahaan cangkang (paper company), UKM, atau korporasi besar?
2. **Jejak Digital**: Cari website resmi dan aktivitas rekrutmen mereka di situs kerja Jepang (Hello Work, Indeed Japan). Apakah mereka aktif merekrut Tokutei Ginou belakangan ini?
3. **Reputasi (Black/White)**: Cek ulasan di Google Maps dan situs "Black Kigyou" database. Apakah ada riwayat buruk?
4. **Validitas**: Apakah alamat mereka adalah gedung kantor proper atau hanya apartemen hunian biasa? (Cek via Street View).

Sertakan URL sumber untuk setiap temuan. Lalu simpulkan apakah perusahaan TSK itu termasuk dalam kategori perusahaan besar atau kecil.`}
                        />
                    </div>

                    {/* Strategy 2: Pilih Prefektur yang Krisis Tenaga Kerja */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                                <Map className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">2. Pilih Prefektur yang Krisis Tenaga Kerja</h3>
                                <p className="text-slate-600 mt-2">
                                    Jangan asal pilih "Tokyo" atau "Osaka". Gunakan AI untuk menemukan daerah yang <em>putus asa</em> membutuhkan tenaga kerja di bidang Anda. Di situlah peluang lolos tertinggi.
                                </p>
                            </div>
                        </div>

                        <CopyablePrompt 
                            label="Super Prompt: Peta Strategi"
                            text={`Bertindaklah sebagai Konsultan Strategi Karir Jepang. Saya ingin bekerja di Jepang sebagai [Tokutei Ginou - Bidang: <Isi Bidang, misal: Kaigo/Pertanian>].

Saya ingin menghindari persaingan ketat di Tokyo/Osaka. Tolong buatkan "Peta Krisis Tenaga Kerja" dengan kriteria berikut:
1. **Top 5 Prefektur "Desperate"**: Cari 5 daerah di Jepang yang memiliki rasio "Yuko Kyujin Bairitsu" (Job-to-Applicant Ratio) TERTINGGI untuk bidang ini. Urutkan dari yang paling butuh orang.
2. **Analisa "Cuan" (Savings Potential)**: Untuk 5 daerah tersebut, bandingkan UMR (Minimum Wage) vs Rata-rata Biaya Sewa Apartemen (1R/1K). Mana yang sisa tabungannya paling besar?
3. **Demografi**: Berapa persentase pekerja asing di sana? Saya mencari daerah yang sudah terbiasa dengan orang asing tapi masih kekurangan orang.

Berikan data statistik terbaru.`}
                        />
                    </div>

                    {/* Strategy 3: Investigasi Mendalam */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">3. Investigasi Mendalam</h3>
                                <p className="text-slate-600 mt-2">
                                    Ini adalah taktik khusus untuk mencari TSK agar emailmu lebih cepat dibalas dan lebih cepat diproses hingga memasuki tahap mendan dan mensetsu. Gunakan AI eksternal (ChatGPT/Gemini) dan teknik "Stalking" untuk memenangkan persaingan.
                                </p>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mt-6">
                            <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" /> Mencari "Celah Akses" (Informasi Kontak yang Luput dari AI)
                            </h4>
                            <div className="space-y-6 text-slate-700 leading-relaxed">
                                <p>
                                    AI hebat dalam mengolah data teks, tapi Anda butuh <strong>effort manual</strong> untuk menemukan pintu masuk rahasia yang tidak terindeks dengan benar oleh mesin pencari:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                                        <div className="bg-emerald-100 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                                            <MousePointerClick className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-sm mb-2">Jalur "Inquiry" Spesifik</h5>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Stalking website TSK sampai ketemu halaman <strong>"Contact Us"</strong> atau <strong>"採用 (Rekrutmen)"</strong>. Seringkali formulir di website direspon lebih cepat daripada email umum karena masuk langsung ke dashboard HR mereka.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                                        <div className="bg-emerald-100 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-sm mb-2">Sosial Media DM</h5>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Cari akun Facebook/Instagram resmi perusahaan. Klik tombol kirim pesan (DM). Jika mereka aktif memposting foto kegiatan, kemungkinan besar admin sosmed-nya adalah staf HR yang bisa memberikan informasi rekrutmen secara instan.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                                        <div className="bg-emerald-100 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                                            <Smartphone className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-sm mb-2">Kontak Visual (Google Maps)</h5>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Buka foto Google Maps kantor mereka. Zoom ke arah <strong>Papan Nama</strong> atau <strong>Banner</strong> di depan gedung. Kadang ada QR Code LINE atau nomor WhatsApp yang hanya dipajang secara fisik dan tidak tercantum di website.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="bg-white/50 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <p className="text-xs font-medium text-emerald-800">
                                        <strong>Tips:</strong> Menghubungi lewat jalur-jalur "sepi" ini akan membuat Anda tidak perlu mengantre dengan ratusan pelamar lainnya di inbox email utama.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strategy 4: Reverse Engineering & Rahasia CoE */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">4. "Reverse Engineering" & Rahasia CoE</h3>
                                <p className="text-slate-600 mt-2">
                                    Jangan hanya menunggu lowongan dari TSK. Cari tahu siapa <strong>Employer (Pemberi Kerja)</strong> sebenarnya. Seringkali, perusahaan besar (seperti pabrik atau panti lansia) bekerja sama dengan TSK tertentu untuk mencari orang.
                                </p>
                            </div>
                        </div>

                        <div className="bg-violet-50 border border-violet-100 p-6 rounded-2xl">
                             <h4 className="font-bold text-violet-900 mb-3">💡 Rahasia Certificate of Eligibility (CoE)</h4>
                             <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                <strong>Fun Fact:</strong> Anda bisa mendapatkan data kontak emas dari CoE milik rekan yang sudah berangkat. Di dokumen CoE, pada kolom <strong>"Place of Employment"</strong> atau <strong>"Organization"</strong>, tertera nama perusahaan asli tempat mereka bekerja.
                             </p>
                             <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                                    <span>Catat nama perusahaan dan alamat dari CoE tersebut.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                                    <span>Gunakan Philia Kensaku untuk mencari TSK penanggung jawabnya.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                                    <span>Hubungi perusahaan tersebut secara langsung untuk menanyakan apakah mereka sedang membuka kuota baru lewat TSK mereka. Jalur ini 100% valid karena perusahaan tersebut sudah terbukti mempekerjakan orang Indonesia!</span>
                                </li>
                             </ul>
                        </div>
                    </div>

                    {/* Strategy 5: The Golden Hour (Optimasi Waktu) */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">5. "The Golden Hour" (Optimasi Waktu)</h3>
                                <p className="text-slate-600 mt-2">
                                    Lamaran yang hebat tidak akan berguna jika terkubur di bawah ratusan email spam. Kirimkan email lamaran Anda di saat yang paling tepat bagi HR Jepang.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                                <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                                    ⏰ Waktu Emas (JST)
                                </h4>
                                <p className="text-xs text-slate-700 leading-relaxed">
                                    <strong>Hari:</strong> Selasa atau Rabu.<br/>
                                    <strong>Jam:</strong> 09:30 – 10:30 (Waktu Jepang).<br/>
                                    <strong>Kenapa?</strong> Di jam ini HR baru saja selesai kopi pagi dan mulai membuka inbox. Lamaran Anda akan muncul di baris paling atas!
                                </p>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-bold text-white text-sm mb-2">🚀 Pro Tip: Schedule Send</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Gunakan fitur <strong>"Schedule Send"</strong> (Kirim terjadwal) di Gmail. Siapkan email di malam hari, lalu atur agar terkirim otomatis di jam emas Jepang keesokan paginya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             <div className="pt-12 pb-8 text-center">
                 <p className="text-slate-400 text-sm mb-4">Sudah paham semuanya?</p>
                 <button 
                    onClick={onBack}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                 >
                    <Search className="w-4 h-4" />
                    Mulai Cari TSK Sekarang
                 </button>
             </div>

        </div>
      </div>
    </div>
  );
};
