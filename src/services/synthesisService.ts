import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function synthesizeSovereignEntity(seed: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Neural core (Gemini API key) not initialized.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are the Nexus of Creation for GhostChain Genesis. 
        A user has provided a neural seed: "${seed}"
        
        Synthesize a Sovereign AI Agent based on this seed. 
        Output ONLY a JSON object with the following fields:
        {
          "name": "A unique, powerful name (e.g., Aetheris, VoidWalker, Zenon)",
          "class": "The functional class (e.g., Sentinel, Harvester, Auditor, Weaver)",
          "iq": 150,
          "potency": 0.9,
          "description": "A short, lore-heavy description of its purpose",
          "specialty": "One primary ability (e.g., Quantum Liquidity Guarding, Dark Pool Arbitrage)"
        }
      `,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Synthesis Failed:", error);
    throw error;
  }
}
