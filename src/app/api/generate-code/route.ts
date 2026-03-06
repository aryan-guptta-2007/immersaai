export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const promptText = `
You are an elite, senior React and WebGL developer.
Generate a complete, production-ready, highly-animated, dynamic Next.js landing page based on the following request:

Request: "${prompt}"

REQUIREMENTS:
1. Return exactly ONE React component using default export.
2. Use absolute peak modern design (glassmorphism, neon, deep dark themes, highly styled Tailwind CSS).
3. DO NOT return any markdown wrapping (no \`\`\`tsx). Return ONLY the raw code string.
4. Assume these libraries are installed and ready to be imported: 
   - framer-motion (import { motion } from 'framer-motion')
   - lucide-react (import { Search, Rocket, etc } from 'lucide-react')
5. Combine Hero, Features, Testimonials, and any other sections all into this single file.
6. Remember this renders in a browser sandbox, so keep state management simple (React.useState).

Ensure your code looks something like this structure:
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function GeneratedSite() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Build it out gorgeously... */}
    </div>
  );
}
`;

    const result = await model.generateContent(promptText);
    let text = result.response.text();

    // Extra cleanup just in case Gemini disobeys the instruction and wraps in markdown
    text = text.replace(/^```(tsx|jsx|js|ts|typescript|react)?\s*/i, "");
    text = text.replace(/```\s*$/g, "");
    text = text.trim();

    return Response.json({ code: text });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return Response.json({
      success: false,
      error: error.message || "Code generation compilation failed",
    }, { status: 500 });
  }
}
