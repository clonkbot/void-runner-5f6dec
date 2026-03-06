import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GridFloor() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#ff00ff') },
      uColor2: { value: new THREE.Color('#00ffff') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vec2 grid = abs(fract(vPosition.xz * 0.5 - 0.5) - 0.5) / fwidth(vPosition.xz * 0.5);
        float line = min(grid.x, grid.y);
        float gridValue = 1.0 - min(line, 1.0);

        vec2 bigGrid = abs(fract(vPosition.xz * 0.1 - 0.5) - 0.5) / fwidth(vPosition.xz * 0.1);
        float bigLine = min(bigGrid.x, bigGrid.y);
        float bigGridValue = 1.0 - min(bigLine, 1.0);

        float dist = length(vPosition.xz) * 0.05;
        float fade = 1.0 - smoothstep(0.0, 1.0, dist);

        float wave = sin(vPosition.z * 0.3 + uTime * 2.0) * 0.5 + 0.5;
        vec3 color = mix(uColor1, uColor2, wave);

        float alpha = (gridValue * 0.3 + bigGridValue * 0.7) * fade * 0.6;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        {...shader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
