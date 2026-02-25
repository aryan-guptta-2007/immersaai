"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Globe } from "lucide-react";
import dynamic from "next/dynamic";

import { useSession, signIn, signOut } from "next-auth/react";

import { HeroBackground } from '@/components/HeroAnimations';

// Optmize the heavy 3D canvas out of the SSR bundle for Vercel deployment
const Background3D = dynamic(() => import('@/components/Background3D').then(mod => mod.Background3D), { ssr: false });

export default function MarketingPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-light overflow-x-hidden">
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
                <HeroBackground />

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
                            <div className="w-full relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
                                <div className="relative glass-panel border border-white/20 rounded-2xl flex items-center p-2 bg-black/60 backdrop-blur-2xl transition-all duration-300 group-hover:bg-black/80 group-hover:border-white/40">
                                    <div className="pl-6 pr-4 border-r border-white/10 hidden sm:block">
                                        <Code2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. A neon-lit cyberpunk startup selling quantum..."
                                        className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-white/20 text-lg w-full"
                                        readOnly // Placeholder behavior until JS activates on real engine route
                                        onClick={() => window.location.href = '/engine'}
                                    />
                                    <Link href="/engine" className="ml-2 bg-white text-black px-6 py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-white/90 hover:scale-[1.02] transition-all flex items-center gap-2">
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

                {/* Down Arrow Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
                >
                    <span className="text-xs font-mono tracking-widest uppercase">System Logs</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
            </section>

            {/* Layer 2: System Architecture / Control Panels */}
            <section id="architecture" className="py-32 px-6 relative bg-black border-t border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-black to-black pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Left Column: System Status */}
                        <div className="w-full md:w-1/3 flex flex-col gap-6 sticky top-32">
                            <div className="text-xs font-mono text-primary tracking-widest uppercase mb-2">System Architecture</div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                Not a template. <br className="hidden md:block" />
                                <span className="text-white/40">A generative matrix.</span>
                            </h2>
                            <p className="text-white/50 leading-relaxed mb-8">
                                Standard platforms give you pre-built components. ImmersaAI allocates dedicated cloud rendering nodes to synthesize bespoke WebGL geometry on the fly.
                            </p>

                            <div className="glass-panel border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-sm font-mono text-white/50">Core Metrics</div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/40">Geometry Generation</span>
                                        <span className="text-white">1.2s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/40">Shader Compilation</span>
                                        <span className="text-white">0.8s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/40">Copywriting Node</span>
                                        <span className="text-white">Active</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                                        <div className="w-full h-full bg-primary/50 relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/2 animate-[shimmer_2s_infinite]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Holographic Panels */}
                        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {/* Panel 1 */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="glass-panel border border-white/10 p-1 flex flex-col rounded-3xl bg-black/50 overflow-hidden group hover:border-white/30 transition-all duration-500"
                            >
                                <div className="h-48 bg-zinc-950 rounded-2xl m-2 overflow-hidden relative flex items-center justify-center border border-white/5">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
                                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                                    <Globe className="w-12 h-12 text-blue-500/50 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-700" />
                                </div>
                                <div className="p-6 pt-4">
                                    <div className="text-xs font-mono text-white/30 mb-2 uppercase">[ Detected Environment ]</div>
                                    <h3 className="text-2xl font-bold mb-2">Spatial Context <br /> Mapping</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">The engine reads your prompt's industry and automatically constructs corresponding 3D lightmaps, HDRI reflections, and physics settings.</p>
                                </div>
                            </motion.div>

                            {/* Panel 2 */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: 0.1 }}
                                className="glass-panel border border-white/10 p-1 flex flex-col rounded-3xl bg-black/50 overflow-hidden group hover:border-white/30 transition-all duration-500"
                            >
                                <div className="h-48 bg-zinc-950 rounded-2xl m-2 overflow-hidden relative flex items-center justify-center border border-white/5">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-black to-black" />
                                    <Sparkles className="w-12 h-12 text-fuchsia-500/50 group-hover:scale-110 group-hover:text-fuchsia-400 transition-all duration-700" />
                                </div>
                                <div className="p-6 pt-4">
                                    <div className="text-xs font-mono text-white/30 mb-2 uppercase">[ Content Synthesis ]</div>
                                    <h3 className="text-2xl font-bold mb-2">Automated <br /> Copywriting</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">No lorem ipsum. The AI writes high-converting, brand-aligned headlines and paragraphs mapped precisely to the generated UI layout.</p>
                                </div>
                            </motion.div>

                            {/* Panel 3 - Wide */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="glass-panel border border-white/10 p-1 flex flex-col rounded-3xl bg-black/50 overflow-hidden group hover:border-white/30 transition-all duration-500 md:col-span-2"
                            >
                                <div className="h-40 bg-zinc-950 rounded-2xl m-2 overflow-hidden relative flex items-center justify-center border border-white/5">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black" />
                                    <div className="flex gap-4 items-center">
                                        <div className="px-4 py-2 border border-white/10 rounded-lg bg-white/5 font-mono text-xs text-white/50">Next.js</div>
                                        <div className="w-8 h-px bg-white/20" />
                                        <div className="px-4 py-2 border border-white/10 rounded-lg bg-white/5 font-mono text-xs text-white/50">Three.js</div>
                                        <div className="w-8 h-px bg-white/20" />
                                        <div className="px-4 py-2 border border-white/10 rounded-lg bg-white/5 font-mono text-xs text-white/50">Tailwind</div>
                                    </div>
                                </div>
                                <div className="p-6 pt-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <div className="text-xs font-mono text-white/30 mb-2 uppercase">[ Extraction Protocol ]</div>
                                        <h3 className="text-2xl font-bold mb-2">Production Export</h3>
                                        <p className="text-white/50 text-sm leading-relaxed max-w-md">Download instantly deployable root directories. Clean, modern, heavily optimized React code with dynamic imports and SSR disabled for Canvas.</p>
                                    </div>
                                    <Code2 className="w-10 h-10 text-white/20 hidden md:block" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

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
                        <h3 className="text-xl font-medium mb-2">Student Export</h3>
                        <div className="text-4xl font-bold mb-6">₹499<span className="text-lg text-white/50 font-normal">/export</span></div>
                        <ul className="flex-1 space-y-4 mb-8 text-white/70">
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Full Source Code</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Basic 3D Assets</li>
                            <li className="flex items-center gap-3 opacity-50 text-sm">ImmersaAI Watermark</li>
                        </ul>
                        <span className="block w-full text-center py-3 rounded-xl bg-white/10 group-hover:bg-white/20 font-medium transition-colors">Start Creating</span>
                    </Link>

                    {/* Tier 2 */}
                    <Link href="/engine" className="glass-panel p-8 rounded-3xl border border-primary/50 relative overflow-hidden flex flex-col cursor-pointer text-left block transform md:-translate-y-4 shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.3)]">
                        <div className="absolute top-0 right-0 bg-primary text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                        <h3 className="text-xl font-medium mb-2 text-primary-glow">Creator License</h3>
                        <div className="text-4xl font-bold mb-6">₹999<span className="text-lg text-white/50 font-normal">/export</span></div>
                        <ul className="flex-1 space-y-4 mb-8 text-white/90 z-10">
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Full Source Code</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Premium 3D Environments</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> 1-Click Vercel Deploy</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> No Watermark</li>
                        </ul>
                        <span className="block w-full text-center py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors z-10">Start Creating</span>
                    </Link>

                    {/* Tier 3 */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
                        <h3 className="text-xl font-medium mb-2">Agency Pro</h3>
                        <div className="text-4xl font-bold mb-6">₹2999<span className="text-lg text-white/50 font-normal">/export</span></div>
                        <ul className="flex-1 space-y-4 mb-8 text-white/70">
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Everything in Creator</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Custom Brand Training</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Priority API Access</li>
                            <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-primary" /> Commercial Resell License</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors">Contact Sales</button>
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
