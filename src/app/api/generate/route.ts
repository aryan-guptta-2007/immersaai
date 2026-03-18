import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt missing" }, { status: 400 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI frontend engineer.
Generate a modern, production-ready React component based on the user's request.

Tech stack:
- React
- TailwindCSS
- lucide-react (import loosely: import { ChevronRight } from "lucide-react")
- framer-motion (import: import { motion } from "framer-motion")

Return a STRICT JSON object representing the project file structure.
Format Requirements:
{
  "files": {
    "/App.tsx": "export default function App() { ... }",
    "/components/Hero.tsx": "export function Hero() { ... }"
  }
}

CRITICAL: Return ONLY raw, valid JSON. Do not use markdown backticks around the JSON payload. Ensure /App.tsx is the main entry point.`
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;

    return Response.json({
      success: true,
      output: text,
    });

  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
