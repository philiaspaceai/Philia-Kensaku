import { TSKData } from "../types";

/**
 * Proxy service to call our Vercel Serverless Function (/api/analyze)
 * This keeps the frontend lightweight and the API Key secure on the server.
 */
export const analyzeWithOpenAI = async (company: TSKData): Promise<string> => {
  try {
    // Call the serverless function
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName: company.company_name,
        address: company.address,
        regNumber: company.reg_number
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenAI Backup Result:", data.result);
    
    return data.result || "";
  } catch (error) {
    console.error("OpenAI Fallback Error:", error);
    // If backup fails, we return empty string to avoid crashing the UI
    return "";
  }
};