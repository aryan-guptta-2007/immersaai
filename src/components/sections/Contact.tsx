"use client";

import { motion } from "framer-motion";

export function Contact() {
    return (
        <section className="relative py-32 px-4 z-20 w-full bg-black">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="glass-panel p-12 rounded-3xl border border-white/10 bg-white/[0.03]"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to accelerate?</h2>
                    <p className="text-white/60 mb-8 max-w-xl mx-auto">Join thousands of developers building the future. Let's talk about your use case.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-6 py-4 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-primary transition-colors min-w-[300px]"
                        />
                        <button className="px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                            Get an Invite
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
