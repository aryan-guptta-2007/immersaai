import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt) {
      return Response.json({ error: "Prompt missing" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const text = result.response.text();

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
