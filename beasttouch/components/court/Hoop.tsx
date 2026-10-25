import * as THREE from 'three';

/** An original, deliberately simple metal court fixture. */
export default function Hoop() {
  return <group position={[0, 0, -10.9]}>
    <mesh position={[0, 3.35, -0.18]} castShadow>
      <boxGeometry args={[0.16, 6.7, 0.18]} />
      <meshStandardMaterial color="#272c2d" metalness={0.65} roughness={0.55} />
    </mesh>
    <mesh position={[0, 6.46, 0.24]} castShadow>
      <boxGeometry args={[2.4, 1.45, 0.09]} />
      <meshStandardMaterial color="#a5a398" metalness={0.2} roughness={0.65} />
    </mesh>
    <mesh position={[0, 6.32, 0.294]}>
      <planeGeometry args={[0.93, 0.66]} />
      <meshBasicMaterial color="#302f2b" />
    </mesh>
    <mesh position={[0, 6.32, 0.301]}>
      <planeGeometry args={[0.77, 0.51]} />
      <meshBasicMaterial color="#b8ad94" side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 5.86, 0.75]} castShadow>
      <boxGeometry args={[0.1, 0.08, 0.94]} />
      <meshStandardMaterial color="#404342" metalness={0.72} roughness={0.4} />
    </mesh>
    <mesh position={[0, 5.81, 1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.45, 0.033, 8, 36]} />
      <meshStandardMaterial color="#b86d3f" metalness={0.62} roughness={0.42} />
    </mesh>
    {Array.from({ length: 12 }, (_, i) => {
      const angle = i / 12 * Math.PI * 2;
      const x = Math.cos(angle), z = Math.sin(angle);
      return <mesh key={i} position={[x * 0.36, 5.48, 1.1 + z * 0.36]} rotation={[z * 0.08, 0, x * -0.08]}>
        <cylinderGeometry args={[0.006, 0.006, 0.52, 4]} />
        <meshStandardMaterial color="#cfc8b4" transparent opacity={0.7} roughness={1} />
      </mesh>;
    })}
  </group>;
}
