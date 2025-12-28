import React, { useEffect, useState, useMemo } from 'react';
import { ID_TO_PREF_MAP, PREF_TO_ID_MAP, PREF_REGION_MAP, REGION_COLORS } from '../../constants';

interface JapanMapProps {
  selectedPrefectures?: string[];
  heatmapData?: Record<string, number>; // Mode Heatmap
  heatmapColor?: string; // New Prop: Base Color for Heatmap (Hex)
  onToggle: (pref: string) => void;
}

export const JapanMap: React.FC<JapanMapProps> = ({ 
    selectedPrefectures = [], 
    heatmapData, 
    heatmapColor = '#0ea5e9', // Default Blue
    onToggle 
}) => {
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
        // Timpa ukuran bawaan dengan 100% agar responsif mengikuti container
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.style.display = 'block';
        svgElement.style.overflow = 'visible'; // Allow tooltips/hover to spill if needed
        
        // PRESERVE ASPECT RATIO:
        // xMidYMid meet = Pastikan peta selalu di tengah dan terlihat utuh tanpa terpotong
        if (!svgElement.hasAttribute('viewBox')) {
            // Fallback if viewBox is missing (unlikely for Japan.svg but good safety)
            svgElement.setAttribute('viewBox', '0 0 1000 1000'); 
        }
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

  // Helper untuk konversi Hex ke RGB string "r, g, b"
  const hexToRgb = (hex: string) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255].join(',');
    }
    return "14, 165, 233"; // Fallback Default Blue
  }

  // 2. PEWARNAAN DINAMIS (CSS INJECTION)
  const dynamicStyles = useMemo(() => {
    let css = `
      /* BASE STYLE: Wilayah Default */
      .japan-pref-path {
        fill: #ffffff; /* White Land */
        stroke: #172554; /* Blue 950 - Dark Border */
        stroke-width: 0.8px;
        cursor: pointer;
        transition: all 0.2s ease-out;
        outline: none;
        vector-effect: non-scaling-stroke;
      }
      
      /* HOVER EFFECT */
      .japan-pref-path:hover {
        fill: #f1f5f9; /* Slate 100 */
        filter: brightness(0.95);
        stroke-width: 1.5px;
        transform-box: fill-box;
        transform-origin: center;
        z-index: 50;
      }
    `;

    // --- MODE 1: HEATMAP ---
    if (heatmapData) {
        // Calculate Max Value for Normalization
        const counts = Object.values(heatmapData);
        const maxCount = Math.max(...counts, 1); 
        const rgbColor = hexToRgb(heatmapColor);

        Object.entries(heatmapData).forEach(([prefName, count]) => {
            const id = PREF_TO_ID_MAP[prefName];
            if (id) {
                // Opacity Logic: Min 0.3, Max 1.0
                const intensity = 0.1 + (count / maxCount) * 0.9;
                
                css += `
                  path[id="${id}"] {
                    fill: rgba(${rgbColor}, ${intensity}) !important;
                    stroke: #172554;
                  }
                  path[id="${id}"]:hover {
                    fill: rgba(${rgbColor}, 1) !important;
                    filter: brightness(1.1);
                  }
                `;
            }
        });

    // --- MODE 2: SELECTION (DEFAULT) ---
    } else {
        selectedPrefectures.forEach(prefName => {
            const id = PREF_TO_ID_MAP[prefName];
            const region = PREF_REGION_MAP[prefName];
            const color = REGION_COLORS[region] || '#0ea5e9';
            
            if (id) {
                css += `
                  path[id="${id}"] {
                    fill: ${color} !important;
                    stroke: #172554;
                    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));
                  }
                `;
            }
        });
    }

    return css;
  }, [selectedPrefectures, heatmapData, heatmapColor]);

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
        <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-xl text-blue-400 min-h-[300px]">
             <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                 <span className="text-xs">Memuat Peta...</span>
             </div>
        </div>
     );
  }

  if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-xl text-red-400 text-xs min-h-[300px]">
            Gagal memuat peta.
        </div>
      );
  }

  return (
    <div className="w-full h-full relative bg-blue-100/80 rounded-xl overflow-hidden shadow-inner border border-blue-200">
        <style>{dynamicStyles}</style>
        <div 
          className="w-full h-full flex items-center justify-center p-4 sm:p-6"
          dangerouslySetInnerHTML={{ __html: cleanSvgHtml }}
          onClick={handleContainerClick}
        />
    </div>
  );
};
