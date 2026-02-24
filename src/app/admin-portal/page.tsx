import prisma from "@/lib/db";
import { format } from "date-fns";
import { CreditCard, Zap, Users as UsersIcon } from "lucide-react";
import { PendingPaymentsTable } from "@/components/PendingPaymentsTable";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch initial stats
    const totalGenerations = await prisma.generation.count();
    const totalUsers = await prisma.user.count();

    // Sum revenue
    const payments = await prisma.payment.findMany({ where: { status: 'SUCCESS' } });
    const totalRevenuePaise = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalRevenueINR = totalRevenuePaise / 100;

    // Recent generations
    const recentGenerations = await prisma.generation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    // Pending Payments (Now includes both states for filtering)
    const pendingPayments = await prisma.generation.findMany({
        where: {
            paymentStatus: { in: ['SUBMITTED', 'SUCCESS'] }
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            prompt: true,
            upiTxnId: true,
            paymentStatus: true,
            createdAt: true
        }
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-zinc-400">
                        <CreditCard className="w-5 h-5" />
                        <h3 className="font-medium">Total Revenue</h3>
                    </div>
                    <p className="text-4xl font-bold tracking-tight font-mono text-white">
                        ₹{totalRevenueINR.toLocaleString()}
                    </p>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-zinc-400">
                        <Zap className="w-5 h-5 text-accent" />
                        <h3 className="font-medium">Websites Generated</h3>
                    </div>
                    <p className="text-4xl font-bold tracking-tight font-mono text-white">
                        {totalGenerations.toLocaleString()}
                    </p>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-zinc-400">
                        <UsersIcon className="w-5 h-5 text-primary" />
                        <h3 className="font-medium">Total Users</h3>
                    </div>
                    <p className="text-4xl font-bold tracking-tight font-mono text-white">
                        {totalUsers.toLocaleString()}
                    </p>
                </div>
            </div>

            <PendingPaymentsTable generations={pendingPayments} />

            {/* Recent Activity Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white">Recent Generations (Data Ownership)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-950/50 text-zinc-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Prompt Idea</th>
                                <th className="px-6 py-4 font-medium">Theme</th>
                                <th className="px-6 py-4 font-medium text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {recentGenerations.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                                        No generations yet.
                                    </td>
                                </tr>
                            ) : (
                                recentGenerations.map((gen) => (
                                    <tr key={gen.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4 text-zinc-300 max-w-xs truncate">{gen.prompt}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
                                                {gen.theme}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-zinc-500 font-mono text-xs">
                                            {format(new Date(gen.createdAt), 'MMM d, HH:mm')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
