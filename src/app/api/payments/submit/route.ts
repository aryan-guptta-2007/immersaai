import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized. Please login to purchase a license." }, { status: 401 });
        }

        const body = await req.json();
        const { upiTxnId, planRequested } = body;

        if (!upiTxnId || typeof upiTxnId !== 'string' || upiTxnId.length < 10) {
            return NextResponse.json({ error: "Invalid UPI Transaction ID. Must be at least 10 characters." }, { status: 400 });
        }

        if (!planRequested) {
            return NextResponse.json({ error: "No plan selected." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.plan === "PRO") {
            return NextResponse.json({ error: "You are already a PRO user." }, { status: 400 });
        }

        // Check if this UPI txn is already submitted
        const existingPayment = await prisma.payment.findUnique({
            where: { upiId: upiTxnId }
        });

        if (existingPayment) {
            return NextResponse.json({ error: "This UPI reference number has already been submitted." }, { status: 400 });
        }

        // Create the pending payment record
        const payment = await prisma.payment.create({
            data: {
                upiId: upiTxnId,
                amount: planRequested === 'PRO' ? 999 : 499, // simplified pricing mock
                planRequested: 'PRO', // Force PRO for any tier selection in this MVP 
                status: 'PENDING',
                userId: user.id
            }
        });

        return NextResponse.json({
            success: true,
            message: "Payment submitted. Access Node will be unlocked upon admin verification.",
            payment
        });

    } catch (error: any) {
        console.error("Submitting payment error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
