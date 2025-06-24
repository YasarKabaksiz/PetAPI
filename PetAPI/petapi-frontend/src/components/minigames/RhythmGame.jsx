import React, { useRef, useEffect, useState } from 'react';

const LANES = 4;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const TILE_WIDTH = GAME_WIDTH / LANES;
const TILE_HEIGHT = 70;
const TARGET_Y = GAME_HEIGHT - 90;
const MAX_MISSED = 3;
const TILE_COLOR = ['#06b6d4', '#2563eb', '#0ea5e9', '#38bdf8'];

function getRandomLane() {
  return Math.floor(Math.random() * LANES);
}

let tileId = 0;

export default function RhythmGame({ onGameEnd }) {
  const canvasRef = useRef();
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const tilesRef = useRef([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [missed, setMissed] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [tiles, setTiles] = useState([]);

  // Hız ve interval fonksiyonları
  const baseSpeed = 4;
  const baseInterval = 700; // ms cinsinden, sabit aralık
  function getTileSpeed() {
    return baseSpeed + (difficulty - 1) * 1.1;
  }

  // Zorluk artışı
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setDifficulty(d => +(d + 0.2).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Ana animasyon döngüsü
  useEffect(() => {
    if (gameOver) return;
    let lastTileAddTime = 0;
    function animate(time) {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }
      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;
      // Karoları hareket ettir
      const speed = getTileSpeed() * (deltaTime / 16.67);
      tilesRef.current.forEach(tile => {
        tile.y += speed;
      });
      // Yeni karo ekle (her baseInterval ms'de bir, sadece bir tane)
      if (!lastTileAddTime || time - lastTileAddTime > baseInterval) {
        // Aynı anda üstte başka karo olan lane'lere yeni karo eklenmesin
        const lanesOccupied = new Set(tilesRef.current.filter(t => t.y < TILE_HEIGHT * 1.2).map(t => t.lane));
        const availableLanes = [];
        for (let l = 0; l < LANES; l++) {
          if (!lanesOccupied.has(l)) availableLanes.push(l);
        }
        if (availableLanes.length > 0) {
          const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          tilesRef.current.push({
            id: tileId++,
            lane,
            y: -TILE_HEIGHT,
            status: 'active'
          });
        }
        lastTileAddTime = time;
      }
      // Kaçan karoları kontrol et
      let missedThisFrame = false;
      for (let i = tilesRef.current.length - 1; i >= 0; i--) {
        const tile = tilesRef.current[i];
        if (tile.y > TARGET_Y + 40 && tile.status === 'active') {
          tilesRef.current.splice(i, 1);
          setCombo(0);
          setMissed(m => m + 1);
          missedThisFrame = true;
        }
      }
      // Oyun sonu
      if ((missed + (missedThisFrame ? 1 : 0)) >= MAX_MISSED && !gameOver) {
        setGameOver(true);
        setTimeout(() => {
          setShowEnd(true);
          onGameEnd(score);
        }, 1200);
        return;
      }
      draw();
      if (!gameOver) requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line
  }, [gameOver, difficulty, missed, score]);

  // Canvas çizim fonksiyonu
  function draw() {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // Kanallar
    for (let i = 1; i < LANES; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TILE_WIDTH, 0);
      ctx.lineTo(i * TILE_WIDTH, GAME_HEIGHT);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Hedef çizgisi
    ctx.fillStyle = 'rgba(255,255,0,0.18)';
    ctx.fillRect(0, TARGET_Y, GAME_WIDTH, 8);
    // Karolar
    tilesRef.current.forEach(tile => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = TILE_COLOR[tile.lane % TILE_COLOR.length];
      ctx.globalAlpha = 1;
      ctx.shadowColor = 'rgba(0,255,255,0.2)';
      ctx.shadowBlur = 4;
      ctx.fillRect(tile.lane * TILE_WIDTH + TILE_WIDTH * 0.1, tile.y, TILE_WIDTH * 0.8, TILE_HEIGHT);
      ctx.restore();
    });
  }

  // Tıklama ile karo yakalama
  function handleTileClick(tileId) {
    setScore(s => s + 10 + combo * 2);
    setCombo(c => c + 1);
    const newTiles = tilesRef.current.filter(t => t.id !== tileId);
    tilesRef.current = newTiles;
    setTiles(newTiles);
    draw();
  }

  // Canvas tıklama ile karo yakalama
  function handleCanvasClick(e) {
    if (gameOver) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const lane = Math.floor(x / TILE_WIDTH);
    // Tıklanan lane'de, karo hedef bölgesindeyse (mouse'un y'si önemli değil)
    for (let i = 0; i < tilesRef.current.length; i++) {
      const tile = tilesRef.current[i];
      if (
        tile.lane === lane &&
        tile.y >= TARGET_Y - 60 && tile.y <= TARGET_Y + 60
      ) {
        handleTileClick(tile.id);
        return;
      }
    }
    // Boş kanala tıklama: combo sıfırla
    setCombo(0);
  }

  // Oyun başlatıldığında canvas'ı temizle
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    tilesRef.current = [];
    setScore(0);
    setCombo(0);
    setMissed(0);
    setDifficulty(1);
    setShowEnd(false);
    // eslint-disable-next-line
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-lg font-bold text-yellow-300">Ritim Oyunu (Canvas)</div>
      <div className="mb-2 text-gray-200">Skor: <span className="font-mono">{score}</span> | Combo: <span className="font-mono">{combo}</span> | Kaçan: <span className="font-mono">{missed} / {MAX_MISSED}</span> | Zorluk: <span className='font-mono'>{difficulty.toFixed(1)}</span></div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="rounded-xl border-2 border-yellow-400 bg-slate-800 cursor-pointer select-none"
        style={{ touchAction: 'manipulation' }}
        onClick={handleCanvasClick}
      />
      {showEnd && (
        <div className="mt-4 text-xl font-bold text-green-300 animate-bounce">Oyun Bitti! Puanın: {score}</div>
      )}
    </div>
  );
} 