export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Runtime-only memory store
        const rateLimitMap =
            (global as any).__rateLimitMap ||
            ((global as any).__rateLimitMap = new Map());

        const LIMIT = 5;
        const WINDOW_MS = 24 * 60 * 60 * 1000;

        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const now = Date.now();

        const limitRecord = rateLimitMap.get(ip);

        if (limitRecord) {
            if (now > limitRecord.resetTime) {
                rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
            } else if (limitRecord.count >= LIMIT) {
                return NextResponse.json(
                    { error: "Rate limit exceeded." },
                    { status: 429 }
                );
            } else {
                limitRecord.count += 1;
            }
        } else {
            rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        }

        // Runtime imports
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
        });

        // Auth Check
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
        const session = await getServerSession(authOptions);

        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt required" },
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Return JSON only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const parsed = JSON.parse(
            response.choices[0].message.content || "{}"
        );

        await prisma.generation.create({
            data: {
                prompt,
                theme: parsed.theme || "default",
                content: JSON.stringify(parsed),
                userId: (session?.user as any)?.id || null,
            },
        });

        return NextResponse.json(parsed);

    } catch (err) {
        console.error(err);
        return new Response("Error", { status: 500 });
    }
}
