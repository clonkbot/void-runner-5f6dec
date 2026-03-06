interface GameUIProps {
  score: number
  health: number
  highScore: number
  gameState: 'menu' | 'playing' | 'gameover'
  onStart: () => void
  onRestart: () => void
}

export default function GameUI({
  score,
  health,
  highScore,
  gameState,
  onStart,
  onRestart
}: GameUIProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* HUD - visible during gameplay */}
      {gameState === 'playing' && (
        <>
          {/* Score */}
          <div className="absolute top-4 md:top-6 left-4 md:left-8">
            <div className="text-[10px] md:text-xs tracking-[0.3em] text-cyan-400/70 mb-1"
                 style={{ fontFamily: 'Orbitron, monospace' }}>
              SCORE
            </div>
            <div className="text-2xl md:text-4xl font-bold text-white"
                 style={{
                   fontFamily: 'Orbitron, monospace',
                   textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)'
                 }}>
              {score.toLocaleString()}
            </div>
          </div>

          {/* Health bar */}
          <div className="absolute top-4 md:top-6 right-4 md:right-8 w-32 md:w-48">
            <div className="text-[10px] md:text-xs tracking-[0.3em] text-fuchsia-400/70 mb-1 text-right"
                 style={{ fontFamily: 'Orbitron, monospace' }}>
              SHIELD
            </div>
            <div className="h-2 md:h-3 bg-black/50 rounded-full overflow-hidden border border-fuchsia-500/30">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${health}%`,
                  background: health > 50
                    ? 'linear-gradient(90deg, #00ff88, #00ffff)'
                    : health > 25
                    ? 'linear-gradient(90deg, #ffaa00, #ff6600)'
                    : 'linear-gradient(90deg, #ff0066, #ff0000)',
                  boxShadow: health > 50
                    ? '0 0 20px rgba(0, 255, 200, 0.8)'
                    : health > 25
                    ? '0 0 20px rgba(255, 150, 0, 0.8)'
                    : '0 0 20px rgba(255, 0, 100, 0.8)'
                }}
              />
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 text-center">
            <div className="text-[9px] md:text-[10px] tracking-[0.2em] text-white/30"
                 style={{ fontFamily: 'Orbitron, monospace' }}>
              <span className="hidden md:inline">WASD / ARROWS TO MOVE · SPACE TO SHOOT</span>
              <span className="md:hidden">TAP TO MOVE · HOLD TO SHOOT</span>
            </div>
          </div>
        </>
      )}

      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="text-center px-4">
            {/* Title */}
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2 md:mb-4"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient 3s ease infinite',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 30px rgba(255, 0, 255, 0.5))'
                }}>
              VOID RUNNER
            </h1>

            <p className="text-sm md:text-lg text-cyan-300/60 tracking-[0.2em] md:tracking-[0.4em] mb-8 md:mb-12"
               style={{ fontFamily: 'Orbitron, monospace' }}>
              ASTEROID SURVIVAL
            </p>

            {/* Start button */}
            <button
              onClick={onStart}
              className="group relative px-8 md:px-12 py-3 md:py-4 text-base md:text-xl tracking-[0.3em] font-bold
                         border-2 border-cyan-400 text-cyan-400 bg-transparent
                         transition-all duration-300 hover:bg-cyan-400 hover:text-black
                         hover:shadow-[0_0_40px_rgba(0,255,255,0.6)]
                         active:scale-95"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <span className="relative z-10">START GAME</span>
              <div className="absolute inset-0 bg-cyan-400/10 blur-xl group-hover:bg-cyan-400/30 transition-all" />
            </button>

            {/* High score */}
            {highScore > 0 && (
              <div className="mt-6 md:mt-8 text-fuchsia-400/60 text-xs md:text-sm tracking-[0.2em]"
                   style={{ fontFamily: 'Orbitron, monospace' }}>
                HIGH SCORE: {highScore.toLocaleString()}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 md:mt-12 space-y-2 text-[10px] md:text-xs text-white/30 tracking-wider"
                 style={{ fontFamily: 'Orbitron, monospace' }}>
              <p className="hidden md:block">WASD OR ARROW KEYS TO MOVE</p>
              <p className="hidden md:block">SPACEBAR TO FIRE</p>
              <p className="md:hidden">TOUCH AND DRAG TO MOVE</p>
              <p className="md:hidden">TAP AND HOLD TO FIRE</p>
              <p>DESTROY ASTEROIDS TO SURVIVE</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm">
          <div className="text-center px-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wider mb-4 md:mb-6"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  color: '#ff0066',
                  textShadow: '0 0 30px rgba(255, 0, 102, 0.8), 0 0 60px rgba(255, 0, 102, 0.4)'
                }}>
              DESTROYED
            </h2>

            {/* Final score */}
            <div className="mb-6 md:mb-8">
              <div className="text-[10px] md:text-xs tracking-[0.3em] text-white/50 mb-2"
                   style={{ fontFamily: 'Orbitron, monospace' }}>
                FINAL SCORE
              </div>
              <div className="text-4xl md:text-6xl font-bold"
                   style={{
                     fontFamily: 'Orbitron, monospace',
                     background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent'
                   }}>
                {score.toLocaleString()}
              </div>
            </div>

            {/* Restart button */}
            <button
              onClick={onRestart}
              className="px-8 md:px-12 py-3 md:py-4 text-base md:text-xl tracking-[0.3em] font-bold
                         border-2 border-fuchsia-400 text-fuchsia-400 bg-transparent
                         transition-all duration-300 hover:bg-fuchsia-400 hover:text-black
                         hover:shadow-[0_0_40px_rgba(255,0,255,0.6)]
                         active:scale-95"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              RETRY
            </button>

            {/* High score notification */}
            {score >= highScore && score > 0 && (
              <div className="mt-4 md:mt-6 text-yellow-400 text-xs md:text-sm tracking-[0.2em] animate-pulse"
                   style={{ fontFamily: 'Orbitron, monospace' }}>
                NEW HIGH SCORE!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
