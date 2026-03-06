import { useRef, useMemo, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Spaceship from './Spaceship'
import Asteroid from './Asteroid'
import Projectile from './Projectile'
import Explosion from './Explosion'
import GridFloor from './GridFloor'

interface GameProps {
  gameState: 'menu' | 'playing' | 'gameover'
  addScore: (points: number) => void
  takeDamage: (damage: number) => void
}

interface AsteroidData {
  id: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  scale: number
  rotationSpeed: THREE.Vector3
  health: number
}

interface ProjectileData {
  id: number
  position: THREE.Vector3
  velocity: THREE.Vector3
}

interface ExplosionData {
  id: number
  position: THREE.Vector3
  scale: number
}

export default function Game({ gameState, addScore, takeDamage }: GameProps) {
  const shipRef = useRef<THREE.Group>(null)
  const shipPosition = useRef(new THREE.Vector3(0, 0, 0))
  const shipVelocity = useRef(new THREE.Vector3(0, 0, 0))
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0))

  const asteroidsRef = useRef<AsteroidData[]>([])
  const projectilesRef = useRef<ProjectileData[]>([])
  const explosionsRef = useRef<ExplosionData[]>([])

  const nextId = useRef(0)
  const lastShot = useRef(0)
  const spawnTimer = useRef(0)

  const forceUpdate = useRef(0)
  const [, setTick] = React.useState(0)

  const { size, camera } = useThree()

  const keys = useRef({
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
    ' ': false
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key as keyof typeof keys.current
      if (key in keys.current) {
        keys.current[key] = true
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key as keyof typeof keys.current
      if (key in keys.current) {
        keys.current[key] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Touch/mouse controls
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
      if (gameState !== 'playing') return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      const x = ((clientX / size.width) * 2 - 1) * 12
      const z = ((clientY / size.height) * 2 - 1) * 8

      targetPosition.current.set(
        Math.max(-10, Math.min(10, x)),
        0,
        Math.max(-6, Math.min(6, z))
      )
    }

    const handlePointerDown = () => {
      if (gameState === 'playing') {
        keys.current[' '] = true
      }
    }

    const handlePointerUp = () => {
      keys.current[' '] = false
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove as unknown as EventListener)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove as unknown as EventListener)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [gameState, size])

  // Reset game
  useEffect(() => {
    if (gameState === 'playing') {
      shipPosition.current.set(0, 0, 0)
      shipVelocity.current.set(0, 0, 0)
      targetPosition.current.set(0, 0, 0)
      asteroidsRef.current = []
      projectilesRef.current = []
      explosionsRef.current = []
      spawnTimer.current = 0
    }
  }, [gameState])

  const spawnAsteroid = useCallback(() => {
    const side = Math.floor(Math.random() * 4)
    let x: number, z: number

    switch (side) {
      case 0: x = -20; z = Math.random() * 20 - 10; break
      case 1: x = 20; z = Math.random() * 20 - 10; break
      case 2: x = Math.random() * 40 - 20; z = -15; break
      default: x = Math.random() * 40 - 20; z = 15; break
    }

    const targetX = shipPosition.current.x + (Math.random() - 0.5) * 10
    const targetZ = shipPosition.current.z + (Math.random() - 0.5) * 6

    const direction = new THREE.Vector3(targetX - x, 0, targetZ - z).normalize()
    const speed = 3 + Math.random() * 4

    const scale = 0.5 + Math.random() * 1.5

    asteroidsRef.current.push({
      id: nextId.current++,
      position: new THREE.Vector3(x, 0, z),
      velocity: direction.multiplyScalar(speed),
      scale,
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      health: Math.ceil(scale * 2)
    })
  }, [])

  const shoot = useCallback(() => {
    const now = Date.now()
    if (now - lastShot.current < 150) return
    lastShot.current = now

    projectilesRef.current.push({
      id: nextId.current++,
      position: shipPosition.current.clone().add(new THREE.Vector3(0, 0.5, -1)),
      velocity: new THREE.Vector3(0, 0, -30)
    })
  }, [])

  const createExplosion = useCallback((position: THREE.Vector3, scale: number) => {
    explosionsRef.current.push({
      id: nextId.current++,
      position: position.clone(),
      scale
    })
  }, [])

  useFrame((state, delta) => {
    if (gameState !== 'playing') {
      // Gentle camera movement in menu
      camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2
      camera.position.z = 12 + Math.cos(state.clock.elapsedTime * 0.15) * 2
      camera.lookAt(0, 0, 0)
      return
    }

    // Ship movement
    const moveSpeed = 15
    const friction = 0.92

    if (keys.current.a || keys.current.ArrowLeft) shipVelocity.current.x -= moveSpeed * delta
    if (keys.current.d || keys.current.ArrowRight) shipVelocity.current.x += moveSpeed * delta
    if (keys.current.w || keys.current.ArrowUp) shipVelocity.current.z -= moveSpeed * delta
    if (keys.current.s || keys.current.ArrowDown) shipVelocity.current.z += moveSpeed * delta

    // Follow touch/mouse target
    const toTarget = targetPosition.current.clone().sub(shipPosition.current)
    if (toTarget.length() > 0.1) {
      shipVelocity.current.add(toTarget.multiplyScalar(delta * 3))
    }

    shipVelocity.current.multiplyScalar(friction)
    shipPosition.current.add(shipVelocity.current.clone().multiplyScalar(delta * 5))

    // Clamp position
    shipPosition.current.x = Math.max(-10, Math.min(10, shipPosition.current.x))
    shipPosition.current.z = Math.max(-6, Math.min(6, shipPosition.current.z))

    if (shipRef.current) {
      shipRef.current.position.copy(shipPosition.current)
      shipRef.current.rotation.z = -shipVelocity.current.x * 0.15
      shipRef.current.rotation.x = shipVelocity.current.z * 0.1
    }

    // Shooting
    if (keys.current[' ']) {
      shoot()
    }

    // Spawn asteroids
    spawnTimer.current += delta
    if (spawnTimer.current > 0.8) {
      spawnTimer.current = 0
      spawnAsteroid()
    }

    // Update projectiles
    projectilesRef.current = projectilesRef.current.filter(p => {
      p.position.add(p.velocity.clone().multiplyScalar(delta))
      return p.position.z > -30 && p.position.z < 30
    })

    // Update asteroids and check collisions
    const projectilesToRemove = new Set<number>()
    const asteroidsToRemove = new Set<number>()

    asteroidsRef.current.forEach(asteroid => {
      asteroid.position.add(asteroid.velocity.clone().multiplyScalar(delta))

      // Check projectile collisions
      projectilesRef.current.forEach(projectile => {
        if (projectile.position.distanceTo(asteroid.position) < asteroid.scale + 0.5) {
          projectilesToRemove.add(projectile.id)
          asteroid.health--

          if (asteroid.health <= 0) {
            asteroidsToRemove.add(asteroid.id)
            createExplosion(asteroid.position, asteroid.scale)
            addScore(Math.ceil(asteroid.scale * 100))
          }
        }
      })

      // Check ship collision
      if (asteroid.position.distanceTo(shipPosition.current) < asteroid.scale + 0.8) {
        asteroidsToRemove.add(asteroid.id)
        createExplosion(asteroid.position, asteroid.scale)
        takeDamage(20)
      }

      // Remove if out of bounds
      if (asteroid.position.z > 15 || asteroid.position.z < -25 ||
          Math.abs(asteroid.position.x) > 25) {
        asteroidsToRemove.add(asteroid.id)
      }
    })

    projectilesRef.current = projectilesRef.current.filter(p => !projectilesToRemove.has(p.id))
    asteroidsRef.current = asteroidsRef.current.filter(a => !asteroidsToRemove.has(a.id))

    // Update explosions
    explosionsRef.current = explosionsRef.current.filter(e => {
      e.scale *= 0.95
      return e.scale > 0.1
    })

    // Camera follow
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, shipPosition.current.x * 0.3, delta * 2)
    camera.lookAt(shipPosition.current.x * 0.5, 0, -5)

    // Force re-render for React components
    forceUpdate.current++
    if (forceUpdate.current % 2 === 0) {
      setTick(t => t + 1)
    }
  })

  const asteroidElements = useMemo(() =>
    asteroidsRef.current.map(a => (
      <Asteroid
        key={a.id}
        position={a.position}
        scale={a.scale}
        rotationSpeed={a.rotationSpeed}
      />
    )), [asteroidsRef.current.length, forceUpdate.current])

  const projectileElements = useMemo(() =>
    projectilesRef.current.map(p => (
      <Projectile key={p.id} position={p.position} />
    )), [projectilesRef.current.length, forceUpdate.current])

  const explosionElements = useMemo(() =>
    explosionsRef.current.map(e => (
      <Explosion key={e.id} position={e.position} scale={e.scale} />
    )), [explosionsRef.current.length, forceUpdate.current])

  return (
    <>
      <GridFloor />
      <Spaceship ref={shipRef} />
      {asteroidElements}
      {projectileElements}
      {explosionElements}
    </>
  )
}

import React from 'react'
