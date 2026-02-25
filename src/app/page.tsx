"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Globe } from "lucide-react";
import dynamic from "next/dynamic";

import { useSession, signIn, signOut } from "next-auth/react";

import { HeroBackground } from '@/components/HeroAnimations';

// Optmize the heavy 3D canvas out of the SSR bundle for Vercel deployment
const Background3D = dynamic(() => import('@/components/Background3D').then(mod => mod.Background3D), { ssr: false });
import { BootLogs } from "@/components/BootLogs";
import { ScrollStoryBackground } from "@/components/ScrollStoryBackground";
import { LiveHeroRender } from "@/components/LiveHeroRender";
import { PipelineGraph } from "@/components/PipelineGraph";
import { GenerationTicker } from "@/components/GenerationTicker";

export default function MarketingPage() {
    const { data: session } = useSession();
    const [prompt, setPrompt] = useState("");

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-light overflow-x-hidden relative bg-noise">
            <ScrollStoryBackground />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-primary blur-[2px]" />
                    </div>
                    <span className="font-semibold tracking-tight text-lg">ImmersaAI</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</Link>
                    {session ? (
                        <>
                            <Link href="/dashboard" className="text-sm text-white/70 hover:text-white transition-colors">Dashboard</Link>
                            <button onClick={() => signOut()} className="text-sm text-white/70 hover:text-white transition-colors">Logout</button>
                        </>
                    ) : (
                        <button onClick={() => signIn('google')} className="text-sm text-white/70 hover:text-white transition-colors">Login</button>
                    )}
                    <Link href="/engine" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-colors">
                        Start Creating
                    </Link>
                </div>
            </nav>

            {/* System Engine UI - Layer 1 & 2 */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                {/* Layer 1: Living Canvas */}
                <HeroBackground intensity={Math.min(prompt.length, 50)} />
                <LiveHeroRender activePrompt={prompt} />

                {/* Layer 2: Holographic Command Center */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-4xl flex flex-col items-center"
                >
                    {/* Status Indicator */}
                    <div className="flex items-center gap-3 mb-10 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </div>
                        <span className="text-sm font-mono tracking-widest text-white/70 uppercase">ImmersaAI System Online</span>
                    </div>

                    {/* Main Holographic Terminal */}
                    <div className="w-full glass-panel border border-white/10 rounded-3xl p-2 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                        {/* Terminal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-xs font-mono text-white/30 uppercase tracking-widest">A.I. Generation Node</div>
                            <Sparkles className="w-4 h-4 text-white/30" />
                        </div>

                        {/* Terminal Body */}
                        <div className="p-8 md:p-12 flex flex-col items-center text-center">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                                Enter your vision.
                            </h1>
                            <p className="text-lg text-white/40 font-light max-w-xl mx-auto mb-10">
                                Connect to the engine. Describe the brand, product, or cinematic experience you want to manifest into WebGL reality.
                            </p>

                            {/* Interactive Prompt Box */}
                            <div className="w-full relative group z-20">
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-lg transition duration-500"
                                    animate={{
                                        opacity: prompt.length > 0 ? Math.min(0.5 + prompt.length * 0.02, 1) : 0.2,
                                        scale: prompt.length > 0 ? 1.02 : 1
                                    }}
                                />
                                <div className="relative glass-panel border border-white/20 rounded-2xl flex items-center p-2 bg-black/60 backdrop-blur-2xl transition-all duration-300 focus-within:bg-black/80 focus-within:border-white/40">
                                    <div className="pl-6 pr-4 border-r border-white/10 hidden sm:block">
                                        <Code2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. A neon-lit cyberpunk startup selling quantum..."
                                        className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-white/20 text-lg w-full"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                window.location.href = `/engine?q=${encodeURIComponent(prompt)}`;
                                            }
                                        }}
                                    />
                                    <Link href={`/engine?q=${encodeURIComponent(prompt)}`} className="ml-2 bg-white text-black px-6 py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-white/90 hover:scale-[1.02] transition-all flex items-center gap-2">
                                        Initialize <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* System Stats / Config Mock */}
                            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white/40">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                    Node: US-EAST-1
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                                    Model: GPT-4.5 Core
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500/50" />
                                    Renderer: WebGL 2.0
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* System Boot Logs */}
                <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 pointer-events-none">
                    <BootLogs />
                </div>
            </section>

            {/* Layer 2: Pipeline UI & Generation Wall */}
            <PipelineGraph />
            <GenerationTicker />


            {/* Founder Story */}
            <section className="py-32 px-6 border-y border-white/5 relative bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-sm font-medium mb-8">
                        <span className="text-white/80">Built by Founders, For Founders</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">Why we built ImmersaAI.</h2>
                    <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-3xl mx-auto">
                        "We saw startups spending $20,000+ and waiting 2 months just to get an agency-grade 3D landing page to launch their product. So we built an engine that does it in 3 seconds. The future of web storytelling shouldn't be gatekept behind massive budgets."
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                            {/* Placeholder for Founder Avatar */}
                            <span className="font-bold text-lg text-zinc-400">FA</span>
                        </div>
                        <div className="text-left">
                            <div className="font-bold">Founder</div>
                            <div className="text-sm text-white/50">ImmersaAI Engine</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Simple, transparent pricing.</h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">Generate unlimited previews for free. Only pay when you're ready to export or deploy your production site.</p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tier 1 */}
                    <Link href="/engine" className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors cursor-pointer text-left block">
                        <h3 className="text-xl font-medium mb-2">Access Node: Lite</h3>
                        <div className="text-2xl font-bold mb-2">UNLOCK EXPORT</div>
                        <div className="text-sm text-white/50 font-mono mb-6">Allocation fee: ₹499</div>
                        <ul className="flex-1 space-y-4 mb-8 text-white/70">
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Full Source Code</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Basic 3D Assets</li>
                            <li className="flex items-center gap-3 opacity-50 text-sm">ImmersaAI Watermark</li>
                        </ul>
                        <span className="block w-full text-center py-3 rounded-xl bg-white/10 group-hover:bg-white/20 font-mono text-sm uppercase tracking-widest transition-colors">[ Initialize ]</span>
                    </Link>

                    {/* Tier 2 */}
                    <Link href="/engine" className="glass-panel p-8 rounded-3xl border border-primary/50 relative overflow-hidden flex flex-col cursor-pointer text-left block transform md:-translate-y-4 shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.3)]">
                        <div className="absolute top-0 right-0 bg-primary text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                        <h3 className="text-xl font-medium mb-2 text-primary-glow">Creator Engine</h3>
                        <div className="text-2xl font-bold mb-2 text-white">UNLOCK CREATOR MODE</div>
                        <div className="text-sm text-primary text-opacity-80 font-mono mb-6">Allocation fee: ₹999</div>
                        <ul className="flex-1 space-y-4 mb-8 text-white/90 z-10">
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Full Source Code</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Premium 3D Environments</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> 1-Click Vercel Deploy</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> No Watermark</li>
                        </ul>
                        <span className="block w-full text-center py-3 rounded-xl bg-white text-black font-mono font-bold uppercase tracking-widest hover:bg-white/90 transition-colors z-10">[ Initialize Mode ]</span>
                    </Link>

                    {/* Tier 3 */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
                        <h3 className="text-xl font-medium mb-2">Enterprise Neural Stack</h3>
                        <div className="text-2xl font-bold mb-2">UNLOCK AGENCY MATRIX</div>
                        <div className="text-sm text-white/50 font-mono mb-6">Allocation fee: ₹2999</div>
                        <ul className="flex-1 space-y-4 mb-8 text-white/70">
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Everything in Creator</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Custom Brand Training</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Priority API Access</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Commercial Resell License</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-mono uppercase tracking-widest text-sm transition-colors">[ Contact SysAdmin ]</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center text-white/40 text-sm">
                <p>© 2026 ImmersaAI Inc. All rights reserved. Built for Founders.</p>
            </footer>
        </div>
    );
}
