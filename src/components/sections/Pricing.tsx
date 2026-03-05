"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Pricing() {
    const plans = [
        { name: "Starter", price: "Free", features: ["1 Project", "Basic Generation", "Community Support"] },
        { name: "Pro", price: "$29/mo", features: ["10 Projects", "Pro AI Models", "Priority Support", "Custom Brands"] },
        { name: "Enterprise", price: "Custom", features: ["Unlimited Storage", "Dedicated APIs", "24/7 Phone Support", "White-label"] }
    ];

    return (
        <section className="relative min-h-screen py-32 px-4 z-20 w-full bg-black/80">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-white/60 text-lg">Scale your growth without the friction.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`glass-panel p-8 rounded-3xl border ${i === 1 ? 'border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] bg-white/5' : 'border-white/10'}`}
                        >
                            {i === 1 && <div className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Most Popular</div>}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="text-4xl font-light text-white mb-8">{plan.price}</div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3 text-white/70">
                                        <Check className="w-4 h-4 text-primary" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-semibold transition-colors ${i === 1 ? 'bg-primary text-black hover:bg-primary/90' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                Choose {plan.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
