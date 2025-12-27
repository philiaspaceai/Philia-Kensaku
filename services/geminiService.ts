import { GoogleGenAI } from "@google/genai";
import { TSKData } from "../types";
import { logToSupabase } from "./tskService"; 

export const analyzeCompanyTags = async (company: TSKData): Promise<string> => {
  console.log(`[GEMINI SERVICE] Starting Analysis for ${company.company_name} (Text Mode)...`);
  await logToSupabase(`[GEMINI-START] Analyzing ${company.company_name} [Mode: Direct Code]`);

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

    // 3. SECTOR DEFINITIONS FOR PROMPT
    const SECTOR_LIST = `
A: Nursing Care (Kaigo)
B: Building Cleaning Management
C: Construction Industry
D: Manufacture of Industrial Products
E: Electronics and Information
F: Automobile Repair and Maintenance
G: Aviation Industry
H: Accommodation Industry (Hotel)
I: Agriculture
J: Fishery and Aquaculture
K: Manufacture of Food and Beverages
L: Food Service Industry (Restaurant)
`;

    // 4. PROMPT ENGINEERING (DIRECT OUTPUT)
    const prompt = `
ROLE: Business Intelligence Analyst (Japan Market).
TASK: Determine the Tokutei Ginou (SSW) sector for this company based on Google Search results.

TARGET:
Name: ${company.company_name}
Reg No: ${company.reg_number}
Address: ${company.address}
Representative: ${company.representative || "-"}

SECTOR CODES:
${SECTOR_LIST}

INSTRUCTIONS:
1. Search for "${company.company_name} 特定技能 求人" and "${company.company_name} 事業内容".
2. Identify the main business sectors.
3. Assign a confidence score (0-100) for each relevant sector.
4. OUTPUT FORMAT: strict comma-separated string of "Code+Score". 
5. NO EXPLANATION. NO MARKDOWN. NO JSON. ONLY THE CODES.
6. Minimum score to include is 50.

EXAMPLE OUTPUTS:
"A95"
"A90,B60"
"C85,K50"
"NA" (if no data found)

YOUR OUTPUT:
`;

    let finalResultTags = "";
    
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
                        temperature: 0.1, // STRICT DETERMINISTIC
                        tools: [{ googleSearch: {} }]
                    }
                });

                const rawText = response.text || "";
                console.log(`   -> Raw Response: ${rawText.trim()}`);

                // 6. ROBUST PARSING (REGEX)
                // Captures patterns like "A90", "A 90", "A:90" and normalizes them.
                // Regex explanation: ([A-L]) captures the code, [^0-9]* skips spacers, (\d{2,3}) captures 2-3 digit score.
                const regex = /([A-L])[^0-9]*(\d{2,3})/g;
                let match;
                const foundTags: string[] = [];

                while ((match = regex.exec(rawText)) !== null) {
                    const code = match[1];
                    let score = parseInt(match[2]);
                    
                    // Cap score at 100
                    if (score > 100) score = 100;
                    
                    // Filter threshold (Double check)
                    if (score >= 50) {
                        foundTags.push(`${code}${score}`);
                    }
                }

                if (foundTags.length > 0) {
                    finalResultTags = foundTags.join(',');
                    await logToSupabase(`[GEMINI-SUCCESS] Mapped: ${finalResultTags} (Model: ${modelName})`);
                    break outerLoop;
                } else if (rawText.includes("NA")) {
                    console.warn(`   -> AI returned NA (Not Found).`);
                } else {
                    console.warn(`   -> No valid codes found in response.`);
                }

            } catch (err: any) {
                console.warn(`⚠️ Failed Key #${k+1} | Model: ${modelName} -> ${err.message}`);
                continue;
            }
        }
    }

    if (!finalResultTags) {
        await logToSupabase(`[GEMINI-FAIL] No tags found.`);
        return "";
    }
    
    return finalResultTags;

  } catch (error: any) {
    console.error("❌ [GEMINI SERVICE ERROR]", error);
    await logToSupabase(`[GEMINI-ERROR] ${error.message}`);
    return "";
  }
};