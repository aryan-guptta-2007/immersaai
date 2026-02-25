export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

// Simple in-memory rate limiter per Vercel instance
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
    // 1. DYNAMICALLY IMPORT ORCHESTRATOR at runtime to prevent Next.js from evaluating OpenAI/Prisma at build time
    const { AIOrchestrator } = await import('@/lib/ai/orchestrator');
    const orchestrator = new AIOrchestrator('openai');

    try {
        // Rate Limiting Logic
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const limitRecord = rateLimitMap.get(ip);

        if (limitRecord) {
            if (now > limitRecord.resetTime) {
                // Window expired, reset
                rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
            } else if (limitRecord.count >= LIMIT) {
                // Rate limited
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Try again tomorrow or upgrade.' },
                    { status: 429 }
                );
            } else {
                // Increment count
                limitRecord.count += 1;
            }
        } else {
            // First request for this IP
            rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        }

        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Call our dynamically loaded server-side orchestrator
        const result = await orchestrator.generateExperience(prompt);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Generation API Error:", error);
        return NextResponse.json({ error: 'Failed to generate experience' }, { status: 500 });
    }
}
