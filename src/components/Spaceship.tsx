import { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Spaceship = forwardRef<THREE.Group>((_, ref) => {
  const engineGlow = useRef<THREE.PointLight>(null)
  const trailRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (engineGlow.current) {
      engineGlow.current.intensity = 2 + Math.sin(time * 20) * 0.5
    }

    if (trailRef.current) {
      trailRef.current.scale.z = 1 + Math.sin(time * 15) * 0.3
    }
  })

  return (
    <group ref={ref}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.5, 2, 6]} />
        <meshStandardMaterial
          color="#4040ff"
          emissive="#2020aa"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.2, -0.3]} rotation={[Math.PI * 0.1, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.6, -0.1, 0.3]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.08, 0.6]} />
        <meshStandardMaterial
          color="#3030cc"
          emissive="#1010aa"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.6, -0.1, 0.3]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.08, 0.6]} />
        <meshStandardMaterial
          color="#3030cc"
          emissive="#1010aa"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Wing tips - left */}
      <mesh position={[-1, -0.2, 0.4]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Wing tips - right */}
      <mesh position={[1, -0.2, 0.4]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Engine trail */}
      <mesh ref={trailRef} position={[0, -0.1, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Engine glow */}
      <pointLight
        ref={engineGlow}
        position={[0, 0, 1]}
        color="#ff6600"
        intensity={2}
        distance={4}
      />

      {/* Ship ambient glow */}
      <pointLight
        position={[0, 0.5, 0]}
        color="#4040ff"
        intensity={0.5}
        distance={3}
      />
    </group>
  )
})

Spaceship.displayName = 'Spaceship'

export default Spaceship
