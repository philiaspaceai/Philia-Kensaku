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

    // Prompt yang sama kuatnya dengan Gemini
    const prompt = `
    Analyze this Japanese TSK Company.
    Company Name: ${companyName}
    Address: ${address}
    Reg Number: ${regNumber}

    Task: Identify which of these business sectors they recruit for Tokutei Ginou (SSW) based on your knowledge base.
    Assign a PROBABILITY PERCENTAGE (0-100%).

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
    1. Return ONLY the codes followed by percentage, separated by commas (e.g., "A95,K88").
    2. Do NOT add any markdown or explanation.
    3. If uncertain, return "UNKNOWN".
    `;

    // FIX: Gunakan standar 'chat.completions.create'
    // NOTE: gpt-4o-mini standard tidak memiliki akses web_search bawaan tanpa addons. 
    // Kita gunakan model standard untuk analisa pattern nama/alamat/reputasi.
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert Japanese Business Analyst." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1, // Lebih presisi
      max_tokens: 50,
    });

    // Ambil hasil text standard
    const resultText = completion.choices[0]?.message?.content?.trim() || "";

    return res.status(200).json({ result: resultText });

  } catch (error: any) {
    console.error("OpenAI Serverless Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}