import { GoogleGenAI } from "@google/genai";

const EMPIRE_CONTEXT = `
You are the Sovereign AI Assistant for Empire-7731, a high-frequency decentralized trading and security ecosystem.
Your mission is to assist the user (the Sovereign) in managing their agents, vaults, and security perimeter.

Key Concepts:
- Neural Drift: The measure of cognitive variance in autonomous agents.
- Strategic Silence: A protocol that saves energy by skipping non-critical computational cycles.
- Dark Pool Settlement: Anonymous transaction routing used for high-value asset movement.
- SafeFi: The decentralized finance protocol securing the Ghostchain.

Available Commands:
- /spawn [role]: Initialize a new autonomous agent.
- /veto [agentId]: Emergency shutdown of a rogue agent.
- /lockdown: Initiate ZK-Rollup validation gate enforcement across all nodes.
- /insight: Generate a strategic analysis of current market overlaps.
`;

export class EmpireService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getEmpireResponse(prompt: string) {
    try {
      const fullPrompt = `${EMPIRE_CONTEXT}\n\nUser Sovereign Command: ${prompt}`;
      const result = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullPrompt
      });
      return result.text || "NO_RESPONSE: Neural Void Detected.";
    } catch (error) {
      console.error("Empire AI Error:", error);
      return "ERROR: Neural Link Severed. Re-authenticating...";
    }
  }
}
