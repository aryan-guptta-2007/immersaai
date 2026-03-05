export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Runtime imports
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(`System: Return JSON only.\n\nUser: ${prompt}`);

        const parsed = JSON.parse(
            result.response.text() || "{}"
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
