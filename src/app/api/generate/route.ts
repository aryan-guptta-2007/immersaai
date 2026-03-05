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

        const result = await model.generateContent(prompt);

        const text = result.response.text();

        return Response.json({
            theme: "cyber",
            headline: text,
            subheadline: text,
            features: [
                "AI Generated Design",
                "Interactive Animations",
                "Modern UI"
            ]
        });
    } catch (error) {
        console.error(error);

        return Response.json({
            success: false,
            error: "Generation failed",
        });
    }
}
