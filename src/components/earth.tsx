"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import CometRing from "./comet-ring";
import TextRing from "./text-ring";

interface EarthProps {
  cometImages: string[];
}

export default function Earth({ cometImages }: EarthProps) {
  const groupRef = useRef<Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      // Rotate on its own axis
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#24292E" metalness={0.5} roughness={0.7} />
      </mesh>
      <CometRing images={cometImages} />
      <TextRing text="I love your smile, your voice, your soul — You are my peace, my joy, my dream come true." radius={2} color="#ff6ec4" rotationSpeed={0.005} />
      <TextRing text="Every heartbeat I feel, every breath I take, it's all because of the love I have deep for you." radius={2.5} color="#a2d5f2" rotationSpeed={-0.004} />
      <TextRing text="You are my sunshine in the rain, my calm in the storm, and my forever in this beautiful life." radius={3} color="#98fb98" rotationSpeed={0.003} />
    </group>
  );
}
