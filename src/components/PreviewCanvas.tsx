"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Download, Share2, RefreshCw, Rocket, Sparkles } from "lucide-react";
import { Background3D } from "./Background3D";
import { useRef, useState } from "react";
import { PricingModal } from "./PricingModal";
import { ShareModal } from "./ShareModal";
import { useSession } from "next-auth/react";

export interface BrandContext {
    theme: 'cyber' | 'neural' | 'luxury' | 'default';
    headline: string;
    subheadline: string;
    features: { title: string; description: string }[];
}

interface PreviewCanvasProps {
    prompt: string;
    brandContext: BrandContext;
    generationId?: string;
    onRegenerate: () => void;
    onRegenerateStyle: (theme: BrandContext['theme']) => void;
}

export function PreviewCanvas({ prompt, brandContext, generationId, onRegenerate, onRegenerateStyle }: PreviewCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [showPricing, setShowPricing] = useState(false);
    const [pricingAction, setPricingAction] = useState<'export' | 'deploy'>('export');
    const [showShare, setShowShare] = useState(false);
    const { data: session } = useSession();

    // Cinematic Parallax Scroll Logic
    const { scrollYProgress } = useScroll({
        container: containerRef,
    });

    // Fade out hero text quickly when scrolling
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    // Slight zoom out of hero text
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    // Darken background slightly to reveal features
    const featuresBgColor = useTransform(scrollYProgress, [0.1, 0.3], ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]);

    const [showExportSuccess, setShowExportSuccess] = useState(false);

    const handleExport = () => {
        if ((session?.user as any)?.plan === "PRO") {
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 5000); // Auto-hide after 5s
            return;
        }
        setPricingAction('export');
        setShowPricing(true);
    };

    const handleDeploy = () => {
        if ((session?.user as any)?.plan === "PRO") {
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 5000);
            return;
        }
        setPricingAction('deploy');
        setShowPricing(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col"
        >
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                actionType={pricingAction}
                generationId={generationId}
            />
            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                siteUrl="https://immersa.ai/site/preview-demo"
            />

            {/* Post-Purchase / Pro Action Success Overlay */}
            <AnimatePresence>
                {showExportSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] glass-panel px-8 py-6 rounded-2xl border border-primary/30 flex items-center justify-center flex-col shadow-[0_20px_60px_rgba(var(--primary-rgb),0.2)] bg-black/90 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Creator Engine Activated.</h3>
                        <p className="text-sm font-mono text-white/50 mb-6 uppercase tracking-widest">Welcome to PRO Mode.</p>

                        <div className="flex items-center gap-3 w-full bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="w-8 h-8 rounded bg-black/50 flex items-center justify-center border border-white/5">
                                <Rocket className="w-4 h-4 text-white/70" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-white/40 font-mono tracking-wider mb-1">Compiling React Bundle...</div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 4.5, ease: "linear" }}
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-black/90 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-2xl"
            >
                {/* Left Side: System Context */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                        <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                            <div className="w-3 h-3 rounded-sm bg-black" />
                        </div>
                        <span className="text-sm font-bold tracking-tight uppercase text-white">SYS._NODE</span>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest mb-0.5">Active Directive</span>
                        <span className="text-xs text-white/80 font-mono truncate max-w-[300px]">{prompt}</span>
                    </div>
                </div>

                {/* Right Side: Actions & Theme Config */}
                <div className="flex items-center gap-4">
                    {/* Integrated Theme Toggle */}
                    <div className="hidden lg:flex items-center bg-white/5 rounded-lg p-1 border border-white/10 mr-4">
                        {(['default', 'cyber', 'luxury', 'neural'] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => onRegenerateStyle(theme)}
                                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest transition-all ${brandContext.theme === theme
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {theme === 'default' ? 'Modern' : theme}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-white/10 hidden md:block mr-2" />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRegenerate}
                            title="Reroll Generation"
                            className="p-2 rounded-md bg-transparent hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowShare(true)}
                            title="Share Node"
                            className="p-2 rounded-md bg-transparent hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs text-white font-mono uppercase tracking-widest"
                        >
                            <Download className="w-3 h-3" />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button
                            onClick={handleDeploy}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary hover:bg-primary/90 transition-colors text-xs text-black font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                        >
                            <Rocket className="w-3 h-3" />
                            <span className="hidden md:inline">Deploy</span>
                        </button>
                    </div>
                </div>
            </motion.header>

            <div ref={containerRef} className="flex-1 overflow-y-auto relative no-scrollbar perspective-1000">
                <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-4">
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        <Background3D theme={brandContext.theme} />
                    </div>

                    <motion.div
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="relative z-10 max-w-5xl mx-auto pt-20"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                                {brandContext.headline}
                            </h1>

                            <p className="text-xl md:text-2xl text-white/60 font-light mb-12 max-w-3xl mx-auto">
                                {brandContext.subheadline}
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300">
                                    Get Started
                                </button>
                                <button className="px-8 py-4 rounded-full glass-panel text-white font-semibold text-lg hover:bg-white/10 transition-colors duration-300">
                                    Learn More
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                <motion.section
                    className="relative min-h-screen py-32 px-4 z-20"
                    style={{ backgroundColor: featuresBgColor }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
                    <div className="relative max-w-7xl mx-auto z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {brandContext.features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="glass-panel p-8 rounded-3xl hover:bg-white/[0.05] transition-colors duration-500 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 mb-6 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                        <div className="w-6 h-6 rounded-lg bg-primary/80 group-hover:bg-primary transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                    <p className="text-white/60 font-light leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Footer / Watermark */}
                <section className="relative py-8 z-20 bg-black flex justify-center">
                    {/* Watermark for free tiers */}
                    {(!session?.user || (session.user as any)?.plan !== "PRO") && (
                        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl pointer-events-none select-none">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">Built with ImmersaAI Engine</span>
                        </div>
                    )}
                </section>
            </div>
        </motion.div>
    );
}
