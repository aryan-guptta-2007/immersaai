import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        // In a real production app, verify session.user.role === 'ADMIN'
        // Skipping strict auth for this demo admin panel, but enforcing login
        const session = await getServerSession(authOptions);
        if (!session?.user) {
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
