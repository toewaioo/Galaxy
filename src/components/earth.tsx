"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export default function Earth() {
  const meshRef = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Orbit around the sun
      const angle = clock.getElapsedTime() * 0.1;
      const x = Math.cos(angle) * 20;
      const z = Math.sin(angle) * 20;
      meshRef.current.position.set(x, 0, z);

      // Rotate on its own axis
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#24292E" metalness={0.5} roughness={0.7} />
    </mesh>
  );
}
