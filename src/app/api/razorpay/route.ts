import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

// Initialization moved inside POST to prevent Next.js static build errors

export async function POST(req: Request) {
    try {
        const { tier } = await req.json();

        // Mapping tiers to amount in paise
        const pricingMap: { [key: string]: number } = {
            'Student': 49900, // ₹499
            'Creator': 99900, // ₹999
            'Agency': 299900, // ₹2999
        };

        const amount = pricingMap[tier];

        if (!amount) {
            return NextResponse.json({ error: 'Invalid tier selected' }, { status: 400 });
        }

        // Check if keys are present (for helpful error message)
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.warn("Razorpay API Keys are missing in .env.local file.");
        }

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        });

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
