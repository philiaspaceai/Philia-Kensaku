
import React, { useEffect, useState, useMemo } from 'react';
import { ID_TO_PREF_MAP, PREF_TO_ID_MAP, PREF_REGION_MAP, REGION_COLORS } from '../../constants';

interface JapanMapProps {
  selectedPrefectures: string[];
  onToggle: (pref: string) => void;
}

export const JapanMap: React.FC<JapanMapProps> = ({ selectedPrefectures, onToggle }) => {
  const [cleanSvgHtml, setCleanSvgHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // URL SVG BARU
  const SVG_URL = "https://xxnsvylzzkgcnubaegyv.supabase.co/storage/v1/object/public/1/japan.svg";

  // 1. FETCH & CLEAN SVG
  useEffect(() => {
    const fetchAndCleanSvg = async () => {
      try {
        const response = await fetch(SVG_URL);
        if (!response.ok) throw new Error("Gagal load SVG");
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svgElement = doc.querySelector('svg');

        if (!svgElement) throw new Error("Format SVG tidak valid");

        // RESET UKURAN: 
        // Timpa ukuran mm bawaan Inkscape dengan 100% agar responsif mengikuti container
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.style.display = 'block';
        
        // PRESERVE ASPECT RATIO:
        // xMidYMid meet = Pastikan peta selalu di tengah dan terlihat utuh
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // CLEANUP: Hapus style bawaan agar kita bisa warnai via CSS
        const paths = doc.querySelectorAll('path');
        paths.forEach(path => {
           path.removeAttribute('fill');
           path.removeAttribute('style');
           path.removeAttribute('stroke');
           
           // Validasi ID (JPxx) agar bisa di-klik
           const id = path.getAttribute('id');
           if (id && ID_TO_PREF_MAP[id]) {
               path.classList.add('japan-pref-path');
           }
        });

        setCleanSvgHtml(svgElement.outerHTML);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchAndCleanSvg();
  }, []);

  // 2. PEWARNAAN DINAMIS (CSS INJECTION)
  const dynamicStyles = useMemo(() => {
    let css = `
      /* BASE STYLE: Wilayah Default (Abu-abu) */
      .japan-pref-path {
        fill: #cbd5e1 !important; /* Slate 300 */
        stroke: #ffffff;
        stroke-width: 1px;
        cursor: pointer;
        transition: all 0.2s ease-out;
        outline: none;
      }
      
      /* HOVER EFFECT */
      .japan-pref-path:hover {
        filter: brightness(0.95);
        transform: scale(1.005);
        transform-box: fill-box;
        transform-origin: center;
        z-index: 50;
      }
    `;

    // Loop wilayah yang dipilih dan beri warna region
    selectedPrefectures.forEach(prefName => {
        const id = PREF_TO_ID_MAP[prefName];
        const region = PREF_REGION_MAP[prefName];
        const color = REGION_COLORS[region] || '#0ea5e9';
        
        if (id) {
            css += `
              path[id="${id}"] {
                fill: ${color} !important;
                stroke: #ffffff;
                stroke-width: 1.5px;
                z-index: 100;
                filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));
              }
            `;
        }
    });

    return css;
  }, [selectedPrefectures]);

  // Handle Klik Peta
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'path' && target.classList.contains('japan-pref-path')) {
       const id = target.getAttribute('id');
       if (id && ID_TO_PREF_MAP[id]) {
           onToggle(ID_TO_PREF_MAP[id]);
       }
    }
  };

  if (loading) {
     return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 min-h-[300px]">
             <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"/>
                 <span className="text-xs">Memuat Peta...</span>
             </div>
        </div>
     );
  }

  if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl text-red-400 text-xs min-h-[300px]">
            Gagal memuat peta.
        </div>
      );
  }

  return (
    <div className="w-full h-full relative bg-blue-50/30 rounded-xl overflow-hidden shadow-inner">
        {/* Inject CSS Dinamis */}
        <style>{dynamicStyles}</style>

        {/* Render SVG */}
        <div 
          className="w-full h-full p-1 sm:p-4 md:p-6"
          dangerouslySetInnerHTML={{ __html: cleanSvgHtml }}
          onClick={handleContainerClick}
        />
    </div>
  );
};
