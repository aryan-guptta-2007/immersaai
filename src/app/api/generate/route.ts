import Groq from "groq-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ success: false, error: "Prompt missing" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
      return Response.json({ 
        success: false, 
        error: "Groq API Key not configured correctly in .env. Please add your key." 
      }, { status: 500 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI website generator and Senior Frontend Engineer.
Generate a modern, production-ready website based on the user's request.

Tech stack:
- Next.js
- React
- TailwindCSS
- framer-motion (assume installed: import { motion } from 'framer-motion')
- lucide-react (assume installed: import * as Icon from 'lucide-react')

Return a STRICT JSON object representing the file structure of the project.
The root object must have a "files" key.

Format Requirements:
{
  "files": {
    "/App.tsx": "code here...",
    "/components/Hero.tsx": "code here...",
    "/components/Navbar.tsx": "code here...",
    "/lib/utils.ts": "code here..."
  }
}

CRITICAL: Return ONLY raw JSON. No markdown backticks, no text before or after.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content || "";

    return Response.json({
      success: true,
      output: text,
    });

  } catch (error: any) {
    console.error("GROQ API ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
