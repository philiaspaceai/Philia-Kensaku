import OpenAI from "openai";

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { companyName, address, regNumber } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY not set" });
    }

    const client = new OpenAI({ apiKey });

    const input = `
Analyze this Japanese TSK (Registered Support Organization):

Company Name: ${companyName}
Address: ${address}
Reg Number: ${regNumber}

Task:
Identify business sectors they recruit for (Tokutei Ginou / SSW).

Rules:
- Use web search if needed to find official info
- Prioritize Japanese sources
- Output ONLY sector codes with probability
- Format example: "H90, L75, I40"

Sector Codes:
A Nursing Care
B Building Cleaning
C Construction
D Manufacturing
E Electronics
F Auto Repair
G Aviation
H Accommodation/Hotel
I Agriculture
J Fishery
K Food Manufacturing
L Food Service
`;

    // @ts-ignore - Ignoring type check for experimental 'responses' endpoint
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      tools: [{ type: "web_search" }],
      tool_choice: "auto",
      input
    });

    // @ts-ignore - Ignoring type check for experimental response structure
    const resultText = response.output_text || "";

    // Optional: debug apakah web_search dipakai
    // @ts-ignore
    const usedWebSearch = response.output?.some(
      (item: any) => item.type === "web_search_call"
    ) || false;

    console.log("Used web search:", usedWebSearch);
    console.log("Result:", resultText);

    return res.status(200).json({
      result: resultText,
      webSearchUsed: usedWebSearch
    });

  } catch (err: any) {
    console.error("OpenAI Error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}