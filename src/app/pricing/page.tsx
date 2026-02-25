"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [hasPaid, setHasPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePaymentSubmit = async () => {
        if (!session) {
            alert("Please login first to upgrade.");
            router.push("/api/auth/signin");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/submit-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 999, tier: "PRO" })
            });

            if (res.ok) {
                setHasPaid(true);
            } else {
                alert("Failed to record payment. Please try again.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <Link href="/" className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors">
                &larr; Back home
            </Link>

            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">ImmersaAI <span className="text-primary">Pro</span></h1>
                <p className="text-xl text-white/50 max-w-xl mx-auto">Skip the 5/day limit. Get unlimited generations, premium cinematic environments, and full ownership for a one-time lifetime fee.</p>
            </div>

            {!hasPaid ? (
                <div className="glass-panel border-primary/50 relative overflow-hidden flex flex-col items-center max-w-lg w-full p-8 shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.3)]">
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

                    <div className="text-5xl font-bold mb-2">₹999</div>
                    <div className="text-white/50 mb-8 font-medium tracking-wide uppercase">Lifetime Access</div>

                    {/* Dynamic QR Implementation Mock */}
                    <div className="w-64 h-64 bg-zinc-800 mb-8 flex items-center justify-center rounded-2xl overflow-hidden relative shadow-2xl border border-white/10">
                        <div className="absolute inset-2 bg-white rounded-xl flex flex-col items-center justify-center p-4">
                            <span className="text-black font-extrabold text-xl mb-1 text-center leading-tight">SCAN TO PAY</span>
                            <span className="text-black/50 text-sm font-medium">Any UPI App</span>
                            {/* A real QR image would go here - using CSS placeholder for functionality */}
                            <div className="w-32 h-32 mt-2 bg-zinc-200 grid grid-cols-2 gap-1 p-1">
                                <div className="bg-black rounded-sm"></div><div className="bg-black/80 rounded-sm"></div>
                                <div className="bg-black/90 rounded-sm"></div><div className="bg-black/70 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePaymentSubmit}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : "I have paid via UPI"}
                    </button>

                    <div className="mt-6 text-sm text-white/40 text-center max-w-xs">
                        Click the button above only after you have successfully completed the scan and payment.
                    </div>
                </div>
            ) : (
                <div className="bg-green-500/10 text-green-400 p-12 rounded-3xl border border-green-500/20 text-center max-w-lg w-full flex flex-col items-center">
                    <CheckCircle2 className="w-20 h-20 mb-6 text-green-500" />
                    <h2 className="text-3xl font-bold mb-4 text-white">Payment Submitted!</h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-6">Our team is verifying your UPI payment. Your ImmersaAI account will be upgraded to Pro shortly.</p>
                    <Link href="/dashboard" className="px-6 py-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors font-medium">
                        Go to Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
}
