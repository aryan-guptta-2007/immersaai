import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!session?.user || session.user.email !== adminEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const paymentId = params.id;
        const body = await req.json();
        const { action } = body; // "APPROVE" or "REJECT"

        if (!['APPROVE', 'REJECT'].includes(action)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!payment) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        if (payment.status !== 'PENDING') {
            return NextResponse.json({ error: `Payment is already ${payment.status}` }, { status: 400 });
        }

        if (action === 'APPROVE') {
            // Update payment and upgrade user account in a transaction
            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: paymentId },
                    data: { status: 'APPROVED' }
                }),
                // @ts-ignore: Prisma client caches previous schema, but 'plan' exists in DB
                prisma.user.update({
                    where: { id: payment.userId! },
                    data: { plan: 'PRO' } // Upgrade to unlocked plan
                })
            ]);
            return NextResponse.json({ success: true, message: "Payment approved and user upgraded to PRO." });
        } else {
            // Reject payment
            await prisma.payment.update({
                where: { id: paymentId },
                data: { status: 'REJECTED' }
            });
            return NextResponse.json({ success: true, message: "Payment rejected." });
        }

    } catch (error) {
        console.error("Failed to process payment approval", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
