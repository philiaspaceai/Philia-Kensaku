import OpenAI from 'openai';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // CORS Handling
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { companyName, address, regNumber } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Critical: OPENAI_API_KEY environment variable is not set.");
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    const client = new OpenAI({ apiKey });

    // PROMPT: Deep Analysis with Web Search
    const prompt = `
    Search the web deeply for this Japanese TSK (Registered Support Organization):
    Company Name: ${companyName}
    Address: ${address}
    Reg Number: ${regNumber}

    Task: Identify the specific business sectors they recruit for (Tokutei Ginou/SSW).
    
    Sector Codes:
    A: Nursing Care (Kaigo)
    B: Building Cleaning
    C: Construction
    D: Manufacturing
    E: Electronics
    F: Auto Repair
    G: Aviation
    H: Accommodation/Hotel
    I: Agriculture
    J: Fishery
    K: Food & Bev Mfg
    L: Food Service

    Output Format:
    - Return ONLY the codes followed by probability percentage based on your search findings.
    - Separated by commas.
    - Example: "A95, K80, C70"
    - If no specific info found online, make an educated guess based on company name keywords and location.
    `;

    // MENGGUNAKAN ENDPOINT RESPONSES (Experimental/New)
    // SDK JS biasanya menggunakan camelCase (outputText) untuk property response,
    // berbeda dengan Python yang menggunakan snake_case (output_text).
    const response = await (client as any).responses.create({
      model: "gpt-4o-mini", 
      tools: [
        { type: "web_search" }
      ],
      input: prompt, 
      max_tokens: 3000
    });

    console.log("OpenAI Raw Response Keys:", Object.keys(response));

    // PRIORITAS 1: CamelCase (Standar JS SDK) -> outputText
    // PRIORITAS 2: SnakeCase (Standar Python/Raw API) -> output_text
    // PRIORITAS 3: Stringify JSON (Untuk Debugging jika format berubah/gagal)
    const resultText = response.outputText || response.output_text || JSON.stringify(response);
    
    console.log("OpenAI Extracted Result:", resultText);

    return res.status(200).json({ result: resultText });

  } catch (error: any) {
    console.error("OpenAI Serverless Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}