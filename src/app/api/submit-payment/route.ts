export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, tier } = await req.json();

        // Create Payment record mapped directly to user
        await prisma.payment.create({
            data: {
                userId: (session.user as any).id,
                amount: amount,
                tier: tier,
                orderId: `UPI-SAAS-${Date.now()}`,
                status: "PENDING"
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Submit Payment Error:", e);
        return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }
}
