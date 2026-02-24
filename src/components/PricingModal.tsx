"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Check, QrCode } from "lucide-react";
import { useState } from "react";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionType: 'export' | 'deploy';
    generationId?: string;
}

export function PricingModal({ isOpen, onClose, actionType, generationId }: PricingModalProps) {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [upiTxnId, setUpiTxnId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen) return null;

    const pricingMap: Record<string, number> = {
        'Student': 499,
        'Creator': 999,
        'Agency': 2999
    };

    const handleSelectTier = (tier: string) => {
        setSelectedTier(tier);
    };

    const handleSubmitUpi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!upiTxnId || upiTxnId.length < 10) {
            alert("Please enter a valid UPI Transaction ID (usually 12 digits).");
            return;
        }

        if (!generationId) {
            alert("No active generation found to link this payment to.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/submit-upi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    generationId,
                    upiTxnId,
                    tier: selectedTier
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'EXPIRED') {
                    alert("⚠️ This generation link has expired (24h limit) to maintain system hygiene. Please click Regenerate to continue.");
                    onClose();
                    return;
                }
                throw new Error(data.error || "Submission failed");
            }

            setSuccessMessage("SUCCESS");
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseWrapper = () => {
        setSelectedTier(null);
        setUpiTxnId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseWrapper}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-4xl glass-panel bg-black/90 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <button
                    onClick={handleCloseWrapper}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                    {!selectedTier ? (
                        <motion.div
                            key="pricing-grid"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="p-8 md:p-12 text-center border-b border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 relative z-10">
                                    Unlock Production {actionType === 'export' ? 'Export' : 'Deploy'}
                                </h2>
                                <p className="text-white/60 text-lg max-w-xl mx-auto relative z-10">
                                    Your cinematic experience is ready. Choose a tier to download the full React/Three.js codebase.
                                </p>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/40">
                                {/* Student */}
                                <div className="rounded-2xl border border-white/10 p-6 flex flex-col hover:border-white/20 transition-colors bg-white/5">
                                    <h3 className="font-medium text-lg mb-1">Student</h3>
                                    <div className="text-3xl font-bold mb-6">₹499<span className="text-sm font-normal text-white/50">/export</span></div>
                                    <ul className="flex-1 space-y-3 mb-6 text-sm text-white/70">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Full Source Code</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Basic 3D Assets</li>
                                        <li className="flex gap-2 opacity-50"><Check className="w-4 h-4 text-primary shrink-0" /> ImmersaAI Watermark</li>
                                    </ul>
                                    <button
                                        onClick={() => handleSelectTier('Student')}
                                        className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/10 font-medium transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        Select Student
                                    </button>
                                </div>

                                {/* Creator */}
                                <div className="rounded-2xl border border-primary/50 relative p-6 flex flex-col bg-primary/5">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                                    <h3 className="font-medium text-lg mb-1 text-primary-glow">Creator</h3>
                                    <div className="text-3xl font-bold mb-6">₹999<span className="text-sm font-normal text-white/50">/export</span></div>
                                    <ul className="flex-1 space-y-3 mb-6 text-sm text-white/90">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Everything in Student</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Premium 3D Environments</li>
                                        <li className="flex gap-2"><Sparkles className="w-4 h-4 text-primary shrink-0" /> No Watermark</li>
                                    </ul>
                                    <button
                                        onClick={() => handleSelectTier('Creator')}
                                        className="w-full py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        Select Creator
                                    </button>
                                </div>

                                {/* Agency */}
                                <div className="rounded-2xl border border-white/10 p-6 flex flex-col hover:border-white/20 transition-colors bg-white/5">
                                    <h3 className="font-medium text-lg mb-1">Agency Pro</h3>
                                    <div className="text-3xl font-bold mb-6">₹2999<span className="text-sm font-normal text-white/50">/export</span></div>
                                    <ul className="flex-1 space-y-3 mb-6 text-sm text-white/70">
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Multi-Domain Deploy</li>
                                        <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Commercial Resell License</li>
                                    </ul>
                                    <button
                                        onClick={() => handleSelectTier('Agency')}
                                        className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/10 font-medium transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        Select Agency
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upi-flow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="p-8 md:p-12 border-b border-white/5 relative overflow-hidden flex flex-col items-center">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                                {successMessage ? (
                                    <div className="text-center py-12 px-6">
                                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            <Check className="w-10 h-10 text-primary" />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">Payment Under Review</h2>
                                        <p className="text-white/80 text-lg mb-2">Approval typically takes 5–30 minutes.</p>
                                        <p className="text-white/60 mb-8">You will receive access to your unlock once approved by our team.</p>
                                        <button onClick={onClose} className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium border border-white/20">
                                            Return to Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-md mx-auto relative z-10">
                                        <button
                                            onClick={() => setSelectedTier(null)}
                                            className="text-xs text-white/40 hover:text-white mb-6 uppercase tracking-wider flex items-center transition-colors"
                                        >
                                            ← Back to Tiers
                                        </button>

                                        <div className="text-center mb-8">
                                            <h2 className="text-3xl font-bold mb-2">Pay via UPI</h2>
                                            <p className="text-white/60">Scan the QR code below to pay <span className="text-white font-medium">₹{pricingMap[selectedTier]}</span> for the {selectedTier} license.</p>
                                        </div>

                                        <div className="bg-white p-4 rounded-2xl aspect-square mb-8 mx-auto w-48 flex items-center justify-center relative overflow-hidden group">
                                            <img
                                                src="/upi-qr.png"
                                                alt="UPI QR Code"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="text-center mb-8">
                                            <div className="text-sm text-white/40 uppercase tracking-widest mb-1">UPI ID</div>
                                            <div className="text-xl font-mono text-primary-glow">7852826909@mbk</div>
                                        </div>

                                        <form onSubmit={handleSubmitUpi} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-white/80 mb-2">UPI Transaction / Reference ID</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={upiTxnId}
                                                    onChange={e => setUpiTxnId(e.target.value)}
                                                    placeholder="Enter 12-digit Ref No."
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-3.5 rounded-xl bg-white text-black font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                ) : (
                                                    "Submit Payment for Verification"
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
