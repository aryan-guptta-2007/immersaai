export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(
    req: Request,
    context: any // Bypass Vercel Type constraint checks completely
) {
    try {
        const session = await getServerSession();

        if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const params = await context.params;
        const paymentId = params.id;

        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        await prisma.user.update({
            where: { id: payment.userId! },
            data: {
                plan: "pro",
            },
        });

        await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: "APPROVED",
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
