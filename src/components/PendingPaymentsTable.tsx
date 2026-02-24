"use client";

import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useState } from "react";

export function PendingPaymentsTable({ generations }: { generations: any[] }) {
    const [localGens, setLocalGens] = useState(generations);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        setIsProcessing(id);
        try {
            const res = await fetch('/api/admin/approve-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ generationId: id, action })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Action failed");
            }

            // Remove from list
            setLocalGens(prev => prev.filter(g => g.id !== id));
        } catch (error: any) {
            console.error(error);
            alert(`Failed: ${error.message}`);
        } finally {
            setIsProcessing(null);
        }
    };

    if (localGens.length === 0) return null;

    return (
        <div className="rounded-2xl border border-primary/50 bg-primary/5 overflow-hidden mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Pending Verifications
                </h2>
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-white/70">Requires Action</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/40 text-white/50">
                        <tr>
                            <th className="px-6 py-4 font-medium">Gen ID & Prompt</th>
                            <th className="px-6 py-4 font-medium">UPI Txn ID</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {localGens.map((gen) => (
                            <tr key={gen.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs text-primary mb-1">{gen.id.slice(0, 8)}...</div>
                                    <div className="text-white max-w-[200px] truncate" title={gen.prompt}>{gen.prompt}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-white/90 bg-black/50 px-3 py-1.5 rounded-md border border-white/10">
                                        {gen.upiTxnId || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleAction(gen.id, 'APPROVE')}
                                            disabled={isProcessing === gen.id}
                                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                            title="Approve"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(gen.id, 'REJECT')}
                                            disabled={isProcessing === gen.id}
                                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                            title="Reject"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
