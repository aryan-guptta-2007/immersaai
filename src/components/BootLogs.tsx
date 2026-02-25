"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_LOGS = [
    "ImmersaAI Engine v2.4 booting...",
    "Allocating distributed render nodes...",
    "Initializing WebGL context...",
    "Mapping neural prompt pathways...",
    "AI Core matrix online.",
    "System ready. Awaiting vision."
];

export function BootLogs() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < INITIAL_LOGS.length) {
                setLogs(prev => [...prev, INITIAL_LOGS[currentStep]]);
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 400); // 400ms delay between log lines

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1 text-[10px] md:text-xs font-mono text-white/40">
            <AnimatePresence>
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-2 ${i === INITIAL_LOGS.length - 1 ? "text-primary font-bold drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]" : ""
                            }`}
                    >
                        <span>&gt;</span>
                        <span>{log}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
