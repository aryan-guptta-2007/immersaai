"use client";

import { motion } from "framer-motion";

export function Hero({ headline, subheadline, cta }: any) {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 z-10 w-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-white drop-shadow-lg">
                    {headline}
                </h1>

                <p className="text-xl md:text-2xl text-white/70 font-light mb-12 max-w-3xl mx-auto drop-shadow">
                    {subheadline}
                </p>

                <div className="flex items-center justify-center gap-4">
                    <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        {cta || "Get Started"}
                    </button>
                    <button className="px-8 py-4 rounded-full glass-panel text-white font-semibold text-lg hover:bg-white/10 transition-colors duration-300 border border-white/20">
                        Learn More
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
