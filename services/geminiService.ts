import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { TSKData } from "../types";
import { analyzeWithOpenAI } from "./openaiProxy";

// NOTE: process.env.API_KEY is defined in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  // UPGRADE MODEL: Menggunakan Gemini 2.0 Flash yang lebih stabil & kuota lebih besar
  const model = "gemini-2.0-flash"; 

  const prompt = `
    Do deep research and analyze this Japanese Registered Support Organization (TSK).
    Company Name: ${company.company_name}
    Address: ${company.address}
    Reg Number: ${company.reg_number}

    Task: Search Google to research deeply and identify which of these business sectors they handle or recruit for. 
    Assign a PROBABILITY PERCENTAGE (0-100%) based on the strength of evidence (job postings, website content).
	You must find and get 10 strong evidence (It could be website that provides the related information, articles, etc.) to increase your accuracy in calculating the percentage.

    Codes:
    A: Nursing Care / Kaigo
    B: Building Cleaning
    C: Construction
    D: Manufacturing / Factory
    E: Electronics / Electric
    F: Automobile Repair
    G: Aviation
    H: Accommodation / Hotel
    I: Agriculture
    J: Fishery
    K: Food & Beverage Manufacturing
    L: Food Service / Restaurant

    Instructions:
    1. Search for their official website or job postings using the "google_search" tool.
    2. Return the codes followed immediately by the percentage number (e.g., "A90").
    3. Return ONLY the codes separated by commas.
    4. SORT the result by percentage DESCENDING (Highest first).
    5. If general/unknown, return empty string.

    Example Output: "A95,K88"
  `;

  try {
    // STEP 1: COBA GEMINI (PRIMARY)
    console.log(`[AI PRIMARY] Mencoba Gemini ${model}...`);
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        temperature: 0.1, // Deterministic
        tools: [{ googleSearch: {} }], // Use Grounding
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    // Robust text extraction
    const text = response.text || 
                 response.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "";
    
    return parseTags(text);

  } catch (error: any) {
    // STEP 2: FAILOVER KE OPENAI (BACKUP)
    // Jika Gemini error (429 Limit, 503 Overloaded, atau error lain), alihkan ke OpenAI
    console.warn("⚠️ [AI PRIMARY FAILED] Gemini bermasalah:", error.message);
    console.log("🔄 [FAILOVER] Mengalihkan ke OpenAI (GPT-4o-Nano)...");
    
    try {
        const openAiResult = await analyzeWithOpenAI(company);
        return parseTags(openAiResult);
    } catch (backupError) {
        console.error("❌ [SYSTEM FAILURE] Kedua AI gagal.", backupError);
        return "";
    }
  }
};

// Helper untuk parsing output (A90,B80) agar konsisten
function parseTags(text: string): string {
    if (!text) return "";

    // Matches A-L followed by 1 to 3 digits
    const matches = text.match(/[A-L]\d{1,3}/g);
    
    if (matches && matches.length > 0) {
      // 1. Filter: Only keep tags with score >= 85
      const filteredMatches = matches.filter(tag => {
        const percent = parseInt(tag.substring(1));
        return percent >= 85;
      });

      if (filteredMatches.length === 0) return "";

      // 2. Sort Descending
      const sortedTags = filteredMatches.sort((a, b) => {
        const percentA = parseInt(a.substring(1));
        const percentB = parseInt(b.substring(1));
        return percentB - percentA; 
      });

      // 3. Remove duplicates and join
      return [...new Set(sortedTags)].join(",");
    }
    
    return "";
}