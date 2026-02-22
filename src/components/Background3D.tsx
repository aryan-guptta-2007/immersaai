"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Icosahedron, TorusKnot, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";

function CyberShield() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta * 0.2;
            ref.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group>
            <Icosahedron ref={ref} args={[1.5, 1]}>
                <meshBasicMaterial color="#3b82f6" wireframe wireframeLinewidth={2} transparent opacity={0.5} />
            </Icosahedron>
            <Icosahedron args={[1.2, 0]}>
                <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
            </Icosahedron>
        </group>
    );
}

function NeuralCore() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.5;
            ref.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <TorusKnot ref={ref} args={[1, 0.3, 128, 64]}>
            <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={1} emissive="#4c1d95" emissiveIntensity={0.5} />
        </TorusKnot>
    );
}

function LuxuryDiamond() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <Sphere ref={ref} args={[1.2, 64, 64]}>
            <MeshDistortMaterial
                color="#ffffff"
                envMapIntensity={1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                metalness={0.9}
                roughness={0.1}
                distort={0.3}
                speed={1.5}
            />
        </Sphere>
    );
}

function Particles() {
    const ref = useRef<THREE.Points>(null);
    const [sphere] = useState(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 2 * Math.cbrt(Math.random());
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#a1a1aa" size={0.005} sizeAttenuation={true} depthWrite={false} />
        </Points>
    );
}

interface Background3DProps {
    theme?: 'cyber' | 'neural' | 'luxury' | 'default';
}

export function Background3D({ theme = 'default' }: Background3DProps) {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-10 pointer-events-none" />

            {theme === 'cyber' && (
                <>
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-1" />
                    <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none z-1" />
                </>
            )}
            {theme === 'neural' && (
                <>
                    <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none z-1" />
                    <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none z-1" />
                </>
            )}
            {theme === 'luxury' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full pointer-events-none z-1" />
            )}

            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="w-full h-full z-0">
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />

                {theme === 'cyber' && <CyberShield />}
                {theme === 'neural' && <NeuralCore />}
                {theme === 'luxury' && <LuxuryDiamond />}

                {/* Always render particles in background as a base layer */}
                <Particles />
            </Canvas>
        </div>
    );
}
