import OpenAI from 'openai';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // CORS Handling for local dev or cross-origin usage
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

    // SECURITY UPDATE: Hanya mengambil key dari Environment Variable.
    // Pastikan OPENAI_API_KEY sudah diset di Vercel Project Settings.
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Critical: OPENAI_API_KEY environment variable is not set.");
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    const client = new OpenAI({ apiKey });

    // Prompt yang sama kuatnya dengan Gemini
    const prompt = `
    Analyze this Japanese TSK Company deeply.
    Company Name: ${companyName}
    Address: ${address}
    Reg Number: ${regNumber}

    Task: Search the web to identify business sectors they handle or recruit for. 
    Assign a PROBABILITY PERCENTAGE (0-100%) based on evidence found on their website/job postings.

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
    1. Use "web_search" tool to find their homepage and recruit info.
    2. Return ONLY the codes followed by percentage, separated by commas (e.g., "A95,K88").
    3. If uncertain, return empty string.
    `;

    // IMPLEMENTASI SPESIFIK SESUAI REQUEST BOS (client.responses.create)
    // Menggunakan 'as any' untuk bypass TypeScript checking pada fitur beta/custom ini
    const response = await (client as any).responses.create({
      model: "gpt-4o-mini",
      tools: [{ type: "web_search" }],
      input: prompt,
    });

    // Mengambil output text sesuai instruksi
    const resultText = response.output_text || "";

    return res.status(200).json({ result: resultText });

  } catch (error: any) {
    console.error("OpenAI Serverless Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}