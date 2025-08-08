"use client";

import * as THREE from 'three';
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const COMET_COUNT = 12;
const RING_RADIUS = 2.5;

function Comet() {
  const texture = useLoader(THREE.TextureLoader, 'https://placehold.co/100x100.png');
  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function CometRing() {
  const ringRef = useRef<Group>(null!);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  const comets = [];
  for (let i = 0; i < COMET_COUNT; i++) {
    const angle = (i / COMET_COUNT) * Math.PI * 2;
    const x = Math.cos(angle) * RING_RADIUS;
    const y = Math.sin(angle) * RING_RADIUS;
    comets.push(
      <group key={i} position={[x, y, 0]} rotation-z={angle}>
        <Comet />
      </group>
    );
  }

  return (
    <group ref={ringRef} rotation-x={Math.PI / 3}>
      {comets}
    </group>
  );
}
