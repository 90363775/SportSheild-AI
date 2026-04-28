import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GeminiDetectionService = {
  async analyzeAssetRisk(assetName: string, assetType: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the potential risk of unauthorized redistribution for the following sports media asset:
        Name: ${assetName}
        Type: ${assetType}`,
        config: {
          systemInstruction: "You are an expert sports media protection AI. Provide analysis on risk score (0-100), risk level (Critical, High, Medium, Low, Review), likely platforms for infringement, and specific detection insights.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER },
              riskLevel: { type: Type.STRING },
              likelyPlatforms: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              detectionInsights: { type: Type.STRING }
            },
            required: ["riskScore", "riskLevel", "likelyPlatforms", "detectionInsights"]
          }
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) throw new Error("No response from Gemini");
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Gemini analysis failed", error);
      return {
        riskScore: 45,
        riskLevel: "Medium",
        likelyPlatforms: ["TikTok", "Instagram"],
        detectionInsights: "Standard risk profile for match highlights. Automated fingerprinting recommended."
      };
    }
  }
};
