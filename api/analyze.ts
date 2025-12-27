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

    // PROMPT BARU: Predictive Profiling
    // Karena GPT-4o-mini API standar tidak bisa browsing web, kita minta dia menebak berdasarkan pola nama dan lokasi.
    const prompt = `
    Analyze this Japanese TSK (Registered Support Organization).
    Company Name: ${companyName}
    Address: ${address}
    Reg Number: ${regNumber}

    Task: Predict the likely Tokutei Ginou (SSW) business sectors based on the Company Name Keywords and Location characteristics.
    
    Logic for Prediction (Use this priority):
    1. KEYWORDS:
       - "Care", "Fukushi", "Kaigo", "Life" -> Assign A (Nursing Care) with 95%.
       - "Build", "Kensetsu", "Kougyou", "Tech" -> Assign C (Construction) with 90%.
       - "Farm", "Agri", "Nogyo", "Green" -> Assign I (Agriculture) with 90%.
       - "Food", "Shokuhin", "Meat", "Deli" -> Assign K (Food Mfg) with 90%.
       - "Hotel", "Resort", "Inn" -> Assign H (Hotel) with 90%.
       - "Auto", "Motor", "Seibi" -> Assign F (Auto Repair) with 90%.
    
    2. GENERAL INFERENCE (If name is generic like "International", "Support", "Consulting"):
       - These TSKs typically handle high-demand sectors.
       - Assign 'A' (Nursing Care) with 75%.
       - Assign 'K' (Food & Bev Mfg) with 70%.
       - Assign 'I' (Agriculture) with 65%.

    Codes:
    A: Nursing Care
    B: Building Cleaning
    C: Construction
    D: Manufacturing
    E: Electronics
    F: Auto Repair
    G: Aviation
    H: Hotel
    I: Agriculture
    J: Fishery
    K: Food & Bev Mfg
    L: Food Service

    Instructions:
    - Return ONLY the codes followed by percentage, separated by commas (e.g., "A95,K70").
    - Do NOT return "UNKNOWN". Make an educated guess based on the logic above.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert Japanese Business Analyst using predictive modeling." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3, // Sedikit kreatif untuk menebak
      max_tokens: 50,
    });

    const resultText = completion.choices[0]?.message?.content?.trim() || "";

    return res.status(200).json({ result: resultText });

  } catch (error: any) {
    console.error("OpenAI Serverless Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}