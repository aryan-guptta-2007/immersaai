export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
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

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayCount = await prisma.generation.count({
            where: {
                userId: (session.user as any).id,
                createdAt: {
                    gte: todayStart,
                },
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id }
        });

        if (user?.plan !== "pro" && todayCount >= 5) {
            return NextResponse.json(
                { error: "Daily free limit reached. Upgrade to Pro." },
                { status: 403 }
            );
        }

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
