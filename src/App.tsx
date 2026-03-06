import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { Stars } from '@react-three/drei'
import Game from './components/Game'
import GameUI from './components/GameUI'

function App() {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [highScore, setHighScore] = useState(0)

  const startGame = useCallback(() => {
    setScore(0)
    setHealth(100)
    setGameState('playing')
  }, [])

  const endGame = useCallback(() => {
    setHighScore(prev => Math.max(prev, score))
    setGameState('gameover')
  }, [score])

  const addScore = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  const takeDamage = useCallback((damage: number) => {
    setHealth(prev => {
      const newHealth = Math.max(0, prev - damage)
      if (newHealth <= 0) {
        setTimeout(() => endGame(), 100)
      }
      return newHealth
    })
  }, [endGame])

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 15, 50]} />

        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} color="#8080ff" />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ff00ff" distance={20} />
        <pointLight position={[-10, 3, -10]} intensity={0.5} color="#00ffff" distance={15} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <Suspense fallback={null}>
          <Game
            gameState={gameState}
            addScore={addScore}
            takeDamage={takeDamage}
          />
        </Suspense>
      </Canvas>

      <GameUI
        score={score}
        health={health}
        highScore={highScore}
        gameState={gameState}
        onStart={startGame}
        onRestart={startGame}
      />

      <footer className="absolute bottom-3 left-0 right-0 text-center pointer-events-none z-50">
        <p className="text-[10px] md:text-xs tracking-widest font-light"
           style={{
             color: 'rgba(120, 80, 200, 0.5)',
             fontFamily: 'Orbitron, monospace',
             textShadow: '0 0 10px rgba(120, 80, 200, 0.3)'
           }}>
          Requested by @Austin · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}

export default App
