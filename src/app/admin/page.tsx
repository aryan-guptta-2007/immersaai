"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Payment {
    id: string;
    upiId: string;
    amount: number;
    planRequested: string;
    status: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    } | null;
}

export default function AdminDashboard() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState<string | null>(null);

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!session?.user?.email || session.user.email !== adminEmail) {
            router.push("/");
            return;
        }

        fetchPayments();
    }, [session, status, router]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            if (data.payments) {
                setPayments(data.payments);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            if (data.payments) {
                setPayments(data.payments);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

        setIsActioning(id);
        try {
            const res = await fetch(`/api/admin/approve/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });

            const data = await res.json();
            if (res.ok) {
                // Remove the actioned payment from the list
                setPayments(prev => prev.filter(p => p.id !== id));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to process action");
        } finally {
            setIsActioning(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono p-8 md:p-16">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">SysAdmin / Payments Queue</h1>
                        <p className="text-white/50 text-sm">Review manual UPI submissions to unlock Access Nodes.</p>
                    </div>
                    <button
                        onClick={fetchPayments}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Matrix
                    </button>
                </header>

                <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                                    <th className="px-6 py-4 font-normal">Timestamp</th>
                                    <th className="px-6 py-4 font-normal">User</th>
                                    <th className="px-6 py-4 font-normal">Requested Node</th>
                                    <th className="px-6 py-4 font-normal">UPI Txn ID</th>
                                    <th className="px-6 py-4 font-normal text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                                            Scanning for pending transactions...
                                        </td>
                                    </tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                                            No pending payments in the queue.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-sm text-white/60">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-yellow-500" />
                                                    {new Date(payment.createdAt).toLocaleTimeString()}
                                                </div>
                                                <div className="text-[10px] text-white/30 mt-1">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium">{payment.user?.email || 'Unknown User'}</div>
                                                <div className="text-xs text-white/40">{payment.user?.name || ''}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold font-sans tracking-wide">
                                                    {payment.planRequested} (₹{payment.amount})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-sm text-white/80 bg-black px-2 py-1 rounded border border-white/10">
                                                    {payment.upiId}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(payment.id, 'REJECT')}
                                                        disabled={isActioning === payment.id}
                                                        className="p-2 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                                        title="Reject Payment"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(payment.id, 'APPROVE')}
                                                        disabled={isActioning === payment.id}
                                                        className="flex items-center gap-2 px-4 py-2 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Unlock Node
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
