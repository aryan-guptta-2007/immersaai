"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorPhysics() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Exact cursor position
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring-based delayed position for the trailing glow
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const trailX = useSpring(cursorX, springConfig);
    const trailY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // offset by half width of the trail (32/2)
            cursorY.set(e.clientY - 16);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Triggers expansion if hovering over links, buttons, or inputs
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.tagName === "INPUT" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("magnetic")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        // Hide when leaving viewport
        window.addEventListener("mouseout", (e) => {
            if (!e.relatedTarget) setIsVisible(false);
        });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY, isVisible]);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        /* Hide default cursor globally */
        @media (pointer: fine) {
          body { cursor: none; }
          a, button, input { cursor: none !important; }
        }
      `}} />

            {/* Primary Dot - Follows Instantly */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
                style={{
                    x: useSpring(cursorX, { damping: 40, stiffness: 400 }),
                    y: useSpring(cursorY, { damping: 40, stiffness: 400 }),
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Trailing Aura/Glow - Magnetic expansion */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[99] hidden md:flex items-center justify-center border border-white/30 backdrop-blur-[2px]"
                style={{
                    x: trailX,
                    y: trailY,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    borderColor: isHovering ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)",
                }}
                transition={{ duration: 0.2 }}
            />
        </>
    );
}
