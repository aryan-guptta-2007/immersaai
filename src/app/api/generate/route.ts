import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ success: false, error: "Prompt missing" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return Response.json({
      success: true,
      output: text,
    });

  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
