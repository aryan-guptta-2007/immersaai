"use client";

import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative py-12 px-4 bg-black border-t border-white/5 text-center z-20 w-full">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono text-sm tracking-widest uppercase">ImmersaAI Engine</span>
            </div>
            <div className="text-white/30 text-xs">
                © 2026 ImmersaAI Inc. All rights reserved. Generated via AI Blueprint.
            </div>
        </footer>
    );
}
