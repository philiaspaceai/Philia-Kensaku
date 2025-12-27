import { GoogleGenAI, Type } from "@google/genai";
import { TSKData } from "../types";
import { logToSupabase } from "./tskService"; 

// Mapping from AI Prompt Label -> App Sector Code (A-L)
const SECTOR_MAP: Record<string, string> = {
  "Nursing Care": "A",
  "Building Cleaning Management": "B",
  "Construction Industry": "C",
  "Manufacture of Industrial Products": "D",
  "Electronics": "E",
  "Automobile Repair and Maintenance": "F",
  "Aviation Industry": "G",
  "Accommodation Industry": "H",
  "Agriculture": "I",
  "Fishery and Aquaculture": "J",
  "Manufacture of Food and Beverages": "K",
  "Food Service Industry": "L"
};

// Interface for AI Response Structure
interface SectorAnalysis {
  category_name: string;
  confidence_score: number;
  evidence_found: string;
}

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  console.log(`[GEMINI SERVICE] Starting Strict Analysis for ${company.company_name}...`);
  await logToSupabase(`[GEMINI-START] Analyzing ${company.company_name} using JSON Schema Enforcement`);

  try {
    // 1. CONFIG: API KEYS
    const API_KEYS = [
        process.env.APIUTAMA,
        process.env.APICADANGAN1,
        process.env.APICADANGAN2
    ].filter(Boolean) as string[];

    if (API_KEYS.length === 0) {
        throw new Error("No API Keys configured.");
    }

    // 2. MODELS CONFIGURATION (STRICT USER ORDER)
    const MODELS = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite', 
        'gemini-3-flash'
    ];

    // 3. SCHEMA DEFINITION (STRICT TYPESCRIPT ENFORCEMENT)
    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category_name: {
              type: Type.STRING,
              description: "Kategori industri dalam Bahasa Inggris yang sesuai.",
              enum: [
                "Nursing Care", "Building Cleaning Management", "Construction Industry",
                "Manufacture of Industrial Products", "Electronics", "Automobile Repair and Maintenance",
                "Aviation Industry", "Accommodation Industry", "Agriculture", 
                "Fishery and Aquaculture", "Manufacture of Food and Beverages", "Food Service Industry"
              ]
            },
            confidence_score: {
              type: Type.INTEGER,
              description: "Skor keyakinan 0-100 berdasarkan bukti digital.",
            },
            evidence_found: {
              type: Type.STRING,
              description: "Bukti spesifik yang ditemukan (misal: 'Ada iklan rekrutmen staff kaigo').",
            }
          },
          required: ["category_name", "confidence_score", "evidence_found"],
        },
    };

    // 4. PROMPT ENGINEERING (RUBRIC & EVIDENCE BASED)
    const prompt = `
ROLE:
Anda adalah Analis Intelijen Bisnis Elit untuk pasar tenaga kerja Jepang (Tokutei Ginou).

TUGAS:
Lakukan Deep Search untuk menentukan sektor industri TSK berikut. 
Gunakan Bahasa Jepang saat mencari di Google untuk akurasi maksimal, tapi output JSON dalam Inggris sesuai Schema.

TARGET:
Nama: ${company.company_name}
Registrasi: ${company.reg_number}
Alamat: ${company.address}
CEO: ${company.representative || "Tidak Diketahui"}

RUBRIK PENILAIAN SKOR (Confidence Score):
- Skor 90-100: DITEMUKAN BUKTI KERAS berupa halaman rekrutmen (Recruit Page), Iklan Jobstreet/Indeed/HelloWork yang secara eksplisit mencari staff Tokutei Ginou di bidang tersebut.
- Skor 70-89: Website resmi menyatakan dengan jelas bahwa "Bisnis Utama" mereka bergerak di bidang tersebut.
- Skor 40-69: Ada indikasi dari foto kegiatan, blog, atau artikel berita, tapi tidak ada info rekrutmen eksplisit.
- Skor < 40: Jangan dimasukkan ke dalam list.

INSTRUKSI:
1. Cari: "${company.company_name} 特定技能 求人" (Tokutei Ginou Recruitment).
2. Cari: "${company.company_name} 事業内容" (Business Summary).
3. HANYA kembalikan kategori yang memiliki confidence_score >= 50.
`;

    let finalResultTags = "";
    let usedModel = "";
    
    // 5. EXECUTION LOOP
    outerLoop:
    for (let k = 0; k < API_KEYS.length; k++) {
        const apiKey = API_KEYS[k];
        const ai = new GoogleGenAI({ apiKey });

        for (let m = 0; m < MODELS.length; m++) {
            const modelName = MODELS[m];
            
            try {
                console.log(`[Attempt] Key #${k+1} | Model: ${modelName}`);
                
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                        responseMimeType: "application/json",
                        responseSchema: responseSchema
                    }
                });

                const rawText = response.text;
                if (!rawText) throw new Error("Empty response from AI");

                // 6. PARSE & VALIDATE JSON
                const analysisResults: SectorAnalysis[] = JSON.parse(rawText);
                
                // Filter & Map to Codes (A90, B80 format)
                const validTags: string[] = [];
                
                analysisResults.forEach(item => {
                    const code = SECTOR_MAP[item.category_name];
                    // Double check threshold (Layer 2 filtering)
                    if (code && item.confidence_score >= 50) {
                        validTags.push(`${code}${item.confidence_score}`);
                        console.log(`   -> Found: ${item.category_name} (${item.confidence_score}%) - Ev: ${item.evidence_found}`);
                    }
                });

                if (validTags.length > 0) {
                    finalResultTags = validTags.join(',');
                    usedModel = modelName;
                    await logToSupabase(`[GEMINI-SUCCESS] Mapped: ${finalResultTags} | Ev: ${analysisResults[0].evidence_found.substring(0, 50)}...`);
                    break outerLoop;
                } else {
                     console.warn(`   -> Model ${modelName} returned valid JSON but no high confidence sectors.`);
                }

            } catch (err: any) {
                console.warn(`⚠️ Failed Key #${k+1} | Model: ${modelName} -> ${err.message}`);
                continue;
            }
        }
    }

    if (!finalResultTags) {
        await logToSupabase(`[GEMINI-FAIL] No confident tags found after exhaustive search.`);
        return "";
    }
    
    return finalResultTags;

  } catch (error: any) {
    console.error("❌ [GEMINI SERVICE ERROR]", error);
    await logToSupabase(`[GEMINI-ERROR] ${error.message}`);
    return "";
  }
};