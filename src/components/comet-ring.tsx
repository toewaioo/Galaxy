"use client";

import * as THREE from 'three';
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import type { Group } from "three";

const COMET_COUNT = 30;
const RING_RADIUS = 2.5;

interface CometProps {
  imageUrl: string;
  onClick: () => void;
}

function Comet({ imageUrl, onClick }: CometProps) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  return (
    <mesh onClick={onClick} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

interface CometRingProps {
  images: string[];
}

export default function CometRing({ images }: CometRingProps) {
  const ringRef = useRef<Group>(null!);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  const cometData = useMemo(() => {
    const data = [];
    const imageSources = images.length > 0 ? images : Array(COMET_COUNT).fill('https://placehold.co/100x100.png');
    
    for (let i = 0; i < COMET_COUNT; i++) {
        const angle = (i / COMET_COUNT) * Math.PI * 2;
        const x = Math.cos(angle) * RING_RADIUS;
        const y = Math.sin(angle) * RING_RADIUS;
        data.push({
            position: [x, y, 0] as [number, number, number],
            rotationZ: angle,
            imageUrl: imageSources[i % imageSources.length]
        });
    }
    return data;
  }, [images]);

  const handleCometClick = (index: number) => {
    console.log(`Comet ${index} clicked!`);
    // We will implement the image replacement logic here later
  };


  return (
    <group ref={ringRef} rotation-x={Math.PI / 3}>
      {cometData.map((data, i) => (
         <group key={i} position={data.position} rotation-z={data.rotationZ}>
            <Comet imageUrl={data.imageUrl} onClick={() => handleCometClick(i)} />
         </group>
      ))}
    </group>
  );
}
