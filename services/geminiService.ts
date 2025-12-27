import { GoogleGenAI } from "@google/genai";
import { TSKData } from "../types";

// NOTE: process.env.API_KEY is defined in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Limitasi Model (Per 26 Des 2025):
 * Model: gemini-2.0-flash-exp
 * 
 * Free Tier:
 * - 10 RPM (Requests Per Minute)
 * - 1,500 RPD (Requests Per Day)
 * 
 * Pay-as-you-go:
 * - 1,000 RPM (Requests Per Minute) - Jauh lebih tinggi
 * 
 * Jika terjadi error di Google Cloud Metrics, kemungkinan karena:
 * 1. Model Name typo/tidak tersedia (404) -> Kita ganti ke 'gemini-2.0-flash-exp'
 * 2. Rate Limit Exceeded (429) -> Tunggu sebentar antar request.
 */

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  // CHANGE: Menggunakan gemini-2.0-flash-exp yang lebih stabil akses publiknya.
  const model = "gemini-2.0-flash-exp"; 

  const prompt = `
    Analyze this Japanese Registered Support Organization (TSK).
    Company Name: ${company.company_name}
    Address: ${company.address}
    Reg Number: ${company.reg_number}

    Task: Search Google to identify which of these business sectors they handle or recruit for. 
    Assign a PROBABILITY PERCENTAGE (0-100%) based on the strength of evidence (job postings, website content).

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
    1. Search for their official website or job postings.
    2. Return the codes followed immediately by the percentage number (e.g., "A90").
    3. Return ONLY the codes separated by commas.
    4. SORT the result by percentage DESCENDING (Highest first).
    5. If general/unknown, return empty string.

    Example Output: "A95,K80,D50"
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.1, // Deterministic
        tools: [{ googleSearch: {} }] // Use Grounding
      }
    });

    const text = response.text || "";
    
    // Regex to match "Letter" followed by "Numbers" (e.g. A90, B100)
    // Matches A-L followed by 1 to 3 digits
    const matches = text.match(/[A-L]\d{1,3}/g);
    
    if (matches && matches.length > 0) {
      // Manual sorting to be 100% sure (AI sometimes forgets sorting)
      const sortedTags = matches.sort((a, b) => {
        const percentA = parseInt(a.substring(1));
        const percentB = parseInt(b.substring(1));
        return percentB - percentA; // Descending
      });

      // Remove duplicates and join
      return [...new Set(sortedTags)].join(",");
    }
    
    return "";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return empty string so UI handles it gracefully (just skips saving tags)
    return "";
  }
};