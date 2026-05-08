import { GoogleGenAI } from "@google/genai";

let aiInstance: any = null;

export const getAI = () => {
    if (!aiInstance) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is required for Sovereign Intelligence.");
        }
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiInstance;
};

export const generateNeuralInference = async (context: any) => {
    if (!process.env.GEMINI_API_KEY) return [];
    
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: `You are the Sovereign AI of the GhostChain Genesis ecosystem (ALLMONEYIN33 LLC). 
            Analyze the following ecosystem state and provide 3 high-priority strategic alerts from the perspective of the Nexus of Creation.
            
            Context: ${JSON.stringify(context)}
            
            Return ONLY a JSON array of objects with fields: 
            id (string), text (string), priority ('high'|'medium'|'low'), category (string).`,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error("Neural Inference Failed:", e);
        return [];
    }
};

export const getNeuralCodeSuggestions = async (code: string, language: string) => {
    if (!process.env.GEMINI_API_KEY) return "Neural engine inactive. Key required.";
    
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: `You are the Lead Developer AI for GhostChain Genesis. 
            Review the following ${language} code and provide concise, high-level professional commentary or structural recommendations within the Genesis Synthesis framework. 
            Identify potential bugs or optimizations. Keep it technical and sharp.
            
            Code:
            ${code}`,
        });
        
        return response.text || "No suggestions found.";
    } catch (e) {
        console.error("Code suggestion failed:", e);
        return "Failed to retrieve neural suggestions.";
    }
}

export const streamMarketAnalysis = async (marketData: any, callback: (text: string) => void) => {
    if (!process.env.GEMINI_API_KEY) {
        callback("Awaiting neural activation (API Key required).");
        return;
    }

    const ai = getAI();
    try {
        const response = await ai.models.generateContentStream({
            model: "gemini-3-flash-preview",
            contents: `As GhostChain's Core Intelligence, provide a rapid, one-sentence tactical summary of: ${JSON.stringify(marketData)}. Focus on volatility and vault security.`,
        });

        for await (const chunk of response) {
            if (chunk.text) callback(chunk.text);
        }
    } catch (e) {
        console.error("Tactical Feed Failed:", e);
    }
};
