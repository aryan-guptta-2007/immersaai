export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
        const { generationId, upiTxnId, tier } = await req.json();

        if (!generationId || !upiTxnId || upiTxnId.length < 10) {
            return NextResponse.json({ error: 'Invalid UPI Transaction ID. Must be at least 10 characters.' }, { status: 400 });
        }

        const generation = await prisma.generation.findUnique({
            where: { id: generationId }
        });

        if (!generation) {
            return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
        }

        // 1. Fraud Protection: Cannot resubmit if already SUBMITTED or SUCCESS
        if (generation.paymentStatus !== 'PENDING') {
            return NextResponse.json({ error: 'This generation has already been submitted for payment or is already approved.' }, { status: 400 });
        }

        // 2. Expiry Protection: 24-hour limit
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        if (new Date().getTime() - new Date(generation.createdAt).getTime() > ONE_DAY_MS) {
            // We can pass a specific error code so the frontend knows to trigger a regenerate flow
            return NextResponse.json({ error: 'EXPIRED', message: 'This generation link has expired (24h limit). Please regenerate.' }, { status: 400 });
        }

        // Update the generation record indicating UPI is submitted for admin review
        await prisma.generation.update({
            where: { id: generationId },
            data: {
                paymentStatus: 'SUBMITTED',
                upiTxnId: upiTxnId
            }
        });

        return NextResponse.json({ success: true, message: 'UPI transaction submitted for review' });

    } catch (error: any) {
        console.error("Submit UPI Error:", error);
        return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 });
    }
}
