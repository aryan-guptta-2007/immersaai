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
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />

            <div className="relative flex items-center glass-panel rounded-2xl overflow-hidden p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
                <div className="pl-4 pr-2">
                    {isGenerating ? (
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    ) : (
                        <Sparkles className="w-6 h-6 text-primary" />
                    )}
                </div>

                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    placeholder="Describe your brand, product or startup..."
                    className="w-full bg-transparent border-none text-white placeholder-white/40 text-lg md:text-xl py-4 focus:outline-none disabled:opacity-50 font-light"
                />

                <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                    className={cn(
                        "ml-2 flex items-center justify-center bg-white text-black rounded-xl px-6 py-4 font-medium transition-all duration-300",
                        "hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]",
                        "disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                    )}
                >
                    {isGenerating ? "Generating" : "Generate"}
                    {!isGenerating && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-xs font-mono text-white/40">
                <span>Try: "Futuristic cybersecurity startup with neon UI"</span>
            </div>
        </motion.form>
    );
}
