'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { courtConfig, type SneakerVariant } from './config';

type Props = {
  variant: SneakerVariant;
  highlighted?: boolean;
  reducedMotion: boolean;
  rotation?: number;
};

function makeParts() {
  const upper = new THREE.Shape();
  upper.moveTo(-1.58, -0.21);
  upper.quadraticCurveTo(-1.58, 0.12, -1.42, 0.42);
  upper.lineTo(-1.12, 1.1);
  upper.quadraticCurveTo(-0.94, 1.34, -0.63, 1.24);
  upper.lineTo(-0.32, 0.54);
  upper.quadraticCurveTo(0.29, 0.42, 1.36, 0.05);
  upper.quadraticCurveTo(1.7, -0.1, 1.58, -0.28);
  upper.lineTo(-1.39, -0.32);
  upper.closePath();

  const sole = new THREE.Shape();
  sole.moveTo(-1.66, -0.27);
  sole.lineTo(1.59, -0.27);
  sole.quadraticCurveTo(1.84, -0.35, 1.75, -0.49);
  sole.lineTo(1.56, -0.65);
  sole.lineTo(-1.53, -0.65);
  sole.quadraticCurveTo(-1.73, -0.56, -1.66, -0.27);
  sole.closePath();

  const panel = new THREE.Shape();
  panel.moveTo(-1.27, -0.1);
  panel.lineTo(-1.09, 0.67);
  panel.quadraticCurveTo(-0.84, 0.93, -0.46, 0.51);
  panel.lineTo(0.61, 0.13);
  panel.quadraticCurveTo(0.17, -0.13, -0.34, -0.11);
  panel.closePath();

  const toe = new THREE.Shape();
  toe.moveTo(0.62, -0.21);
  toe.lineTo(0.54, 0.19);
  toe.quadraticCurveTo(1.14, 0.14, 1.53, -0.08);
  toe.lineTo(1.49, -0.21);
  toe.closePath();

  const textile = new THREE.Shape();
  textile.moveTo(-0.75, 0.08);
  textile.lineTo(-0.65, 0.43);
  textile.lineTo(-0.24, 0.3);
  textile.lineTo(-0.38, 0.04);
  textile.closePath();

  const laces = Array.from({ length: 5 }, (_, i) => {
    const x = -0.49 - i * 0.13;
    const y = 0.32 + i * 0.145;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(x - 0.21, y + 0.025, 0.61),
      new THREE.Vector3(x, y - 0.03, 0.7),
      new THREE.Vector3(x + 0.23, y + 0.025, 0.61),
    ]);
  });
  return { upper, sole, panel, toe, textile, laces };
}

function makeWeave() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#bfa67a';
    ctx.fillRect(0, 0, 128, 128);
    for (let x = -128; x < 256; x += 12) {
      ctx.strokeStyle = '#6e6046';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 128, 128); ctx.stroke();
      ctx.strokeStyle = '#efe0b6';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 6, 0); ctx.lineTo(x + 134, 128); ctx.stroke();
    }
    for (let y = 0; y < 128; y += 8) {
      ctx.strokeStyle = '#b39b71aa';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y); ctx.stroke();
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

export default function SneakerModel({ variant, highlighted = false, reducedMotion, rotation = 0 }: Props) {
  const model = useRef<THREE.Group>(null);
  const accent = useRef<THREE.MeshStandardMaterial>(null);
  const elapsed = useRef(0);
  const parts = useMemo(makeParts, []);
  const weave = useMemo(makeWeave, []);
  const targetTint = useMemo(() => new THREE.Color(courtConfig.variants[variant]), [variant]);
  useEffect(() => () => weave.dispose(), [weave]);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    if (!reducedMotion) elapsed.current += step;
    if (model.current) {
      model.current.rotation.y = rotation + (reducedMotion ? 0 : elapsed.current * 0.23);
      model.current.rotation.x = reducedMotion ? 0 : Math.sin(elapsed.current * 0.75) * 0.05;
      model.current.rotation.z = reducedMotion ? -0.09 : -0.09 + Math.sin(elapsed.current * 0.58) * 0.04;
      model.current.position.y = reducedMotion ? 0 : Math.sin(elapsed.current * 0.9) * 0.035;
      const targetScale = highlighted ? 1.08 : 1;
      const s = THREE.MathUtils.damp(model.current.scale.x, targetScale, 4.5, step);
      model.current.scale.setScalar(s);
    }
    if (accent.current) {
      accent.current.color.lerp(targetTint, 1 - Math.exp(-step / courtConfig.durations.tint));
      accent.current.emissiveIntensity = THREE.MathUtils.damp(accent.current.emissiveIntensity, highlighted ? 0.1 : 0, 5, step);
    }
  });

  return <group ref={model}>
    <mesh castShadow receiveShadow position={[0, 0, -0.52]}>
      <extrudeGeometry args={[parts.upper, { depth: 1.04, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.04, bevelSegments: 2 }]} />
      <meshStandardMaterial color="#d0bc97" roughness={0.82} />
    </mesh>
    <mesh castShadow receiveShadow position={[0, 0, -0.56]}>
      <extrudeGeometry args={[parts.sole, { depth: 1.12, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.035, bevelSegments: 2 }]} />
      <meshStandardMaterial color="#e7ddc3" roughness={0.79} />
    </mesh>
    {[0.595, -0.595].map((z, i) => <group key={i} position={[0, 0, z]}>
      <mesh castShadow><shapeGeometry args={[parts.panel]} /><meshStandardMaterial ref={i === 0 ? accent : undefined} color={courtConfig.variants[variant]} emissive={courtConfig.variants[variant]} emissiveIntensity={0} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, i ? -0.006 : 0.006]}><shapeGeometry args={[parts.textile]} /><meshStandardMaterial map={weave} roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, i ? -0.009 : 0.009]}><shapeGeometry args={[parts.toe]} /><meshStandardMaterial color="#f0e7d0" roughness={0.82} side={THREE.DoubleSide} /></mesh>
    </group>)}
    <mesh castShadow position={[-0.83, 0.78, 0]} rotation={[0, 0, -0.18]}>
      <boxGeometry args={[0.42, 0.95, 0.66]} />
      <meshStandardMaterial color="#e0cfaa" roughness={0.92} />
    </mesh>
    <mesh position={[-1.19, 0.33, 0.615]} rotation={[0, 0, 0.15]}><planeGeometry args={[0.15, 0.84]} /><meshStandardMaterial color="#aa8a5b" roughness={0.93} side={THREE.DoubleSide} /></mesh>
    {parts.laces.map((curve, i) => <mesh key={i} castShadow><tubeGeometry args={[curve, 12, 0.015, 5, false]} /><meshStandardMaterial color="#f4e9d0" roughness={0.89} /></mesh>)}
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-1.25 + i * 0.35, -0.649, 0]}>
      <boxGeometry args={[0.07, 0.018, 0.91]} />
      <meshStandardMaterial color="#a8946e" roughness={0.95} />
    </mesh>)}
    <mesh position={[0, -0.47, 0.57]}><boxGeometry args={[2.76, 0.026, 0.011]} /><meshBasicMaterial color="#b29d75" /></mesh>
  </group>;
}
