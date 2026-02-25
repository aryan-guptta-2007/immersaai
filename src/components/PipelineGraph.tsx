"use client";

import { motion } from "framer-motion";
import { Copy, Brain, Box, Rocket } from "lucide-react";

export function PipelineGraph() {
    const nodes = [
        { id: 'prompt', label: 'PROMPT', icon: Copy, delay: 0 },
        { id: 'brain', label: 'AI NEURAL CORE', icon: Brain, delay: 0.3 },
        { id: 'engine', label: 'WEBGL MATRIX', icon: Box, delay: 0.6 },
        { id: 'deploy', label: 'EDGE DEPLOY', icon: Rocket, delay: 0.9 },
    ];

    return (
        <div className="relative w-full max-w-5xl mx-auto py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-mono text-white font-bold uppercase tracking-widest mb-4">System Pipeline</h2>
                <div className="h-px w-24 bg-primary/50 mx-auto" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                {/* SVG Connection Lines */}
                <svg className="absolute inset-0 w-full h-full z-[-1] hidden md:block" style={{ pointerEvents: 'none' }}>
                    <motion.line
                        x1="10%" y1="50%" x2="90%" y2="50%"
                        stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4"
                    />
                    <motion.line
                        x1="10%" y1="50%" x2="90%" y2="50%"
                        stroke="var(--color-primary)" strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                    />
                </svg>

                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: node.delay }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex flex-col items-center relative group w-full md:w-auto mb-12 md:mb-0"
                    >
                        {/* Node circle */}
                        <div className="w-20 h-20 rounded-2xl glass-panel bg-black/80 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors z-10 relative">
                            {/* Inner pulse */}
                            <motion.div
                                className="absolute inset-0 bg-primary/20 rounded-2xl blur-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: node.delay }}
                            />
                            <node.icon className="w-8 h-8 text-white/70 group-hover:text-primary transition-colors z-10 relative" />
                        </div>

                        {/* Vertical line connecting node to label on mobile */}
                        <div className="h-8 w-px bg-white/10 md:hidden" />

                        {/* Label */}
                        <div className="mt-4 text-center">
                            <div className="text-xs font-mono text-white font-bold tracking-widest uppercase">{node.label}</div>
                            <div className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-wider">Node 0{i + 1} ACTIVE</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ambient Background glow for the whole pipeline */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-primary/5 blur-[100px] pointer-events-none" />
        </div>
    );
}
