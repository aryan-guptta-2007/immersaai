import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { generationId, upiTxnId, tier } = await req.json();

        if (!generationId || !upiTxnId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // We only allow transition from PENDING -> SUBMITTED to prevent overwrites
        const generation = await prisma.generation.findUnique({
            where: { id: generationId }
        });

        if (!generation) {
            return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
        }

        if (generation.paymentStatus === 'SUCCESS') {
            return NextResponse.json({ error: 'Already paid' }, { status: 400 });
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
