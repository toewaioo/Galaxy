"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export default function Sun() {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshStandardMaterial
        color="#FDD262"
        emissive="#FDD262"
        emissiveIntensity={2}
      />
      <pointLight castShadow position={[0, 0, 0]} intensity={100} color="#FDD262" />
    </mesh>
  );
}
