"use client";

import { motion } from "framer-motion";
import { X, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    siteUrl: string;
}

export function ShareModal({ isOpen, onClose, siteUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(siteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareText = "I just generated a cinematic 3D website using AI in seconds. The future of web design is here. @ImmersaAI";

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md glass-panel bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-white/70" />
                </button>

                <div className="mb-6 pt-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                        <Share2Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Share your creation</h2>
                    <p className="text-white/60 text-sm">
                        Your cinematic experience is ready. Show the world what you built.
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 font-medium transition-colors"
                    >
                        <Twitter className="w-5 h-5" />
                        Share on Twitter
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 font-medium transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                        Share on LinkedIn
                    </a>
                </div>

                <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                    <div className="truncate text-sm text-white/50 font-mono flex-1 px-2">
                        {siteUrl}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function Share2Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
    );
}
