import React, { useState, useEffect, useRef } from 'react';
import useInterval from '../../hooks/useInterval';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const CATCHER_WIDTH = 60;
const OBJECT_SIZE = 36;
const FOOD_EMOJI = '🍖';
const JUNK_EMOJI = '🧦';

function getRandomX() {
  return Math.floor(Math.random() * (GAME_WIDTH - OBJECT_SIZE));
}

let objectId = 0;

export default function CatchTheFoodGame({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [catcherX, setCatcherX] = useState(GAME_WIDTH / 2 - CATCHER_WIDTH / 2);
  const gameAreaRef = useRef();
  const frameCount = useRef(0);

  // Oyun döngüsü
  useInterval(() => {
    frameCount.current++;
    // Nesneleri hareket ettir
    setFallingObjects(prev => prev
      .map(obj => ({ ...obj, y: obj.y + 6 }))
      .filter(obj => obj.y < GAME_HEIGHT + OBJECT_SIZE)
    );
    // Belirli aralıklarla yeni nesne ekle
    if (frameCount.current % 20 === 0) {
      const type = Math.random() < 0.7 ? 'food' : 'junk';
      setFallingObjects(prev => [
        ...prev,
        {
          id: objectId++,
          x: getRandomX(),
          y: -OBJECT_SIZE,
          type
        }
      ]);
    }
    // Çarpışma kontrolü
    setFallingObjects(prev => {
      return prev.filter(obj => {
        const isCaught =
          obj.y + OBJECT_SIZE > GAME_HEIGHT - 60 &&
          obj.x + OBJECT_SIZE > catcherX &&
          obj.x < catcherX + CATCHER_WIDTH;
        if (isCaught) {
          if (obj.type === 'food') setScore(s => s + 5);
          else setScore(s => Math.max(0, s - 3));
        }
        return !isCaught;
      });
    });
  }, timeLeft > 0 ? 16 : null);

  // Sayaç
  useInterval(() => {
    if (timeLeft > 0) setTimeLeft(t => t - 1);
  }, timeLeft > 0 ? 1000 : null);

  // Oyun bittiğinde sonucu bildir
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => onGameEnd(score), 800);
    }
  }, [timeLeft, onGameEnd, score]);

  // Fareyle hareket
  useEffect(() => {
    const handleMouseMove = e => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left - CATCHER_WIDTH / 2;
      x = Math.max(0, Math.min(GAME_WIDTH - CATCHER_WIDTH, x));
      setCatcherX(x);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-lg font-bold text-cyan-300">Doğru Yemi Yakala!</div>
      <div className="mb-2 text-gray-200">Süre: <span className="font-mono">{timeLeft}s</span> | Puan: <span className="font-mono">{score}</span></div>
      <div
        ref={gameAreaRef}
        className="relative bg-slate-800 rounded-xl border-2 border-cyan-400 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Düşen nesneler */}
        {fallingObjects.map(obj => (
          <div
            key={obj.id}
            className="absolute text-3xl select-none drop-shadow"
            style={{ left: obj.x, top: obj.y, transition: 'none', zIndex: 2 }}
          >
            {obj.type === 'food' ? FOOD_EMOJI : JUNK_EMOJI}
          </div>
        ))}
        {/* Mama kabı */}
        <div
          className="absolute bottom-2 h-10 w-16 bg-cyan-400 rounded-full border-4 border-cyan-600 flex items-center justify-center text-2xl font-bold shadow-lg select-none"
          style={{ left: catcherX, zIndex: 3 }}
        >
          🥣
        </div>
      </div>
      {timeLeft === 0 && (
        <div className="mt-4 text-xl font-bold text-green-300 animate-bounce">Oyun Bitti! Puanın: {score}</div>
      )}
    </div>
  );
} 