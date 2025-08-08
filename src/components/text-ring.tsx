"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { useRef, useMemo } from "react";
import type { Group } from "three";

const fontUrl =
  "https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json";

interface TextRingProps {
  text: string;
  radius: number;
  color: string;
  rotationSpeed: number;
  rotationAxis: THREE.Vector3;
}

export default function TextRing({
  text,
  radius,
  color,
  rotationSpeed,
  rotationAxis,
}: TextRingProps) {
  const groupRef = useRef<Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotateOnAxis(rotationAxis.normalize(), rotationSpeed);
    }
  });

  const characters = useMemo(() => {
    const chars = text.split("");
    const angleStep = (Math.PI * 2) / chars.length;

    return chars.map((char, i) => {
      const angle = i * angleStep;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Create a quaternion to rotate each character to face the center
      const quaternion = new THREE.Quaternion();
      const axis = new THREE.Vector3(0, 1, 0); // Y-axis
      quaternion.setFromAxisAngle(axis, -angle + Math.PI / 2);

      return (
        <group key={i} position={[x, 0, z]} quaternion={quaternion}>
          {/* Main Text */}
          <Text3D
            font={fontUrl}
            size={0.1}
            height={0.02}
            curveSegments={12}
          >
            {char}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
            />
          </Text3D>

          {/* Glow Effect */}
           <Text3D
            font={fontUrl}
            size={0.1}
            height={0.02}
            curveSegments={12}
            position={[0,0,-0.01]} // slight offset
          >
            {char}
            <meshBasicMaterial
              color={color}
              transparent={true}
              opacity={0.4}
              side={THREE.BackSide}
            />
          </Text3D>
        </group>
      );
    });
  }, [text, radius, color]);

  return <group ref={groupRef}>{characters}</group>;
}