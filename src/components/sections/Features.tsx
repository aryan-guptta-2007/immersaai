"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, Zap } from "lucide-react";

export function Features({ items }: any) {
    const icons = [Shield, Zap, Sparkles];

    return (
        <section className="relative min-h-screen py-32 px-4 z-20 w-full bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powerful Capabilities</h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">Discover the tools that will elevate your workflow.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(items || []).map((feature: any, i: number) => {
                        const Icon = icons[i % icons.length];
                        // If item is a string, use it. If it's an object, try to extract title/description
                        const title = typeof feature === 'string' ? feature : feature.title || 'Feature';
                        const desc = typeof feature === 'string' ? 'Experience the next generation functionality with our robust toolset engineered for scale.' : feature.description || 'Description goes here.';

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="glass-panel p-8 rounded-3xl hover:bg-white/[0.05] transition-colors duration-500 group border border-white/5"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 mb-6 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
                                <p className="text-white/60 font-light leading-relaxed">
                                    {desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
