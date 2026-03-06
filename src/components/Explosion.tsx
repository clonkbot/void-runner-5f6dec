import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ExplosionProps {
  position: THREE.Vector3
  scale: number
}

export default function Explosion({ position, scale }: ExplosionProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const count = 30
    const positions = new Float32Array(count * 3)
    const velocities: THREE.Vector3[] = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ))
    }

    return { positions, velocities }
  }, [])

  useFrame((_, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute

      for (let i = 0; i < particles.velocities.length; i++) {
        positions.setXYZ(
          i,
          positions.getX(i) + particles.velocities[i].x * delta,
          positions.getY(i) + particles.velocities[i].y * delta,
          positions.getZ(i) + particles.velocities[i].z * delta
        )
      }

      positions.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Explosion sphere */}
      <mesh scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={scale * 0.6}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ff8800"
          size={0.3}
          transparent
          opacity={0.8}
        />
      </points>

      {/* Light */}
      <pointLight
        color="#ff4400"
        intensity={scale * 3}
        distance={scale * 5}
      />
    </group>
  )
}
