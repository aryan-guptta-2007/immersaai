export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

// Simple in-memory rate limiter per Vercel instance
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
    try {
        // runtime imports
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
        });

        // Rate Limiting Logic
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const limitRecord = rateLimitMap.get(ip);

        if (limitRecord) {
            if (now > limitRecord.resetTime) {
                rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
            } else if (limitRecord.count >= LIMIT) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Try again tomorrow or upgrade.' },
                    { status: 429 }
                );
            } else {
                limitRecord.count += 1;
            }
        } else {
            rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        }

        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const systemPrompt = `You are the ImmersaAI core generation engine. 
You design cinematic WebGL website experiences based on user prompts.
You MUST respond with a perfectly formatted JSON object.

The JSON schema must be exactly this:
{
  "theme": "string, MUST BE EXACTLY ONE OF: cyber, luxury, neural, or default",
  "headline": "string, a very catchy, short marketing headline (max 6 words)",
  "subheadline": "string, actionable secondary text explaining the value proposition",
  "features": [
    { "title": "string, feature name", "description": "string, short compelling description" },
    { "title": "string, feature name", "description": "string, short compelling description" },
    { "title": "string, feature name", "description": "string, short compelling description" }
  ]
}

Ensure exactly 3 features are provided. Optimize for dramatic, high-end startup copy.`;

        let result;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Design a website experience for: ${prompt}` }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
            });

            const jsonString = response.choices[0].message.content;
            if (!jsonString) throw new Error("No content generated");

            const parsed = JSON.parse(jsonString);

            result = {
                theme: ['cyber', 'luxury', 'neural', 'default'].includes(parsed.theme) ? parsed.theme : 'default',
                headline: parsed.headline || "Digital Experience",
                subheadline: parsed.subheadline || "Welcome to the future.",
                features: parsed.features || []
            };
        } catch (error) {
            console.error("OpenAI Generation Failed:", error);
            // Fallback mock logic inline
            const p = prompt.toLowerCase();
            if (p.includes("cyber") || p.includes("security")) {
                result = {
                    theme: "cyber", headline: "Fortifying the Digital Frontier", subheadline: "Zero-trust infrastructure.",
                    features: [{ title: "Quantum Encryption", description: "Unhackable data pipelines." }, { title: "Zero-Trust", description: "Verify everything." }, { title: "Auto Response", description: "Neutralize anomalies." }]
                };
            } else {
                result = {
                    theme: "default", headline: "The Future of Digital Experience", subheadline: `Based on: "${prompt}"`,
                    features: [{ title: "Dynamic Architecture", description: "Serverless edge networks." }, { title: "Intelligent UX", description: "Predictive design patterns." }, { title: "Lightning Fast", description: "Sub-second load times." }]
                };
            }
        }

        // prisma save
        try {
            await prisma.generation.create({
                data: {
                    prompt,
                    theme: result.theme,
                    content: JSON.stringify(result),
                    userId: null,
                }
            });
        } catch (e) {
            console.error("Failed to log generation:", e);
        }

        return NextResponse.json(result);

    } catch (err) {
        console.error("Generation API Error:", err);
        return new Response("Error", { status: 500 });
    }
}
