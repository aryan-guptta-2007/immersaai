"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Copy, Terminal } from "lucide-react";

export function LiveHeroRender({ activePrompt }: { activePrompt: string }) {
    const [renderLines, setRenderLines] = useState<string[]>([]);

    // Simulate real-time rendering logs based on prompt length/typing
    useEffect(() => {
        if (!activePrompt) {
            setRenderLines(["AWAITING SYSTEM DIRECTIVE..."]);
            return;
        }

        const logs = [
            `> INITIALIZING WebGL CONTEXT`,
            `> ALLOCATING SCENE GRAPH MEMORY: 512MB`,
            `> PARSING PARAMS: "${activePrompt.substring(0, 20)}..."`,
            `> GENERATING GEOMETRY MESHES`,
            `> COMPILING SHADERS [SUCCESS]`,
            `> APPLYING PBR MATERIALS & LIGHTING`,
            `> RENDER PIPELINE ACTIVE. V-SYNC ON.`
        ];

        // Based on prompt length, show more logs
        const linesToShow = Math.min(Math.floor(activePrompt.length / 5), logs.length);

        if (linesToShow > 0) {
            setRenderLines(logs.slice(0, linesToShow));
        } else {
            setRenderLines([`> SYSTEM LISTENING...`]);
        }

    }, [activePrompt]);

    return (
        <div className="w-full absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none overflow-hidden">
            {/* Massive background render wireframe simulation */}
            <motion.div
                className="w-[120%] h-[120%] border border-primary/20 rounded-full md:rounded-[40px] flex items-center justify-center relative"
                animate={{
                    rotate: activePrompt.length > 0 ? [0, 90] : 0,
                    scale: activePrompt.length > 0 ? 1.05 : 1
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {/* Concentric rings to look like a spatial engine */}
                <div className="absolute inset-10 border border-primary/10 rounded-full md:rounded-[40px]" />
                <div className="absolute inset-20 border border-primary/10 rounded-full md:rounded-[40px]" />
                <div className="absolute inset-32 border border-primary/10 rounded-full md:rounded-[40px]" />

                {/* Center glowing focal point */}
                <motion.div
                    className="w-32 h-32 bg-primary/20 rounded-full blur-3xl"
                    animate={{
                        scale: activePrompt.length > 5 ? [1, 1.5, 1] : 1,
                        opacity: activePrompt.length > 5 ? 0.8 : 0.3
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Live Terminal HUD overlay on top of wireframes */}
            <div className="absolute left-8 bottom-8 md:bottom-24 z-10 hidden md:block">
                <div className="glass-panel p-4 rounded-xl border border-white/5 w-64 h-48 flex flex-col justify-end bg-black/60 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-auto border-b border-white/10 pb-2 mb-2">
                        <Terminal className="w-3 h-3 text-primary" />
                        <span className="text-[10px] uppercase font-mono text-white/50 tracking-widest">LIVE RENDER NODE</span>
                    </div>
                    <div className="flex flex-col gap-1 font-mono text-[10px] text-white/70 overflow-hidden">
                        {renderLines.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {line}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
