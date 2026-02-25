"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export function ScrollStoryBackground() {
    const { scrollYProgress } = useScroll();

    // Background intensity mapping based on scroll depth
    const gridOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], [0, 0.3, 0.8, 0.2]);
    const primaryGlowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const accentGlowY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
    const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.5, 0.8]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Dynamic Grid Network */}
            <motion.div
                style={{ opacity: gridOpacity }}
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_100%_at_50%_50%,#000_20%,transparent_100%)] transition-opacity duration-1000"
            />

            {/* Floating Spatial Light Volumes */}
            <motion.div
                style={{ top: primaryGlowY, scale: glowScale }}
                className="absolute left-[-10%] w-[40%] h-[400px] rounded-full bg-primary/10 blur-[150px] mix-blend-screen"
            />
            <motion.div
                style={{ top: accentGlowY, scale: glowScale }}
                className="absolute right-[-10%] w-[40%] h-[400px] rounded-full bg-accent/10 blur-[150px] mix-blend-screen"
            />
        </div>
    );
}
