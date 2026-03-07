import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {

    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();

    return Response.json({
      success: true,
      output: text,
    });

  } catch (error) {

    console.error("Gemini Error:", error);

    return Response.json({
      success: false,
      error: "Generation engine failed to hook up",
    });
  }
}
