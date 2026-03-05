export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const promptText = `
Generate a structured JSON website layout.

User request: ${prompt}

Return JSON in this format ONLY:

{
 "theme": "cyber",
 "headline": "string",
 "subheadline": "string",
 "features": [
   { "title": "string", "description": "string" }
 ]
}
`;

        const result = await model.generateContent(promptText);
        const text = result.response.text();

        // Clean markdown backticks if present before parsing
        const cleanedText = text.replace(/^```json\n|\n```$/g, '').trim();
        const data = JSON.parse(cleanedText);

        return Response.json(data);
    } catch (error) {
        console.error(error);

        return Response.json({
            success: false,
            error: "Generation failed",
        });
    }
}
