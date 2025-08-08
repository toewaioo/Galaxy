"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Earth from "./earth";
import Sun from "./sun";
import ShootingStars from "./shooting-stars";
import { useRef, useState, useMemo } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface GalaxyProps {
  cometImages: string[];
}

function Scene({ cometImages }: GalaxyProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const [animationProgress, setAnimationProgress] = useState(0);

  const cameraPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.5, 6), // Start close to Earth
      new THREE.Vector3(2, 1, 10), // Move through the comet ring
      new THREE.Vector3(-4, 2, 15), // Continue through the ring
      new THREE.Vector3(0, 5, 25), // Settle at the final viewing position
    ]);
  }, []);

  useFrame((state, delta) => {
    if (animationProgress < 1) {
      const newProgress = animationProgress + delta * 0.15; // Control animation speed
      setAnimationProgress(newProgress);
      
      const point = cameraPath.getPointAt(Math.min(newProgress, 1));
      state.camera.position.copy(point);
      state.camera.lookAt(0, 0, 0); // Always look at the Earth
      
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    } else {
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    }
  });
  
  return (
    <>
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
      <ShootingStars />
      <OrbitControls ref={controlsRef} enabled={false} />
    </>
  );
}


export default function Galaxy({ cometImages }: GalaxyProps) {
  return (
    <Canvas camera={{ position: [0, 5, 25], fov: 45 }} shadows>
      <Scene cometImages={cometImages} />
    </Canvas>
  );
}
