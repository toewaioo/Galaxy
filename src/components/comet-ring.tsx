"use client";

import * as THREE from 'three';
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import type { Group, Sprite as SpriteType } from "three";

const COMET_COUNT = 500;
const RING_RADIUS = 3.5;
const RING_THICKNESS = 2.5;
const RING_VERTICAL_SPREAD = 0.5;

interface CometProps {
  imageUrl: string;
  position: [number, number, number];
  initialAngle: number;
  radius: number;
  speed: number;
  pulseSpeed: number;
  initialOpacity: number;
}

function Comet(props: CometProps) {
  const spriteRef = useRef<SpriteType>(null!);
  const texture = useLoader(THREE.TextureLoader, props.imageUrl);

  useFrame(({ clock }) => {
    if (spriteRef.current) {
      // Animate opacity
      const pulse = Math.sin(clock.getElapsedTime() * props.pulseSpeed);
      spriteRef.current.material.opacity = props.initialOpacity + pulse * 0.2;

      // Animate orbit
      const angle = props.initialAngle + clock.getElapsedTime() * props.speed * 0.01;
      spriteRef.current.position.x = Math.cos(angle) * props.radius;
      spriteRef.current.position.z = Math.sin(angle) * props.radius;
    }
  });

  return (
    <sprite ref={spriteRef} position={props.position} scale={[0.5, 0.5, 1]}>
      <spriteMaterial map={texture} transparent opacity={props.initialOpacity} />
    </sprite>
  );
}

interface CometRingProps {
  images: string[];
}

export default function CometRing({ images }: CometRingProps) {
  const ringRef = useRef<Group>(null!);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.0002; // Slow rotation of the entire system
    }
  });

  const cometData = useMemo(() => {
    const data = [];
    const imageSources = images.length > 0 ? images : Array(COMET_COUNT).fill('https://placehold.co/100x100.png');
    
    for (let i = 0; i < COMET_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = RING_RADIUS + (Math.random() - 0.5) * RING_THICKNESS;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * RING_VERTICAL_SPREAD;
        
        data.push({
            position: [x, y, z] as [number, number, number],
            imageUrl: imageSources[i % imageSources.length],
            initialAngle: angle,
            radius: radius,
            speed: (Math.random() * 0.05 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
            pulseSpeed: Math.random() * 0.5 + 0.5,
            initialOpacity: Math.random() * 0.4 + 0.5,
        });
    }
    return data;
  }, [images]);

  return (
    <group ref={ringRef}>
      {cometData.map((data, i) => (
         <Comet key={i} {...data} />
      ))}
    </group>
  );
}
