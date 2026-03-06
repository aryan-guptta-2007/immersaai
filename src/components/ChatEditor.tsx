"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, Loader2 } from "lucide-react";

export function ChatEditor({ onUpdateParams, isUpdating, currentContext }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!prompt.trim() || isUpdating) return;
        onUpdateParams(prompt, currentContext);
        setPrompt("");
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                >
                    <Sparkles className="w-6 h-6" />
                </motion.button>
            )}

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-6 left-6 z-50 w-[380px] rounded-2xl glass-panel border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-mono font-bold text-white uppercase tracking-widest">AI Live Editor</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat History Placeholder */}
                        <div className="flex-1 p-4 min-h-[250px] max-h-[400px] overflow-y-auto flex flex-col justify-end text-sm text-white/70 space-y-3 relative z-10">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 inline-block self-start max-w-[90%] font-light leading-relaxed">
                                I'm ready to modify your layout. Try telling me to: <br /><br />
                                <span className="text-primary cursor-pointer hover:underline block mb-2" onClick={() => setPrompt("Make the hero section darker and more cyberpunk")}>• "Make the hero section darker"</span>
                                <span className="text-primary cursor-pointer hover:underline block mb-2" onClick={() => setPrompt("Add a FAQ section to the bottom")}>• "Add a FAQ section"</span>
                                <span className="text-primary cursor-pointer hover:underline block" onClick={() => setPrompt("Change standard pricing to $99/mo")}>• "Change pricing to $99/mo"</span>
                            </div>
                        </div>

                        {/* AI compilation overlay */}
                        <div className="relative h-px w-full overflow-visible z-20">
                            <AnimatePresence>
                                {isUpdating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute bottom-0 w-full left-0 bg-primary/20 backdrop-blur-md border border-primary/20 py-2 px-4 flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
                                    >
                                        <Loader2 className="w-3 h-3 animate-spin" /> Compiling DOM updates...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-3 bg-black/50 relative z-30">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Message AI Editor..."
                                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-primary/50 text-sm pr-12 transition-colors disabled:opacity-50"
                                disabled={isUpdating}
                            />
                            <button
                                type="submit"
                                disabled={!prompt.trim() || isUpdating}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-primary disabled:text-white/20 transition-colors p-1"
                            >
                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin text-white/30" /> : <Send className="w-5 h-5" />}
                            </button>
                        </form>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
