import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AsteroidProps {
  position: THREE.Vector3
  scale: number
  rotationSpeed: THREE.Vector3
}

export default function Asteroid({ position, scale, rotationSpeed }: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Create irregular asteroid geometry
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1)
    const positions = geo.attributes.position

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      const noise = 0.7 + Math.random() * 0.6
      positions.setXYZ(i, x * noise, y * noise, z * noise)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x * delta
      meshRef.current.rotation.y += rotationSpeed.y * delta
      meshRef.current.rotation.z += rotationSpeed.z * delta
    }
  })

  const color = useMemo(() => {
    const hue = 0.05 + Math.random() * 0.1 // Orange to brown
    return new THREE.Color().setHSL(hue, 0.3, 0.2 + Math.random() * 0.2)
  }, [])

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}
