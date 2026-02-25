"use client";

import { motion } from "framer-motion";

export function GenerationTicker() {
    const logs = [
        { id: 1, status: "DEPLOYED", project: "Cyberpunk Agency 3D", location: "US-EAST", time: "2s ago", color: "text-green-400" },
        { id: 2, status: "RENDERING", project: "Minimalist E-Commerce", location: "EU-WEST", time: "5s ago", color: "text-yellow-400" },
        { id: 3, status: "MAPPING", project: "Dark Mode Fintech App", location: "AP-SOUTH", time: "12s ago", color: "text-primary" },
        { id: 4, status: "DEPLOYED", project: "Neon Portfolio Matrix", location: "US-WEST", time: "18s ago", color: "text-green-400" },
        { id: 5, status: "PARSING", project: "Luxury Real Estate Space", location: "EU-CENTRAL", time: "24s ago", color: "text-purple-400" },
        { id: 6, status: "RENDERING", project: "Web3 Startup Landing", location: "US-EAST", time: "31s ago", color: "text-yellow-400" },
    ];

    // Double the array for seamless infinite marquee scrolling
    const duplicatedLogs = [...logs, ...logs];

    return (
        <div className="w-full border-y border-white/5 bg-black/50 backdrop-blur-sm overflow-hidden py-3 flex relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex whitespace-nowrap min-w-max items-center"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
                {duplicatedLogs.map((log, index) => (
                    <div key={`${log.id}-${index}`} className="flex items-center mx-8 font-mono text-[10px] md:text-xs">
                        <span className={`${log.color} font-bold mr-3 flex items-center gap-1.5`}>
                            <span className={`w-1.5 h-1.5 rounded-full bg-current ${log.status === 'RENDERING' ? 'animate-pulse' : ''}`} />
                            [{log.status}]
                        </span>
                        <span className="text-white/80 mr-3">{log.project}</span>
                        <span className="text-white/30 mr-3 hidden md:inline">NODE:{log.location}</span>
                        <span className="text-white/20">{log.time}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
