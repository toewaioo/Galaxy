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

  useFrame(() => {
    if (groupRef.current) {
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
