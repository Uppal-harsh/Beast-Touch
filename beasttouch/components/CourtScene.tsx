'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Props = { area: number; progress?: number; reduced: boolean };

function Shoe({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);
  const parts = useMemo(() => {
    const upper = new THREE.Shape();
    upper.moveTo(-1.58, -0.2);
    upper.quadraticCurveTo(-1.58, 0.08, -1.38, 0.4);
    upper.lineTo(-1.1, 1.12);
    upper.quadraticCurveTo(-0.91, 1.36, -0.61, 1.22);
    upper.lineTo(-0.32, 0.54);
    upper.quadraticCurveTo(0.32, 0.42, 1.37, 0.04);
    upper.quadraticCurveTo(1.7, -0.14, 1.52, -0.29);
    upper.lineTo(-1.42, -0.3);
    upper.closePath();
    const sole = new THREE.Shape();
    sole.moveTo(-1.65, -0.28);
    sole.lineTo(1.55, -0.28);
    sole.quadraticCurveTo(1.82, -0.32, 1.73, -0.48);
    sole.lineTo(1.56, -0.63);
    sole.lineTo(-1.54, -0.63);
    sole.quadraticCurveTo(-1.73, -0.57, -1.65, -0.28);
    sole.closePath();
    const panel = new THREE.Shape();
    panel.moveTo(-1.22, -0.12);
    panel.lineTo(-1.04, 0.67);
    panel.quadraticCurveTo(-0.82, 0.92, -0.45, 0.48);
    panel.lineTo(0.59, 0.12);
    panel.quadraticCurveTo(0.18, -0.16, -0.27, -0.12);
    panel.closePath();
    const toe = new THREE.Shape();
    toe.moveTo(0.62, -0.2);
    toe.lineTo(0.53, 0.17);
    toe.quadraticCurveTo(1.18, 0.11, 1.51, -0.08);
    toe.lineTo(1.47, -0.21);
    toe.closePath();
    const laces = Array.from({ length: 5 }, (_, i) => {
      const x = -0.43 - i * 0.12, y = 0.31 + i * 0.14;
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(x - 0.21, y + 0.03, 0.59),
        new THREE.Vector3(x, y - 0.02, 0.67),
        new THREE.Vector3(x + 0.23, y + 0.02, 0.59),
      ]);
    });
    return { upper, sole, panel, toe, laces };
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    if (!reduced) time.current += Math.min(dt, 0.05);
    group.current.rotation.y = -0.37 + time.current * 0.23;
    group.current.rotation.x = 0.04 + (reduced ? 0 : Math.sin(time.current * 0.8) * 0.055);
    group.current.rotation.z = -0.1 + (reduced ? 0 : Math.sin(time.current * 0.65) * 0.045);
  });

  return <group position={[-2.9, 3.25, -2.8]}>
    <group ref={group} scale={1.2}>
      <mesh castShadow receiveShadow position={[0, 0, -0.52]}>
        <extrudeGeometry args={[parts.upper, { depth: 1.04, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.045, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#bda173" roughness={0.89} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, -0.56]}>
        <extrudeGeometry args={[parts.sole, { depth: 1.12, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.035, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#d8c79f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.58]}><shapeGeometry args={[parts.panel]} /><meshStandardMaterial color="#dbc492" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, 0.6]}><shapeGeometry args={[parts.toe]} /><meshStandardMaterial color="#e4d6b0" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      <mesh position={[-1.15, 0.3, 0.61]} rotation={[0, 0, 0.16]}><planeGeometry args={[0.16, 0.83]} /><meshStandardMaterial color="#947346" roughness={0.94} side={THREE.DoubleSide} /></mesh>
      {parts.laces.map((curve, i) => <mesh key={i} castShadow><tubeGeometry args={[curve, 12, 0.013, 5, false]} /><meshStandardMaterial color="#eee0bf" roughness={0.9} /></mesh>)}
      <mesh position={[0, -0.46, 0.58]}><boxGeometry args={[2.77, 0.02, 0.01]} /><meshBasicMaterial color="#a48657" /></mesh>
    </group>
  </group>;
}

function Stripe({ x = 0, z = 0, width, length }: { x?: number; z?: number; width: number; length: number }) {
  return <mesh position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[width, length]} />
    <meshBasicMaterial color="#d1c5a7" transparent opacity={0.72} depthWrite={false} />
  </mesh>;
}

function Room({ area, progress, reduced }: Required<Props>) {
  const { camera, pointer } = useThree();
  const desired = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(-0.5, 2, -4), []);
  const desiredAim = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const shift = area === 1 ? -1.2 : area === 2 ? 1.1 : 0;
    desired.set(shift + t * 2.6 + (reduced ? 0 : pointer.x * 0.16), 3.8 + t * 0.4 + (reduced ? 0 : pointer.y * 0.1), 11.6 - t * 4.6);
    const factor = reduced ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * 2.4);
    camera.position.lerp(desired, factor);
    desiredAim.set(-0.5 + t * 1.4, 2 + t * 0.12, -4);
    aim.lerp(desiredAim, factor);
    camera.lookAt(aim);
  });

  return <>
    <color attach="background" args={['#08090a']} />
    <fog attach="fog" args={['#08090a', 19, 43]} />
    <ambientLight intensity={0.18} />
    <hemisphereLight args={['#b7aa91', '#0c0d0e', 0.37]} />
    <spotLight position={[-5, 11, 4]} angle={0.54} penumbra={0.88} intensity={90} color="#efc98c" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
    <spotLight position={[7, 9, -1]} angle={0.62} penumbra={0.86} intensity={60} color="#d3ad77" />
    <pointLight position={[-3, 4, -1]} intensity={8} distance={8} color="#d6aa65" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[48, 48]} /><meshStandardMaterial color="#393832" roughness={0.48} metalness={0.12} /></mesh>
    <mesh position={[0, 6, -12]} receiveShadow><boxGeometry args={[36, 12, 0.45]} /><meshStandardMaterial color="#111214" roughness={1} /></mesh>
    <mesh position={[16, 6, 0]} receiveShadow><boxGeometry args={[0.5, 12, 28]} /><meshStandardMaterial color="#4a4944" roughness={1} /></mesh>
    <mesh position={[-16, 6, 0]} receiveShadow><boxGeometry args={[0.5, 12, 28]} /><meshStandardMaterial color="#141617" roughness={1} /></mesh>
    <mesh position={[0, 11.7, 0]}><boxGeometry args={[35, 0.4, 28]} /><meshStandardMaterial color="#101112" roughness={1} /></mesh>
    {[-11, -5, 1, 7, 13].map(x => <mesh key={x} position={[x, 10.8, 0]} castShadow><boxGeometry args={[0.36, 0.85, 28]} /><meshStandardMaterial color="#202122" metalness={0.4} roughness={0.7} /></mesh>)}
    {[-8, 0, 8].map(z => <mesh key={z} position={[0, 10.55, z]} castShadow><boxGeometry args={[35, 0.42, 0.3]} /><meshStandardMaterial color="#17191a" metalness={0.4} roughness={0.7} /></mesh>)}
    <Stripe z={-1.5} width={27} length={0.045} /><Stripe z={10} width={27} length={0.045} />
    <Stripe x={-13.5} z={4.25} width={0.045} length={11.5} /><Stripe x={13.5} z={4.25} width={0.045} length={11.5} />
    <Stripe z={4.25} width={0.045} length={11.5} />
    {[2.48, 0.52].map((radius, i) => <mesh key={i} position={[0, 0.023, 4.25]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.04, radius, i ? 64 : 96]} />
      <meshBasicMaterial color="#d7c9a8" transparent opacity={0.74} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>)}
    <group position={[9, 4.7, -10.7]}>
      <mesh castShadow><boxGeometry args={[2.45, 1.5, 0.13]} /><meshStandardMaterial color="#aaa493" roughness={0.9} /></mesh>
      <mesh position={[0, -0.14, 0.072]}><planeGeometry args={[0.95, 0.7]} /><meshBasicMaterial color="#333435" /></mesh>
      <mesh position={[0, -0.78, 0.55]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.4, 0.038, 8, 32]} /><meshStandardMaterial color="#b98c52" metalness={0.4} roughness={0.5} /></mesh>
    </group>
    <Shoe reduced={reduced} />
  </>;
}

export default function CourtScene({ area, progress = 0, reduced }: Props) {
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 3.8, 11.6], fov: 57, near: 0.05, far: 50 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} aria-label="Three-dimensional industrial basketball court with a floating BeastTouch sneaker">
    <Room area={area} progress={progress} reduced={reduced} />
  </Canvas>;
}
