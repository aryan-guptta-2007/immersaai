"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const PHASES = [
    { id: 1, text: "Neural parsing directive..." },
    { id: 2, text: "Allocating WebGL Matrix..." },
    { id: 3, text: "Synthesizing spatial geometry..." },
    { id: 4, text: "Compiling PBR materials & shaders..." },
    { id: 5, text: "Applying semantic copywriting..." },
    { id: 6, text: "Constructing deployment package..." }
];

export function GenerationLoader() {
    const [currentPhase, setCurrentPhase] = useState(1);

    useEffect(() => {
        // Advance phase every 1.5 seconds to match approx 9s average API response time
        const interval = setInterval(() => {
            setCurrentPhase(prev => {
                if (prev < PHASES.length) return prev + 1;
                return prev;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 md:p-12 glass-panel bg-black/80 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full"
            >
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-mono text-white font-bold tracking-widest uppercase mb-2">Compiling Matrix</h3>
                    <p className="text-sm text-white/50 font-mono tracking-wider">sys.engine.build()</p>
                </div>

                <div className="space-y-4">
                    {PHASES.map((phase) => {
                        const isPast = currentPhase > phase.id;
                        const isCurrent = currentPhase === phase.id;
                        const isFuture = currentPhase < phase.id;

                        return (
                            <div key={phase.id} className="flex items-center gap-4 font-mono text-[10px] md:text-xs tracking-wider">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isPast ? 'border-primary/50 bg-primary/10' :
                                        isCurrent ? 'border-primary bg-primary/20' :
                                            'border-white/10 bg-black/50'
                                    } transition-colors duration-500`}>
                                    {isPast && <Check className="w-4 h-4 text-primary" />}
                                    {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />}
                                    {isFuture && <span className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                                </div>
                                <span className={
                                    isPast ? "text-white/40" :
                                        isCurrent ? "text-white font-bold max-w-full" :
                                            "text-white/20"
                                }>
                                    [PHASE 0{phase.id}] {phase.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentPhase / PHASES.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
