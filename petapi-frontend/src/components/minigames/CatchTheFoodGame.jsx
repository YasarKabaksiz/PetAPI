import React, { useState, useEffect, useRef, useCallback } from 'react';
import useInterval from '../../hooks/useInterval';
import { FaBomb } from 'react-icons/fa';

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
  const [difficulty, setDifficulty] = useState(1);
  const [bombsCaught, setBombsCaught] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bombEffect, setBombEffect] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const gameAreaRef = useRef();
  const frameCount = useRef(0);

  // Dinamik hız ve interval
  const baseSpeed = 5;
  const baseInterval = 22;
  const objectSpeed = baseSpeed + (difficulty - 1) * 1.2;
  const objectInterval = Math.max(8, Math.floor(baseInterval - (difficulty - 1) * 2));

  // Oyun ana mantığı (gameTick)
  const gameTick = useCallback(() => {
    frameCount.current++;
    setFallingObjects(prev => {
      let bombCaughtThisFrame = false;
      let bombIdCaught = null;
      let scoreDelta = 0;
      let junkDelta = 0;
      const newObjects = [];
      for (let obj of prev) {
        const newY = obj.y + objectSpeed;
        const isAtCatcherLevel = newY + OBJECT_SIZE > GAME_HEIGHT - 60;
        const isOverCatcher = obj.x + OBJECT_SIZE > catcherX && obj.x < catcherX + CATCHER_WIDTH;
        if (isAtCatcherLevel) {
          if (isOverCatcher) {
            if (obj.type === 'food') scoreDelta += 5;
            else if (obj.type === 'junk') junkDelta -= 3;
            else if (obj.type === 'bomb' && !bombCaughtThisFrame) {
              console.log(`BOMBA ÇARPIŞMASI TESPİT EDİLDİ! ID: ${obj.id}, Zaman: ${new Date().toLocaleTimeString()}`);
              bombCaughtThisFrame = true;
              bombIdCaught = obj.id;
            }
          }
          continue;
        }
        if (newY < GAME_HEIGHT + OBJECT_SIZE) {
          newObjects.push({ ...obj, y: newY });
        }
      }
      if (scoreDelta !== 0) setScore(s => s + scoreDelta);
      if (junkDelta !== 0) setScore(s => Math.max(0, s + junkDelta));
      if (bombCaughtThisFrame && bombIdCaught !== null) {
        setBombsCaught(prev => prev + 1);
        setFallingObjects(prevObjs => prevObjs.filter(obj => obj.id !== bombIdCaught));
        setBombEffect(true);
        setTimeout(() => setBombEffect(false), 350);
      }
      return newObjects;
    });
    // Belirli aralıklarla yeni nesne ekle
    if (frameCount.current % objectInterval === 0) {
      let type = 'food';
      const bombChance = Math.min(0.1 * difficulty, 0.5); // max %50
      const rand = Math.random();
      if (rand < bombChance) type = 'bomb';
      else if (rand < 0.7 + 0.1 * difficulty) type = 'food';
      else type = 'junk';
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
  }, [catcherX, objectSpeed, objectInterval, difficulty]);

  // Oyun döngüsü (sadece isRunning true ise)
  useInterval(gameTick, isRunning ? 16 : null);

  // Sayaç
  useInterval(() => {
    if (isRunning && timeLeft > 0) setTimeLeft(t => t - 1);
  }, isRunning && timeLeft > 0 ? 1000 : null);

  // Zorluk artışı (her 3 saniyede bir 0.2 artar)
  useInterval(() => {
    if (isRunning) setDifficulty(d => +(d + 0.2).toFixed(2));
  }, isRunning ? 3000 : null);

  // Oyun bitiş koşulları
  useEffect(() => {
    if ((bombsCaught >= 3 || timeLeft === 0) && isRunning) {
      setIsRunning(false);
    }
  }, [bombsCaught, timeLeft, isRunning]);

  // Oyun bittiğinde sonucu bildir
  useEffect(() => {
    if (!isRunning && !isGameOver) {
      setIsGameOver(true);
      setTimeout(() => onGameEnd(bombsCaught >= 3 ? 0 : score), 1200);
    }
  }, [isRunning, isGameOver, bombsCaught, score, onGameEnd]);

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
      <div className="mb-2 text-gray-200">Süre: <span className="font-mono">{timeLeft}s</span> | Puan: <span className="font-mono">{score}</span> | Zorluk: <span className="font-mono">{difficulty}</span> | Bomba: <span className="font-mono">{bombsCaught}/3</span></div>
      <div
        ref={gameAreaRef}
        className={`relative bg-slate-800 rounded-xl border-2 border-cyan-400 overflow-hidden transition-all duration-150 ${bombEffect ? 'animate-pulse border-red-500' : ''}`}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Düşen nesneler */}
        {fallingObjects.map(obj => (
          <div
            key={obj.id}
            className={`absolute text-3xl select-none drop-shadow ${obj.type === 'bomb' ? 'text-red-500 animate-bounce' : ''}`}
            style={{ left: obj.x, top: obj.y, transition: 'none', zIndex: 2 }}
          >
            {obj.type === 'food' ? FOOD_EMOJI : obj.type === 'junk' ? JUNK_EMOJI : <FaBomb />}
          </div>
        ))}
        {/* Mama kabı */}
        <div
          className="absolute bottom-2 h-10 w-16 bg-cyan-400 rounded-full border-4 border-cyan-600 flex items-center justify-center text-2xl font-bold shadow-lg select-none"
          style={{ left: catcherX, zIndex: 3 }}
        >
          🥣
        </div>
        {/* Oyun Bitti Mesajı */}
        {isGameOver && bombsCaught >= 3 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-50">
            <div className="text-3xl font-bold text-red-400 mb-2 animate-bounce">Oyun Bitti!</div>
            <div className="text-lg text-red-200">3 bomba yakaladın!</div>
          </div>
        )}
        {isGameOver && timeLeft === 0 && bombsCaught < 3 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
            <div className="text-3xl font-bold text-green-300 mb-2 animate-bounce">Oyun Bitti!</div>
            <div className="text-lg text-cyan-200">Tebrikler, puanın: {score}</div>
          </div>
        )}
      </div>
    </div>
  );
} 