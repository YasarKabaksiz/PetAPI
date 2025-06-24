import React, { useState, useEffect, useRef } from 'react';
import useInterval from '../../hooks/useInterval';

const LANES = 4;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const TILE_WIDTH = GAME_WIDTH / LANES;
const TILE_HEIGHT = 70;
const TARGET_Y = GAME_HEIGHT - 90; // Hedef çizgisi
const MAX_MISSED = 3;

function getRandomLane() {
  return Math.floor(Math.random() * LANES);
}

let tileId = 0;

// Dinamik hız fonksiyonu (frameCount'a göre)
function getCurrentSpeed(frameCount) {
  if (frameCount < 300) return 4; // ilk ~5 sn
  if (frameCount < 600) return 6; // 5-10 sn
  if (frameCount < 1200) return 8; // 10-20 sn
  return 10; // 20. sn ve sonrası
}
// Dinamik karo ekleme aralığı (frameCount'a göre)
function getTileInterval(frameCount) {
  if (frameCount < 300) return 32;
  if (frameCount < 600) return 26;
  if (frameCount < 1200) return 20;
  return 15;
}

export default function RhythmGame({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [missed, setMissed] = useState(0);
  const [tiles, setTiles] = useState([]); // {id, lane, y, status}
  const [gameOver, setGameOver] = useState(false);
  const [hitEffect, setHitEffect] = useState({}); // {tileId: true}
  const frameCount = useRef(0);

  useInterval(() => {
    frameCount.current++;
    const speed = getCurrentSpeed(frameCount.current);
    const tileInterval = getTileInterval(frameCount.current);
    // Karoları hareket ettir
    setTiles(prev => prev.map(tile => ({ ...tile, y: tile.y + speed })));
    // Belirli aralıklarla yeni karo ekle
    if (frameCount.current % tileInterval === 0) {
      setTiles(prev => [
        ...prev,
        {
          id: tileId++,
          lane: getRandomLane(),
          y: -TILE_HEIGHT,
          status: 'active'
        }
      ]);
    }
    // Kaçan karoları kontrol et
    setTiles(prev => {
      const filtered = prev.filter(tile => {
        if (tile.y > TARGET_Y + 40 && tile.status === 'active') {
          setMissed(m => m + 1);
          setCombo(0);
          return false;
        }
        return true;
      });
      return filtered;
    });
  }, !gameOver ? 16 : null);

  // Oyun sonu kontrolü
  useEffect(() => {
    if (missed >= MAX_MISSED && !gameOver) {
      setGameOver(true);
      setTimeout(() => onGameEnd(score), 1200);
    }
  }, [missed, gameOver, onGameEnd, score]);

  // Karo tıklama
  const handleTileClick = (tile) => {
    // Artık karo ekranda olduğu sürece tıklanabilir
    setScore(s => s + 10 + combo * 2);
    setCombo(c => c + 1);
    setHitEffect(eff => ({ ...eff, [tile.id]: true }));
    setTimeout(() => setHitEffect(eff => ({ ...eff, [tile.id]: false })), 120);
    setTiles(prev => prev.filter(t => t.id !== tile.id));
  };

  // Boş kanala tıklama
  const handleLaneClick = (lane) => {
    // Hedef bölgesinde aktif karo yoksa combo sıfırla
    const hasTile = tiles.some(tile => tile.lane === lane && tile.y >= TARGET_Y - 40 && tile.y <= TARGET_Y + 40);
    if (!hasTile) setCombo(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-lg font-bold text-yellow-300">Ritim Oyunu (Piano Tiles)</div>
      <div className="mb-2 text-gray-200">Skor: <span className="font-mono">{score}</span> | Combo: <span className="font-mono">{combo}</span> | Kaçan: <span className="font-mono">{missed} / {MAX_MISSED}</span></div>
      <div
        className="relative bg-slate-800 rounded-xl border-2 border-yellow-400 overflow-hidden select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        <div className="flex w-full h-full absolute top-0 left-0 z-10">
          {[...Array(LANES)].map((_, lane) => (
            <div
              key={lane}
              className="flex-1 h-full border-x border-slate-600 relative cursor-pointer"
              onMouseDown={() => handleLaneClick(lane)}
            >
              {/* Karolar */}
              {tiles.filter(tile => tile.lane === lane).map(tile => (
                <div
                  key={tile.id}
                  className={`absolute left-1/2 -translate-x-1/2 rounded-lg shadow-lg transition-all duration-75 ${hitEffect[tile.id] ? 'bg-green-400 scale-95' : 'bg-gradient-to-b from-cyan-400 to-blue-600'} ${gameOver ? 'opacity-60' : ''}`}
                  style={{
                    top: tile.y,
                    width: TILE_WIDTH * 0.8,
                    height: TILE_HEIGHT,
                    zIndex: 5,
                    border: '2px solid #0ff',
                    boxShadow: '0 2px 12px #0ff4',
                    cursor: 'pointer',
                  }}
                  onMouseDown={() => handleTileClick(tile)}
                />
              ))}
              {/* Hedef bölgesi */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: TARGET_Y,
                  width: TILE_WIDTH * 0.8,
                  height: 8,
                  background: 'rgba(255,255,0,0.25)',
                  borderRadius: 4,
                  zIndex: 8,
                  boxShadow: '0 0 8px 2px #ff0a',
                }}
              />
            </div>
          ))}
        </div>
        {/* Alt çizgi */}
        <div className="absolute left-0 w-full" style={{ top: TARGET_Y + 8, height: 4, background: 'rgba(255,255,0,0.15)', zIndex: 20 }} />
      </div>
      {gameOver && (
        <div className="mt-4 text-xl font-bold text-green-300 animate-bounce">Oyun Bitti! Puanın: {score}</div>
      )}
    </div>
  );
} 