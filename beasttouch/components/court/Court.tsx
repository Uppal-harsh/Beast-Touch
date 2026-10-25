'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { courtConfig } from './config';
import Hoop from './Hoop';

type Props = { quality: 'high' | 'low'; reducedMotion: boolean };

function makeFloorMaps() {
  const size = 512;
  const wood = document.createElement('canvas');
  const normal = document.createElement('canvas');
  wood.width = wood.height = normal.width = normal.height = size;
  const color = wood.getContext('2d');
  const bump = normal.getContext('2d');
  if (color && bump) {
    color.fillStyle = '#8b6345';
    color.fillRect(0, 0, size, size);
    bump.fillStyle = '#8080ff';
    bump.fillRect(0, 0, size, size);
    let seed = 97;
    const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
    for (let board = 0; board < 16; board++) {
      const y = board * 32;
      const light = Math.round(82 + random() * 22);
      color.fillStyle = `rgb(${light + 30},${light},${light - 20})`;
      color.fillRect(0, y + 1, size, 30);
      color.fillStyle = '#291b1560';
      color.fillRect(0, y, size, 1);
      color.fillRect(0, y + 31, size, 1);
      bump.fillStyle = '#7171fa';
      bump.fillRect(0, y, size, 1);
      bump.fillStyle = '#8f8fff';
      bump.fillRect(0, y + 31, size, 1);
      const split = 80 + Math.floor(random() * 350);
      color.fillStyle = '#38271966';
      color.fillRect(split, y + 1, 2, 30);
    }
    for (let i = 0; i < 2200; i++) {
      const x = random() * size, y = random() * size;
      color.strokeStyle = random() > 0.5 ? '#dfb78824' : '#3020151f';
      color.lineWidth = random() * 1.2;
      color.beginPath();
      color.moveTo(x, y);
      color.lineTo(x + 15 + random() * 65, y + (random() - 0.5) * 2);
      color.stroke();
    }
  }
  const map = new THREE.CanvasTexture(wood);
  const normalMap = new THREE.CanvasTexture(normal);
  for (const texture of [map, normalMap]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.3, 4.5);
    texture.anisotropy = 4;
  }
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, normalMap };
}

function makeWordmark() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 210;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 1024, 210);
    ctx.fillStyle = '#d8cbb1';
    ctx.font = '900 125px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BEASTTOUCH', 512, 106);
    ctx.fillStyle = courtConfig.colors.accent;
    ctx.fillRect(74, 176, 876, 8);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

function Floor({ quality }: { quality: Props['quality'] }) {
  const maps = useMemo(makeFloorMaps, []);
  useEffect(() => () => { maps.map.dispose(); maps.normalMap.dispose(); }, [maps]);
  const normalScale = useMemo(() => new THREE.Vector2(0.12, 0.12), []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[35, 40]} />
    {quality === 'high' ? <MeshReflectorMaterial
      color="#ad896e"
      map={maps.map}
      normalMap={maps.normalMap}
      normalScale={normalScale}
      roughness={0.44}
      metalness={0.06}
      mirror={0.15}
      mixBlur={0.75}
      mixStrength={0.4}
      blur={[50, 20]}
      resolution={512}
      depthScale={0.05}
      minDepthThreshold={0.35}
      maxDepthThreshold={1.2}
    /> : <meshStandardMaterial color="#b29578" map={maps.map} normalMap={maps.normalMap} normalScale={normalScale} roughness={0.48} metalness={0.025} />}
  </mesh>;
}

function Paint({ x = 0, z = 0, width, length, color = '#e6dbc1' }: { x?: number; z?: number; width: number; length: number; color?: string }) {
  return <mesh position={[x, 0.026, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[width, length]} />
    <meshBasicMaterial color={color} transparent opacity={0.7} depthWrite={false} />
  </mesh>;
}

function CourtLines() {
  const paint = '#e6dbc1';
  return <group>
    <Paint z={-9.2} width={19} length={0.055} />
    <Paint z={8.8} width={19} length={0.055} />
    <Paint x={-9.5} z={-0.2} width={0.055} length={18} />
    <Paint x={9.5} z={-0.2} width={0.055} length={18} />
    <Paint z={-0.2} width={19} length={0.052} />
    {[{ start: -9.2, end: -5.45 }, { start: 5.05, end: 8.8 }].map(({ start, end }) => <group key={start}>
      <Paint x={-2.35} z={(start + end) / 2} width={0.05} length={end - start} />
      <Paint x={2.35} z={(start + end) / 2} width={0.05} length={end - start} />
      <Paint z={start === -9.2 ? end : start} width={4.7} length={0.05} />
    </group>)}
    {[2.45, 0.55].map((radius, i) => <mesh key={i} position={[0, 0.028, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.045, radius, i ? 48 : 96]} />
      <meshBasicMaterial color={paint} transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>)}
    <mesh position={[0, 0.028, -5.45]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.1, 2.15, 64, 1, Math.PI, Math.PI]} />
      <meshBasicMaterial color={paint} transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
    {[{ z: -7.8, start: Math.PI, baseline: -9.2 }, { z: 7.4, start: 0, baseline: 8.8 }].map(({ z, start, baseline }) => <group key={z}>
      <mesh position={[0, 0.029, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.68, 6.73, 96, 1, start, Math.PI]} />
        <meshBasicMaterial color={paint} transparent opacity={0.72} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Paint x={-6.7} z={(z + baseline) / 2} width={0.05} length={Math.abs(z - baseline)} />
      <Paint x={6.7} z={(z + baseline) / 2} width={0.05} length={Math.abs(z - baseline)} />
    </group>)}
  </group>;
}

export default function Court({ quality }: Props) {
  const wordmark = useMemo(makeWordmark, []);
  useEffect(() => () => wordmark.dispose(), [wordmark]);
  return <group>
    <Floor quality={quality} />
    {[-7.325, 6.925].map(z => <mesh key={z} position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4.7, 3.75]} /><meshStandardMaterial color={courtConfig.colors.accent} roughness={0.46} /></mesh>)}
    <CourtLines />
    <mesh position={[0, 0.033, -0.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.6, 0.74]} /><meshBasicMaterial map={wordmark} transparent opacity={0.85} depthWrite={false} /></mesh>
    <mesh position={[0, 6.1, -12]} receiveShadow><boxGeometry args={[36, 12.2, 0.5]} /><meshStandardMaterial color="#15191c" roughness={0.98} /></mesh>
    <mesh position={[-17.6, 6.1, 0]} receiveShadow><boxGeometry args={[0.5, 12.2, 38]} /><meshStandardMaterial color="#1b2125" roughness={0.95} /></mesh>
    <mesh position={[17.6, 6.1, 0]} receiveShadow><boxGeometry args={[0.5, 12.2, 38]} /><meshStandardMaterial color="#46494a" roughness={0.95} /></mesh>
    <mesh position={[0, 12.4, 0]}><boxGeometry args={[36, 0.45, 38]} /><meshStandardMaterial color="#101519" roughness={1} /></mesh>
    {[-15, -9, -3, 3, 9, 15].map(x => <mesh key={x} position={[x, 11.5, 0]} castShadow={quality === 'high'}><boxGeometry args={[0.5, 0.9, 38]} /><meshStandardMaterial color="#2a3031" metalness={0.45} roughness={0.7} /></mesh>)}
    {[-9, -1, 7, 15].map(z => <mesh key={z} position={[0, 11.25, z]} castShadow={quality === 'high'}><boxGeometry args={[36, 0.45, 0.35]} /><meshStandardMaterial color="#20272a" metalness={0.45} roughness={0.68} /></mesh>)}
    {[-12, -6, 0, 6, 12].map(x => <mesh key={x} position={[x, 5.8, -11.6]}><boxGeometry args={[0.22, 11.6, 0.28]} /><meshStandardMaterial color="#292f31" roughness={0.8} /></mesh>)}
    <mesh position={[0, 4.2, -11.68]}><planeGeometry args={[10.5, 2.15]} /><meshBasicMaterial map={wordmark} transparent opacity={0.5} depthWrite={false} /></mesh>
    <mesh position={[16.95, 5.2, -3]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[13, 8]} /><meshStandardMaterial color="#5c5d59" roughness={0.97} /></mesh>
    <Hoop />
    <group position={[0, 0, -0.4]} rotation={[0, Math.PI, 0]}><Hoop /></group>
  </group>;
}
