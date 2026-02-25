"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, ExternalLink, Filter, ArrowLeft } from "lucide-react";

// Mock data for the gallery to look extremely premium. 
const SHOWCASE = [
    {
        id: 1,
        title: "Neon Financial Matrix",
        category: "Fintech",
        prompt: "A neon-lit cyberpunk fintech dashboard with floating glassmorphic data nodes...",
        author: "Alex K.",
        time: "10m ago",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Zen Minimalist Agency",
        category: "Agency",
        prompt: "A clean, brutalist design agency focusing on pure typography and negative space...",
        author: "Sarah M.",
        time: "1h ago",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Quantum AI Startup",
        category: "SaaS",
        prompt: "Dark mode AI startup with spatial computing particles and deep neural networks...",
        author: "NEXUS Core",
        time: "3h ago",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Spatial NFT Gallery",
        category: "Web3",
        prompt: "A holographic Web3 portfolio for high-end NFTs with dynamic lighting...",
        author: "0xNeural",
        time: "5h ago",
        image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Luxury Commerce",
        category: "E-Commerce",
        prompt: "High fashion e-commerce with glassmorphism and smooth, elegant cinematic transitions...",
        author: "Vogue_AI",
        time: "12h ago",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Data Visualization OS",
        category: "SaaS",
        prompt: "A command center for big data visualization with 3D charting capabilities...",
        author: "SysAdmin",
        time: "1d ago",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    }
];

const CATEGORIES = ["All", "SaaS", "Fintech", "Agency", "Web3", "E-Commerce"];

export default function ExplorePage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = SHOWCASE.filter(item => activeFilter === "All" || item.category === activeFilter);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 font-light overflow-x-hidden relative bg-noise pb-32">

            {/* Header */}
            <header className="pt-32 pb-16 px-6 relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-3xl">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest mb-8">
                        <ArrowLeft className="w-4 h-4" /> Return to Core
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                        The Neural Matrix
                    </h1>
                    <p className="text-lg text-white/40 max-w-2xl font-light">
                        Explore exceptional WebGL environments and digital experiences generated live by the ImmersaAI Engine globally.
                    </p>
                </div>
            </header>

            {/* Content Array */}
            <main className="max-w-7xl mx-auto px-6 pt-12 relative z-10">

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        <Filter className="w-4 h-4 text-white/40 mr-2 shrink-0" />
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeFilter === cat
                                        ? 'bg-primary text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={item.id}
                                className="group relative glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 bg-black/40 shadow-xl"
                            >
                                {/* Image cover */}
                                <div className="aspect-[4/3] w-full relative overflow-hidden bg-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                                    />

                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/80 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-primary" />
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
                                        <Link href={`/engine?q=${encodeURIComponent(item.prompt)}`} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                            <ExternalLink className="w-5 h-5 ml-0.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="p-6 relative z-30">
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-xs text-white/40 font-mono line-clamp-2 mb-6 h-8">
                                        &gt; {item.prompt}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-widest">
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white">
                                                {item.author.charAt(0)}
                                            </div>
                                            {item.author}
                                        </div>
                                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </main>
        </div>
    );
}
