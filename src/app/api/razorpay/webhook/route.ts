import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error("CRITICAL: RAZORPAY_WEBHOOK_SECRET is not set in .env.local");
            // In development, might want to fail open or close. We should fail securely.
            return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
        }

        // Verify the signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(bodyText)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error("Webhook signature mismatch.");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(bodyText);

        // Handle the event
        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const paymentEntity = event.payload.payment.entity;
            const orderIdValue = paymentEntity.order_id;

            // We need to find the payment by orderId
            const paymentRecord = await prisma.payment.findUnique({
                where: { orderId: orderIdValue }
            });

            if (paymentRecord) {
                await prisma.payment.update({
                    where: { id: paymentRecord.id },
                    data: { status: 'SUCCESS' }
                });

                console.log(`Successfully verified Payment ${paymentRecord.orderId} via webhook.`);
            } else {
                console.warn(`Payment record for order ${orderIdValue} not found in database.`);
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
