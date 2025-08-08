"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Earth from "./earth";
import Sun from "./sun";

interface GalaxyProps {
  cometImages: string[];
}

export default function Galaxy({ cometImages }: GalaxyProps) {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 45 }} shadows>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FDD262" />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <group position={[-50, 20, -100]}>
        <Sun />
      </group>
      <Earth cometImages={cometImages} />
      <OrbitControls />
    </Canvas>
  );
}
