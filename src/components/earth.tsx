"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import CometRing from "./comet-ring";
import TextRing from "./text-ring";
import * as THREE from "three";

interface EarthProps {
  cometImages: string[];
}

export default function Earth({ cometImages }: EarthProps) {
  const groupRef = useRef<Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      // Rotate on its own axis
      groupRef.current.rotation.y += 0.0009;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#0b3d91" emissive="#3399ff" metalness={0.0001} roughness={0.00007} />
      </mesh>
      <CometRing images={cometImages} />
      <TextRing text=".YAD ELGNIS HCAE EURT EMOC MAERD YM YOJ YM ,ECAEP YM ER’UOY — LUOS RUOY ,ECIOV RUOY ,ELIMS ROUY EVOL I" radius={1.5} color="#ff6ec4" rotationSpeed={0.001} rotationAxis={new THREE.Vector3(0, 1, 0)} />
      <TextRing text=".UOY ROFPEED EVAH I EVOL EHT FO ESUACEB LLA S’T I ,EKAT I HTAERB YREVE ,LEEF I TAEBTRA EH YREVE" radius={1.6} color="#a2d5f2" rotationSpeed={-0.001} rotationAxis={new THREE.Vector3(1, 0, 0)} />
      <TextRing text="Y.EFIL LUFTUAEB SIHT NI REVEROF YM DNA ,MROTS EHT NI MLAC YM ,NIAR EHT NI ENIHSNUS YM ERA UOY" radius={1.7} color="#98fb98" rotationSpeed={0.001} rotationAxis={new THREE.Vector3(1, 1, 0)} />
    </group>
  );
}
