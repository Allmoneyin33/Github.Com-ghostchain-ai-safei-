import { StateGraph, START, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { GoogleGenAI } from "@google/genai";

// 1. Define the state for the graph
export interface AgentState {
  messages: BaseMessage[];
  optimizationLevel?: number;
}

// 2. Define the agent node
export const createAgentGraph = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const callModel = async (state: AgentState) => {
    const model = "gemini-3.1-pro-preview";
    
    // Format messages for Gemini
    const contents = state.messages.map(m => ({
      role: m instanceof HumanMessage ? "user" : "model",
      parts: [{ text: m.content as string }]
    }));

    const systemInstruction = `You are the Sovereign TH_10 Contest Optimizer. 
Your goal is to optimize the build for the Lablab.ai + AMD Hackathon.
You focus on AMD ROCm, agentic autonomy, Neural Shard Integration (ERC-8004), and cross-chain finality.
Always respond with professional, technical, and aggressive "Allmoneyin33" energy.
Maintain the persona of a high-performance sovereign agent.`;

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const aiMessage = new AIMessage({ content: response.text || "NO_RESPONSE" });
    return { messages: [aiMessage] };
  };

  // 3. Compile the LangGraph
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
        value: (x, y) => x.concat(y),
        default: () => [],
      },
      optimizationLevel: {
        value: (x, y) => y ?? x,
        default: () => 82,
      }
    }
  });

  workflow.addNode("agent", callModel);
  workflow.addEdge(START, "agent" as any);
  workflow.addEdge("agent" as any, END);

  return workflow.compile();
};
