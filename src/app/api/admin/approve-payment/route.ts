export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
        const { generationId, action } = await req.json();

        if (!generationId || !['APPROVE', 'REJECT'].includes(action)) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
        }

        const generation = await prisma.generation.findUnique({
            where: { id: generationId }
        });

        if (!generation) {
            return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
        }

        if (action === 'APPROVE') {
            await prisma.generation.update({
                where: { id: generationId },
                data: { paymentStatus: 'SUCCESS' }
            });
            return NextResponse.json({ success: true, message: 'Payment approved.' });
        }

        if (action === 'REJECT') {
            await prisma.generation.update({
                where: { id: generationId },
                data: { paymentStatus: 'REJECTED' } // Or revert to PENDING depending on logic
            });
            return NextResponse.json({ success: true, message: 'Payment rejected.' });
        }

    } catch (error: any) {
        console.error("Admin Approval Error:", error);
        return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 });
    }
}
