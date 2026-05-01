import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEnergyInsights(currentDemand: number, solarYield: number, weather: string) {
  try {
    const prompt = `
      You are an AI Energy Consultant for GRIDMESH, a peer-to-peer solar trading platform in Nigeria.
      Current neighborhood demand: ${currentDemand}%
      Expected Solar Yield: ${solarYield}%
      Weather Condition: ${weather}
      
      Provide a 2-sentence market insight for users. 
      Focus on pricing strategy for sellers and timing for buyers. 
      Mention the impact of typical Nigerian grid instability if relevant.
      Keep it professional, encouraging, and tech-forward.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || "Demand is rising. Sellers should list spare capacity now to capitalize on peak evening rates.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Demand is projected to spike at 7 PM. Ensure your battery levels are optimized for trading.";
  }
}
