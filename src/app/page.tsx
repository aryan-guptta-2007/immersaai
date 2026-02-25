"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Globe } from "lucide-react";
import dynamic from "next/dynamic";

import { useSession, signIn, signOut } from "next-auth/react";

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

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-white/80">The Future of Web Storytelling</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                            AI cinematic brand
                        </span>
                        <br />
                        experience engine.
                    </h1>

                    <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                        Prompt to an agency-level 3D website in seconds. Built for founders, creators, and brands who refuse to look like everyone else.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/engine"
                            className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300"
                        >
                            Enter the Engine
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#showcase"
                            className="px-8 py-4 rounded-full glass-panel text-white font-medium text-lg hover:bg-white/10 transition-colors duration-300"
                        >
                            View Examples
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* THE TRUST ENGINE: Showcase Section */}
            <section id="showcase" className="py-24 px-6 border-t border-white/5 relative bg-black/80">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">World-Class Output.</h2>
                        <p className="text-white/50 max-w-2xl mx-auto text-lg">Stop using templates. Generate bespoke, interactive WebGL experiences customized to your exact niche instantaneously.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Example 1: Cyber */}
                        <div className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="h-48 w-full relative bg-zinc-950 overflow-hidden flex items-center justify-center p-6">
                                {/* CSS Mockup of the Canvas */}
                                <div className="w-full h-full border border-green-500/20 rounded-xl flex items-center justify-center relative overflow-hidden bg-black shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
                                    <div className="font-mono text-green-500 font-bold text-xl uppercase tracking-widest z-10 text-center drop-shadow-[0_0_10px_rgba(34,197,94,1)]">Zero-Trust</div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-mono text-white/30 mb-2">// PROMPT</div>
                                <p className="text-sm font-medium text-white/80 mb-6 flex-1">"A stealth cybersecurity startup protecting quantum data centers."</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-black/50 border border-white/5 rounded text-xs text-white/50">Cyber Theme</span>
                                    <span className="px-2 py-1 bg-black/50 border border-white/5 rounded text-xs text-white/50">WebGL Line Mesh</span>
                                </div>
                            </div>
                        </div>

                        {/* Example 2: Luxury */}
                        <div className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="h-48 w-full relative bg-zinc-900 overflow-hidden flex items-center justify-center p-6">
                                {/* CSS Mockup of the Canvas */}
                                <div className="w-full h-full border border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 shadow-inner">
                                    <div className="font-serif text-amber-500/80 text-2xl uppercase tracking-[0.3em] font-light z-10 px-4 text-center">Maison</div>
                                    <div className="h-px w-12 bg-amber-500/40 mt-3 z-10"></div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-mono text-white/30 mb-2">// PROMPT</div>
                                <p className="text-sm font-medium text-white/80 mb-6 flex-1">"An ultra-luxury Parisian fashion house launching a digital collection."</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-black/50 border border-white/5 rounded text-xs text-amber-500/50">Luxury Theme</span>
                                    <span className="px-2 py-1 bg-black/50 border border-white/5 rounded text-xs text-amber-500/50">Glassmorphism</span>
                                </div>
                            </div>
                        </div>

                        {/* Example 3: Neural */}
                        <div className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="h-48 w-full relative bg-zinc-950 overflow-hidden flex items-center justify-center p-6">
                                {/* CSS Mockup of the Canvas */}
                                <div className="w-full h-full border border-blue-500/20 rounded-xl flex items-center justify-center relative overflow-hidden bg-black shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-black to-black"></div>
                                    <div className="font-sans text-white font-bold text-2xl tracking-tighter z-10">Sentient.ai</div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-mono text-white/30 mb-2">// PROMPT</div>
                                <p className="text-sm font-medium text-white/80 mb-6 flex-1">"The world's first AGI research lab building cognitive architectures."</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-black/50 border border-white/5 rounded text-xs text-indigo-300">Neural Theme</span>
                                    <span className="px-2 py-1 bg-black/50 border border-white/5 rounded text-xs text-indigo-300">Particle Web</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Drivers */}
            <section className="py-24 px-6 border-y border-white/5 relative bg-black/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold">Brand Intelligence</h3>
                        <p className="text-white/50 leading-relaxed">
                            Our engine understands your prompt's context and instantly generates bespoke copy, 3D assets, and layouts matched to your industry.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Code2 className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-2xl font-semibold">Export Production Code</h3>
                        <p className="text-white/50 leading-relaxed">
                            No generic templates. Get a Next.js + Framer Motion + Three.js codebase that feels custom-built by a top-tier design agency.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Globe className="w-6 h-6 text-pink-500" />
                        </div>
                        <h3 className="text-2xl font-semibold">Deploy Instantly</h3>
                        <p className="text-white/50 leading-relaxed">
                            Push your generated cinematic site directly to a live URL. Capture leads and validate your startup idea in seconds.
                        </p>
                    </motion.div>
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
