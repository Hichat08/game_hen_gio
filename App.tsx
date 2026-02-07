
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import ResultOverlay from './components/ResultOverlay';

export type GameState = 'IDLE' | 'PLAYING' | 'EXPLODED';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [direction, setDirection] = useState<'CW' | 'CCW'>('CW'); // Clockwise / Counter-Clockwise
  const [result, setResult] = useState<{ mission: string; title: string } | null>(null);
  
  // Audio refs
  const tickAudio = useRef<HTMLAudioElement | null>(null);
  const explosionAudio = useRef<HTMLAudioElement | null>(null);
  const bgAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    explosionAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1002/1002-preview.mp3');
    tickAudio.current.loop = true;
    bgAudio.current = new Audio('/bgm.mp3');
    bgAudio.current.loop = true;
    bgAudio.current.volume = 0;
  }, []);

  const fadeVolumeTo = useCallback((audio: HTMLAudioElement | null, target: number, duration = 700) => {
    if (!audio) return;
    const start = performance.now();
    const from = audio.volume;
    const clampedTarget = Math.max(0, Math.min(1, target));

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      audio.volume = from + (clampedTarget - from) * t;
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  const startGame = () => {
    setGameState('PLAYING');
    setResult(null);
    if (tickAudio.current) {
      tickAudio.current.playbackRate = 1.0;
      tickAudio.current.play().catch(() => {});
    }
    if (bgAudio.current) {
      bgAudio.current.play().catch(() => {});
      fadeVolumeTo(bgAudio.current, 0.35, 900);
    }
  };

  const explode = useCallback((mission: string, title: string) => {
    setGameState('EXPLODED');
    setResult({ mission, title });
    
    if (tickAudio.current) {
      tickAudio.current.pause();
      tickAudio.current.currentTime = 0;
    }
    if (explosionAudio.current) {
      explosionAudio.current.play().catch(() => {});
    }
    fadeVolumeTo(bgAudio.current, 0.08, 600);
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 500]);
    }
  }, [fadeVolumeTo]);

  const toggleDirection = () => {
    setDirection(prev => prev === 'CW' ? 'CCW' : 'CW');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[120px]"></div>
      </div>

      <header className="z-10 text-center mt-8">
        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
          TRUYỀN LY HẸN GIỜ
        </h1>
        <p className="text-slate-400 mt-2 font-medium uppercase tracking-[0.2em] text-xs">Chuyền nhanh kẻo "chết"!</p>
      </header>

      <main className="z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <GameBoard 
          gameState={gameState} 
          onExplode={explode} 
          direction={direction}
        />
        
        <div className="mt-12 flex flex-col items-center gap-4 w-full">
          {gameState === 'IDLE' && (
            <button 
              onClick={startGame}
              className="group relative px-12 py-5 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl font-black text-2xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] transition-all active:scale-95 hover:scale-105"
            >
              BẮT ĐẦU CHUYỀN 🍻
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          )}

          {gameState === 'PLAYING' && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <span className="text-slate-400 text-sm font-bold uppercase">Hướng:</span>
                <button 
                  onClick={toggleDirection}
                  className="flex items-center gap-2 text-orange-400 font-black hover:text-orange-300 transition-colors"
                >
                  {direction === 'CW' ? 'THUẬN CHIỀU ↻' : 'NGƯỢC CHIỀU ↺'}
                </button>
              </div>
              <p className="text-red-500 animate-pulse font-bold text-center">
                CHUYỀN NGAY! <br/> <span className="text-xs text-slate-500 uppercase">Điện thoại đặt giữa bàn</span>
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="z-10 mb-8 text-center">
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em]">Càng lâu càng dễ say</p>
      </footer>
      <div className="footer z-10 mb-6 text-center px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
          © 2026 – Phiên bản 1.1.2
        </div>
        <div className="mt-1 text-sm text-slate-200">
          Nhà phát triển: <span className="font-extrabold text-white">LÒ VĂN VIỆT</span>
        </div>
      </div>

      {result && (
        <ResultOverlay 
          mission={result.mission} 
          title={result.title} 
          onRestart={() => {
            setGameState('IDLE');
            setResult(null);
            fadeVolumeTo(bgAudio.current, 0.25, 600);
          }} 
        />
      )}
    </div>
  );
};

export default App;
