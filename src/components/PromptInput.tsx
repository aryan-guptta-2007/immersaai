"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    isGenerating: boolean;
}

export function PromptInput({ onSubmit, isGenerating }: PromptInputProps) {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isGenerating) {
            onSubmit(prompt);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-3xl mx-auto z-20 group"
        >
            <div className="relative flex flex-col md:flex-row items-center glass-panel bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden p-2 transition-all duration-300 focus-within:border-white/30 focus-within:bg-black w-full">

                <div className="flex items-center w-full px-4 py-2">
                    <span className="text-primary font-mono mr-4">&gt;</span>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isGenerating}
                        placeholder="ENTER DIRECTIVE: e.g. Quantum stealth startup..."
                        className="w-full bg-transparent border-none text-white placeholder-white/20 text-lg md:text-xl focus:outline-none disabled:opacity-50 font-mono tracking-wide"
                        autoFocus
                    />
                </div>

                <div className="w-full md:w-auto px-2 pb-2 md:pb-0 md:px-0 mt-2 md:mt-0 flex justify-end">
                    <button
                        type="submit"
                        disabled={isGenerating || !prompt.trim()}
                        className={cn(
                            "flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-6 py-3 font-mono text-sm tracking-widest transition-all duration-300 whitespace-nowrap",
                            "active:scale-[0.98]",
                            "disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed group-focus-within:border-white/30",
                            isGenerating && "border-primary/50 text-primary"
                        )}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                COMPILING...
                            </>
                        ) : (
                            "[ INITIALIZE BUILD ]"
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-widest">
                <span>Memory alloc: 1024MB</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ENGINE ONLINE</span>
            </div>
        </motion.form>
    );
}
