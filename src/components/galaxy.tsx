"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Sun from "./sun";
import Earth from "./earth";

export default function Galaxy() {
  return (
    <Canvas camera={{ position: [0, 20, 40], fov: 45 }}>
      <ambientLight intensity={0.1} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <Sun />
      <Earth />
      <OrbitControls />
    </Canvas>
  );
}
