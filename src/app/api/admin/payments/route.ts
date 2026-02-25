import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        // Strict auth for admin panel
        const session = await getServerSession(authOptions);
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!session?.user || session.user.email !== adminEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payments = await prisma.payment.findMany({
            where: {
                status: 'PENDING'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ payments });
    } catch (error) {
        console.error("Failed to list pending payments", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
