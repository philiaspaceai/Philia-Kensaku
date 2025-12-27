import { GoogleGenAI } from "@google/genai";
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

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  console.log(`[AI SERVICE] Starting Client-Side Analysis for ${company.company_name}...`);
  await logToSupabase(`[START] Analyzing ${company.company_name} via Gemini Multi-Model (Client-Side)`);

  try {
    // 1. CONFIG: API KEYS (Injected via Vite define)
    const API_KEYS = [
        process.env.APIUTAMA,
        process.env.APICADANGAN1,
        process.env.APICADANGAN2
    ].filter(Boolean) as string[];

    if (API_KEYS.length === 0) {
        throw new Error("No API Keys configured. Cek Environment Variable Vercel.");
    }

    // 2. MODELS CONFIGURATION (STRICT)
    const MODELS = [
        'gemini-2.5-flash', 
        'gemini-2.5-flash-lite', 
        'gemini-3-flash'
    ];

    // 3. PROMPT ENGINEERING (STRICT)
    const prompt = `
TUGAS:
Lakukan analisa dan Deep research mendalam di GOOGLE dan INTERNET terhadap satu perusahaan Tokutei Ginou (TSK) berikut untuk MEMPREDIKSI bidang pekerjaan Tokutei Ginou (SSW) yang paling mungkin tersedia dilayani. Gunakan Bahasa Jepang Ketika melakukan deep research di google agar kamu tidak mengalami "Language Barrier" yang terjadi karena kamu tidak menggunakan Bahasa jepang yang mengakibatkan informasi yang kamu terima menjadi kurang akurat karena tidak menggunakan Bahasa Jepang.

DATA PERUSAHAAN:
Nama Perusahaan: ${company.company_name}
Lokasi: ${company.address}
Nomor registrasi perusahaan: ${company.reg_number}
CEO: ${company.representative || "Tidak Diketahui"}

BATASAN KERAS (WAJIB):
1. WAJIB bisa mengakses google untuk mendapatkan sumber informasi.
2. WAJIB mendapatkan 10 bukti berupa informasi dari website, artikel dan lain-lain dari google agar penilaian mu semakin akurat.
3. DILARANG NGAWUR dan HARUS SESUAI FAKTA.
4. HANYA lakukan prediksi bidang Tokutei Ginou (SSW) yang sudah saya sediakan di FORMAT OUTPUT.
5. JANGAN menambahkan narasi, penjelasan, disclaimer, atau teks tambahan.
6. JANGAN menggunakan bullet selain format output.
7. JANGAN mengubah format output.
8. JANGAN menambahkan teks pembuka atau penutup.

FORMAT OUTPUT (LOCKED — WAJIB PERSIS):
Nursing Care : {{<persentase>%}}
Building Cleaning Management : {{<persentase>%}}
Manufacture of Industrial Products : {{<persentase>%}}
Construction Industry : {{<persentase>%}}
Shipbuilding and Ship Machinery Industry : {{<persentase>%}}
Automobile Repair and Maintenance : {{<persentase>%}}
Aviation Industry : {{<persentase>%}}
Accommodation Industry : {{<persentase>%}}
Agriculture : {{<persentase>%}}
Fishery and Aquaculture : {{<persentase>%}}
Manufacture of Food and Beverages : {{<persentase>%}}
Food Service Industry : {{<persentase>%}}
Automobile Transportation Business : {{<persentase>%}}
Railway : {{<persentase>%}}
Forestry : {{<persentase>%}}
Wood Industry : {{<persentase>%}}

CATATAN FORMAT:
Persentase harus angka 0–100 tanpa desimal.
`;

    let finalRawText = null;
    let usedModel = "";
    
    // 4. EXECUTION LOOP (KEY -> MODEL)
    outerLoop:
    for (let k = 0; k < API_KEYS.length; k++) {
        const apiKey = API_KEYS[k];
        // Init Client per key
        const ai = new GoogleGenAI({ apiKey });

        for (let m = 0; m < MODELS.length; m++) {
            const modelName = MODELS[m];
            
            try {
                console.log(`[Attempt] Key #${k+1} | Model: ${modelName}`);
                
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }] // Enable Google Search Grounding
                    }
                });

                const text = response.text;
                if (text && text.length > 20) { 
                    finalRawText = text;
                    usedModel = modelName;
                    console.log("✅ Success!");
                    break outerLoop;
                }
            } catch (err: any) {
                console.warn(`⚠️ Failed Key #${k+1} | Model: ${modelName} -> ${err.message}`);
                continue;
            }
        }
    }

    if (!finalRawText) {
        await logToSupabase(`[AI] Failed. All models/keys exhausted.`);
        return "";
    }

    // 5. PARSING OUTPUT
    const parsedTags: string[] = [];
    const lines = finalRawText.split('\n');

    lines.forEach(line => {
        const match = line.match(/^(.+?)\s*:\s*(\d+)%?/);
        if (match) {
            const label = match[1].trim();
            const percent = parseInt(match[2], 10);
            
            const code = SECTOR_MAP[label];
            
            if (code && percent > 30) {
                parsedTags.push(`${code}${percent}`);
            }
        }
    });

    const resultString = parsedTags.join(',');

    if (resultString) {
        await logToSupabase(`[AI SUCCESS] Tags: "${resultString}" (Model: ${usedModel})`);
    } else {
        await logToSupabase(`[AI WARN] Raw text captured but parsing failed/low confidence.`);
    }
    
    return resultString;

  } catch (error: any) {
    console.error("❌ [AI SERVICE ERROR]", error);
    await logToSupabase(`[ERROR] ${error.message}`);
    return "";
  }
};