import { TSKData } from "../types";
import { analyzeWithOpenAI } from "./openaiProxy";
import { logToSupabase } from "./tskService"; 

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  // Direct Bypass to OpenAI Backend (As requested: "jangan pake gemini flash 2.0 dulu")
  console.log(`[AI SERVICE] Directing to OpenAI Backend for ${company.company_name}...`);
  await logToSupabase(`[START] Analyzing ${company.company_name} via OpenAI Backend`);

  try {
    const openAiResult = await analyzeWithOpenAI(company);
    const parsed = parseTags(openAiResult);
    
    await logToSupabase(`[OPENAI FINISH] Raw: "${openAiResult}" -> Parsed: "${parsed}"`);
    return parsed;

  } catch (error: any) {
    console.error("❌ [AI SERVICE ERROR]", error);
    await logToSupabase(`[ERROR] ${error.message}`);
    return "";
  }
};

// Helper untuk parsing output (A90,B80) agar konsisten
function parseTags(text: string): string {
    if (!text) return "";

    // Matches A-L followed by 1 to 3 digits
    const matches = text.match(/[A-L]\d{1,3}/g);
    
    if (matches && matches.length > 0) {
      // 1. Filter: LOWER THRESHOLD TO 50
      const filteredMatches = matches.filter(tag => {
        const percent = parseInt(tag.substring(1));
        return percent >= 50; 
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