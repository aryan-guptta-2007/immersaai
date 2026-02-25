export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const { paymentId, action } = await req.json();

        if (!paymentId || !['APPROVE', 'REJECT'].includes(action)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!payment || !payment.userId) {
            return NextResponse.json({ error: "Not found or orphan payment" }, { status: 404 });
        }

        if (action === "APPROVE") {
            // 1. Mark payment success
            await prisma.payment.update({
                where: { id: paymentId },
                data: { status: "SUCCESS" }
            });

            // 2. Upgrade user to PRO (Core SaaS Logic)
            await prisma.user.update({
                where: { id: payment.userId },
                data: { plan: "pro" }
            });

            return NextResponse.json({ success: true, message: "User upgraded to Pro!" });
        }

        if (action === "REJECT") {
            await prisma.payment.update({
                where: { id: paymentId },
                data: { status: "REJECTED" }
            });
            return NextResponse.json({ success: true, message: "Payment rejected." });
        }

        return NextResponse.json({ success: false });

    } catch (e) {
        console.error("Saas Admin Approval Error:", e);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
