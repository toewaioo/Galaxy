"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import CometRing from "./comet-ring";

interface EarthProps {
  cometImages: string[];
}

export default function Earth({ cometImages }: EarthProps) {
  const groupRef = useRef<Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Orbit around the sun
      const angle = clock.getElapsedTime() * 0.02; // Slower orbit
      const x = Math.cos(angle) * 20;
      const z = Math.sin(angle) * 20;
      groupRef.current.position.set(x, 0, z);

      // Rotate on its own axis
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#24292E" metalness={0.5} roughness={0.7} />
      </mesh>
      <CometRing images={cometImages} />
    </group>
  );
}
