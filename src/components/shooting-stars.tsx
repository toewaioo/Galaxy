"use client";

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

const STAR_COUNT = 15;

function createTrailTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0.0, 'rgba(255, 192, 203, 0)');
  gradient.addColorStop(0.15, 'rgba(255, 192, 203, 0.5)');
  gradient.addColorStop(0.4, 'rgba(255, 160, 122, 0.8)');
  gradient.addColorStop(0.6, 'rgba(255, 215, 160, 1)');
  gradient.addColorStop(0.85, 'rgba(216, 191, 216, 0.6)');
  gradient.addColorStop(1.0, 'rgba(255, 182, 193, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 64);

  return new THREE.CanvasTexture(canvas);
}

function ShootingStar() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const trailTexture = useMemo(() => createTrailTexture(), []);

  const [position, velocity, rotation] = useMemo(() => {
    const pos = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(800),
      THREE.MathUtils.randFloat(300, 600),
      THREE.MathUtils.randFloatSpread(800)
    );
    const vel = new THREE.Vector3(
      THREE.MathUtils.randFloat(-0.5, 0.5),
      THREE.MathUtils.randFloat(-1, -0.5),
      THREE.MathUtils.randFloat(-0.5, 0.5)
    );
    const rot = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      vel.clone().normalize()
    );
    return [pos, vel, rot];
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.add(velocity);

      if (meshRef.current.position.y < -300) {
        meshRef.current.position.set(
          THREE.MathUtils.randFloatSpread(800),
          THREE.MathUtils.randFloat(300, 600),
          THREE.MathUtils.randFloatSpread(800)
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} quaternion={rotation}>
      <cylinderGeometry args={[0, 0.5, 30, 16]} />
      <meshBasicMaterial 
        map={trailTexture} 
        blending={THREE.AdditiveBlending} 
        transparent 
        opacity={0.9}
        depthTest={false}
      />
    </mesh>
  );
}

export default function ShootingStars() {
  const stars = useMemo(() => Array.from({ length: STAR_COUNT }, (_, i) => <ShootingStar key={i} />), []);

  return <group>{stars}</group>;
}
