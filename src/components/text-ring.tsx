"use client";

import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { useRef, useMemo } from "react";
import type { Group } from "three";

// We need to provide a font for Text3D. Let's use the one from drei.
const fontUrl = "https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json";

interface TextRingProps {
    text: string;
    radius: number;
    color: string;
    rotationSpeed: number;
}

export default function TextRing({ text, radius, color, rotationSpeed }: TextRingProps) {
    const groupRef = useRef<Group>(null!);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed * 0.1;
        }
    });

    const characters = useMemo(() => {
        const chars = text.split('');
        const angleStep = (Math.PI * 2) / chars.length;

        return chars.map((char, i) => {
            if (char.trim() === '') {
                return null;
            }
            const angle = i * angleStep;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const rotationY = -angle + Math.PI / 2;

            return (
                <Text3D
                    key={i}
                    font={fontUrl}
                    size={0.1}
                    height={0.02}
                    curveSegments={12}
                    position={[x, 0, z]}
                    rotation={[0, rotationY, 0]}
                >
                    {char}
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
                </Text3D>
            );
        });
    }, [text, radius, color]);

    return <group ref={groupRef}>{characters}</group>;
}
