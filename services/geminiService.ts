import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// NOTE: In a real app, do not expose keys on client side if possible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDocument = async (base64Data: string, mimeType: string = 'image/png') => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          },
          {
            text: `Analyze this document image for printing purposes. 
            1. Suggest the best Paper Type (Standard, Premium, Cardstock, or Glossy) based on content (e.g., Resume -> Premium, Photo -> Glossy).
            2. Is it best printed in Color or B&W?
            3. Provide a 1 sentence summary of what the document is.
            
            Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                suggestedPaper: { type: Type.STRING },
                suggestedColor: { type: Type.STRING },
                summary: { type: Type.STRING }
            }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};