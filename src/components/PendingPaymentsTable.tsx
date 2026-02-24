"use client";

import { format } from "date-fns";
import { Check, X, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export function PendingPaymentsTable({ generations }: { generations: any[] }) {
    const [localGens, setLocalGens] = useState(generations);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUBMITTED' | 'SUCCESS'>('ALL');
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

    // Process: Filter & Sort
    const filteredAndSortedGens = useMemo(() => {
        let result = [...localGens];

        if (filterStatus !== 'ALL') {
            result = result.filter(g => g.paymentStatus === filterStatus);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(g =>
                (g.upiTxnId && g.upiTxnId.toLowerCase().includes(q)) ||
                g.id.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            // Fallback to generic timestamp if missing somehow
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return sortOrder === 'latest' ? timeB - timeA : timeA - timeB;
        });

        return result;
    }, [localGens, searchQuery, filterStatus, sortOrder]);

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

            // Update UI state
            if (action === 'APPROVE') {
                setLocalGens(prev => prev.map(g => g.id === id ? { ...g, paymentStatus: 'SUCCESS' } : g));
            } else {
                setLocalGens(prev => prev.filter(g => g.id !== id));
            }
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
            <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/5">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Verification Management
                    </h2>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-white/70">{filteredAndSortedGens.length} results</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search Txn ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors w-40 md:w-48 font-mono"
                        />
                    </div>

                    {/* Filter Status */}
                    <div className="relative">
                        <Filter className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="bg-black/50 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                        >
                            <option value="ALL">All Status</option>
                            <option value="SUBMITTED">Pending Checks</option>
                            <option value="SUCCESS">Approved</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/40 text-white/50">
                        <tr>
                            <th className="px-6 py-4 font-medium">Gen ID & Prompt</th>
                            <th className="px-6 py-4 font-medium">UPI Txn ID</th>
                            <th className="px-6 py-4 font-medium">Status / Time</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredAndSortedGens.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-white/50">No payments found matching the criteria.</td>
                            </tr>
                        ) : (
                            filteredAndSortedGens.map((gen) => (
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
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {gen.paymentStatus === 'SUCCESS' ? (
                                                <span className="text-green-400 text-xs font-semibold bg-green-500/10 px-2 py-0.5 rounded w-max">APPROVED</span>
                                            ) : (
                                                <span className="text-yellow-400 text-xs font-semibold bg-yellow-500/10 px-2 py-0.5 rounded w-max">PENDING</span>
                                            )}
                                            {gen.createdAt && <span className="text-xs text-white/40">{format(new Date(gen.createdAt), 'MMM d, HH:mm')}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {gen.paymentStatus !== 'SUCCESS' && (
                                                <button
                                                    onClick={() => handleAction(gen.id, 'APPROVE')}
                                                    disabled={isProcessing === gen.id}
                                                    className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                                    title="Approve & Unlock"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
