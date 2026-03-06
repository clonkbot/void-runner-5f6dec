import * as THREE from 'three'

interface ProjectileProps {
  position: THREE.Vector3
}

export default function Projectile({ position }: ProjectileProps) {
  return (
    <group position={position}>
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>

      {/* Trail */}
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.8, 6]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Glow */}
      <pointLight
        color="#00ffff"
        intensity={0.5}
        distance={2}
      />
    </group>
  )
}
