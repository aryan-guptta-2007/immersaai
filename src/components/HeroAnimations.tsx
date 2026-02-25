"use client";

import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export function HeroBackground() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <motion.div
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
            style={{ opacity }}
        >
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-black" />

            {/* Cinematic Ambient Glows */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] mix-blend-screen"
                style={{ y: y1 }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[150px] mix-blend-screen"
                style={{ y: y2 }}
            />
            <div className="absolute top-[20%] left-[40%] w-[20%] h-[20%] rounded-full bg-white/5 blur-[100px] mix-blend-screen" />

            {/* Grid Pattern overlay for tech feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Interactive Cursor Particles */}
            <CursorParticles />
        </motion.div>
    );
}

function CursorParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            life: number;
            maxLife: number;
        }> = [];

        let mouseParams = { x: -1000, y: -1000, moving: false };

        // Resize handler
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Mouse movement
        const onMouseMove = (e: MouseEvent) => {
            mouseParams.x = e.clientX;
            mouseParams.y = e.clientY;
            mouseParams.moving = true;

            // Add particle on movement
            if (Math.random() > 0.5) {
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2 - 1,
                    size: Math.random() * 2 + 1,
                    life: 0,
                    maxLife: Math.random() * 50 + 50
                });
            }
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        let animationFrameId: number;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life++;

                const progress = p.life / p.maxLife;
                const alpha = 1 - progress;

                ctx.beginPath();
                // Cyber blue/white tint
                ctx.fillStyle = `rgba(100, 200, 255, ${alpha * 0.5})`;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connect close particles to mouse
                const dx = mouseParams.x - p.x;
                const dy = mouseParams.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 200, 255, ${(1 - dist / 100) * 0.2 * alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseParams.x, mouseParams.y);
                    ctx.stroke();
                }
            }

            particles = particles.filter(p => p.life < p.maxLife);
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
        />
    );
}
