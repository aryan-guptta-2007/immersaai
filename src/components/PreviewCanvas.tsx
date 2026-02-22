"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Download, Share2, RefreshCw, Rocket, Sparkles } from "lucide-react";
import { Background3D } from "./Background3D";
import { useRef, useState } from "react";
import { PricingModal } from "./PricingModal";
import { ShareModal } from "./ShareModal";

export interface BrandContext {
    theme: 'cyber' | 'neural' | 'luxury' | 'default';
    headline: string;
    subheadline: string;
    features: { title: string; description: string }[];
}

interface PreviewCanvasProps {
    prompt: string;
    brandContext: BrandContext;
    onRegenerate: () => void;
    onRegenerateStyle: (theme: BrandContext['theme']) => void;
}

export function PreviewCanvas({ prompt, brandContext, onRegenerate, onRegenerateStyle }: PreviewCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [showPricing, setShowPricing] = useState(false);
    const [pricingAction, setPricingAction] = useState<'export' | 'deploy'>('export');
    const [showShare, setShowShare] = useState(false);

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

    const handleExport = () => {
        setPricingAction('export');
        setShowPricing(true);
    };

    const handleDeploy = () => {
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
            />
            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                siteUrl="https://immersa.ai/site/preview-demo"
            />

            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10"
            >
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-primary blur-[2px]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-white">Generated Project</h2>
                        <p className="text-xs text-white/50 truncate max-w-[200px] md:max-w-md">"{prompt}"</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onRegenerate}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden md:inline">Regenerate</span>
                    </button>
                    <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden md:inline">Share</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm text-white font-medium"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">Export Code</span>
                    </button>
                    <button
                        onClick={handleDeploy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors text-sm font-medium"
                    >
                        <Rocket className="w-4 h-4" />
                        <span className="hidden md:inline">Deploy Live</span>
                    </button>
                </div>
            </motion.header>

            {/* Style Regeneration Pill Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 glass-panel rounded-full px-2 py-2 flex items-center gap-2 border border-white/10 shadow-2xl"
            >
                <span className="text-xs text-white/40 px-3 uppercase tracking-wider font-semibold">Style</span>
                <div className="h-4 w-px bg-white/10" />
                <button onClick={() => onRegenerateStyle('cyber')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${brandContext.theme === 'cyber' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Cyber</button>
                <button onClick={() => onRegenerateStyle('luxury')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${brandContext.theme === 'luxury' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Luxury</button>
                <button onClick={() => onRegenerateStyle('neural')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${brandContext.theme === 'neural' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Neural</button>
                <button onClick={() => onRegenerateStyle('default')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${brandContext.theme === 'default' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>Modern</button>
            </motion.div>

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
                    <span className="text-white/20 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Built with ImmersaAI
                    </span>
                </section>
            </div>
        </motion.div>
    );
}
