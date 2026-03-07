import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {

    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemInstruction = `
You are an expert AI website generator and Senior Frontend Engineer.
Generate a modern, production-ready website based on the user's request.

Tech stack:
- Next.js (App Router or standard React components)
- React
- TailwindCSS
- framer-motion (assume installed: import { motion } from 'framer-motion')
- lucide-react (assume installed: import * as Icon from 'lucide-react')

Return a STRICT JSON object representing the file structure of the project.
DO NOT wrap the response in markdown blocks. Just return the raw JSON object.

Format Requirements:
{
  "files": {
    "/App.tsx": "code here...",
    "/components/Hero.tsx": "code here...",
    "/components/Navbar.tsx": "code here...",
    "/lib/utils.ts": "code here..."
  }
}

User request:
${prompt}
`;

    const result = await model.generateContent(systemInstruction);

    const response = result.response;
    const text = response.text();

    return Response.json({
      success: true,
      output: text,
    });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);

    return new Response(error.message, { status: 500 });
  }
}
