"use client";

import { motion } from "framer-motion";
import { Sparkles, X, Check, ArrowRight } from "lucide-react";
import { useState } from "react";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionType: 'export' | 'deploy';
}

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export function PricingModal({ isOpen, onClose, actionType }: PricingModalProps) {
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSelectTier = async (tier: string) => {
        setIsProcessing(tier);

        const res = await loadRazorpay();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you offline?");
            setIsProcessing(null);
            return;
        }

        try {
            const data = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier }),
            }).then((t) => t.json());

            if (data.error) {
                alert(data.error);
                setIsProcessing(null);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: data.amount,
                currency: data.currency,
                name: "ImmersaAI",
                description: `${tier} License - Production Export`,
                order_id: data.id,
                handler: function (response: any) {
                    console.log("Payment Successful", response);
                    alert(`Payment Successful! Ready to ${actionType}.`);
                    setIsProcessing(null);
                    onClose();
                },
                prefill: {
                    name: "Creator",
                    email: "creator@example.com",
                },
                theme: {
                    color: "#0a0a0a",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(null);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                alert("Payment Failed. Reason: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment flow error:", error);
            alert("An error occurred starting the payment process.");
            setIsProcessing(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-4xl glass-panel bg-black/80 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-12 text-center border-b border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 relative z-10">
                        Unlock Production {actionType === 'export' ? 'Export' : 'Deploy'}
                    </h2>
                    <p className="text-white/60 text-lg max-w-xl mx-auto relative z-10">
                        Your cinematic experience is ready. Choose a tier to download the full React/Three.js codebase or deploy live to a custom domain.
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
                            {isProcessing === 'Student' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Select Student'}
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
                            <li className="flex gap-2"><Sparkles className="w-4 h-4 text-primary shrink-0" /> 1-Click Vercel Deploy</li>
                        </ul>
                        <button
                            onClick={() => handleSelectTier('Creator')}
                            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            {isProcessing === 'Creator' ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Select Creator'}
                        </button>
                    </div>

                    {/* Agency */}
                    <div className="rounded-2xl border border-white/10 p-6 flex flex-col hover:border-white/20 transition-colors bg-white/5">
                        <h3 className="font-medium text-lg mb-1">Agency Pro</h3>
                        <div className="text-3xl font-bold mb-6">₹2999<span className="text-sm font-normal text-white/50">/export</span></div>
                        <ul className="flex-1 space-y-3 mb-6 text-sm text-white/70">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Multi-Domain Deploy</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Custom Architecture</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" /> Commercial Resell License</li>
                        </ul>
                        <button
                            onClick={() => handleSelectTier('Agency')}
                            className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/10 font-medium transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            {isProcessing === 'Agency' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Select Agency'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
