"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Testimonials() {
    const reviews = [
        { name: "Sarah J.", role: "CTO", text: "This platform completely revolutionized the way we handle our infrastructure." },
        { name: "Michael T.", role: "Lead Dev", text: "Incredible speed. We went from ideation to production in under a week." },
        { name: "Elena R.", role: "Founder", text: "The AI integrations are seamless. Best developer experience I've had all year." }
    ];

    return (
        <section className="relative py-32 px-4 z-20 w-full bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Loved by Builders</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-primary fill-primary" />)}
                            </div>
                            <p className="text-white/80 text-lg mb-8 font-light italic">"{review.text}"</p>
                            <div>
                                <div className="font-bold text-white">{review.name}</div>
                                <div className="text-white/40 text-sm">{review.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
