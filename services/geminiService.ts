import { GoogleGenAI } from "@google/genai";
import { TSKData } from "../types";

// NOTE: process.env.API_KEY is defined in vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  // MENGGUNAKAN GEMINI 3 FLASH PREVIEW
  // Model ini yang paling stabil mendukung fitur Google Search Grounding saat ini.
  const model = "gemini-3-flash-preview"; 

  const prompt = `
    Analyze this Japanese Registered Support Organization (TSK).
    Company Name: ${company.company_name}
    Address: ${company.address}
    Reg Number: ${company.reg_number}

    Task: Search Google to identify which of these business sectors they handle or recruit for. 
    Map them to these codes:
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
    1. Search for their official website or job postings (Hello Work, Indeed, etc.).
    2. If they are a general HR firm with no specific sector mentioned, return "GENERAL".
    3. Return ONLY the codes separated by commas (e.g., "A,I,K"). 
    4. If no specific info found, return empty string.
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
    
    // Simple extraction of codes A-L
    const matches = text.match(/[A-L]/g);
    if (matches && matches.length > 0) {
      // Remove duplicates and join
      return [...new Set(matches)].join(",");
    }
    
    return "";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "";
  }
};