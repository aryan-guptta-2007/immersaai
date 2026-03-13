import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: prompt
    });

    return Response.json({
      success: true,
      output: result.text
    });

  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
