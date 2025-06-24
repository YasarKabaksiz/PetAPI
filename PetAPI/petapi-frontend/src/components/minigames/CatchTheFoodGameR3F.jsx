import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

const GAME_WIDTH = 8; // 8 birim (canvas için)
const GAME_HEIGHT = 10; // 10 birim
const CATCHER_WIDTH = 1.2;
const CATCHER_HEIGHT = 0.5;
const OBJECT_RADIUS = 0.35;
const OBJECT_TYPES = [
  { type: 'food', color: '#fbbf24', emoji: '🍖' },
  { type: 'junk', color: '#64748b', emoji: '🧦' },
  { type: 'bomb', color: '#ef4444', emoji: '💣' },
];

function getRandomX() {
  return Math.random() * (GAME_WIDTH - OBJECT_RADIUS * 2) + OBJECT_RADIUS;
}

let objectId = 0;

function FallingObjects({ objects }) {
  return (
    <>
      {objects.map(obj => (
        <mesh key={obj.id} position={[obj.x, obj.y, 0]}>
          <circleGeometry args={[OBJECT_RADIUS, 32]} />
          <meshStandardMaterial color={OBJECT_TYPES.find(t => t.type === obj.type)?.color || '#fff'} />
        </mesh>
      ))}
    </>
  );
}

function Catcher({ x }) {
  return (
    <mesh position={[x, 0.7, 0]}>
      <boxGeometry args={[CATCHER_WIDTH, CATCHER_HEIGHT, 0.2]} />
      <meshStandardMaterial color="#06b6d4" />
    </mesh>
  );
}

export default function CatchTheFoodGameR3F({ onGameEnd }) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [missed, setMissed] = useState(0);
  const [bombsCaught, setBombsCaught] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [catcherX, setCatcherX] = useState(GAME_WIDTH / 2);
  const lastObjectAdd = useRef(0);
  const frameCount = useRef(0);

  // Zorluk artışı
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setDifficulty(d => +(d + 0.2).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Mouse ile yatay hareket
  const handlePointerMove = useCallback((e) => {
    if (gameOver) return;
    const [x] = e.unprojectedPoint;
    setCatcherX(Math.max(CATCHER_WIDTH / 2, Math.min(GAME_WIDTH - CATCHER_WIDTH / 2, x)));
  }, [gameOver]);

  // Oyun döngüsü ve animasyon
  useFrame((state, delta) => {
    if (gameOver) return;
    frameCount.current++;
    // Nesneleri hareket ettir
    setFallingObjects(prev => {
      let changed = false;
      const speed = 2 + difficulty * 0.7;
      const updated = prev.map(obj => ({ ...obj, y: obj.y - speed * delta }));
      // Çarpışma ve kaçan kontrolü
      const filtered = [];
      updated.forEach(obj => {
        // Çarpışma
        if (
          obj.y - OBJECT_RADIUS < 0.7 + CATCHER_HEIGHT / 2 &&
          obj.y + OBJECT_RADIUS > 0.7 - CATCHER_HEIGHT / 2 &&
          obj.x + OBJECT_RADIUS > catcherX - CATCHER_WIDTH / 2 &&
          obj.x - OBJECT_RADIUS < catcherX + CATCHER_WIDTH / 2
        ) {
          if (obj.type === 'food') {
            setScore(s => s + 5 + combo * 2);
            setCombo(c => c + 1);
          } else if (obj.type === 'junk') {
            setScore(s => Math.max(0, s - 3));
            setCombo(0);
          } else if (obj.type === 'bomb') {
            setBombsCaught(b => b + 1);
            setCombo(0);
          }
          changed = true;
        } else if (obj.y < -OBJECT_RADIUS) {
          // Kaçan
          setMissed(m => m + 1);
          setCombo(0);
          changed = true;
        } else {
          filtered.push(obj);
        }
      });
      return changed ? filtered : prev;
    });
    // Nesne ekleme
    if (state.clock.elapsedTime * 1000 - lastObjectAdd.current > 650 - difficulty * 40) {
      let type = 'food';
      const bombChance = Math.min(0.1 * difficulty, 0.5);
      const rand = Math.random();
      if (rand < bombChance) type = 'bomb';
      else if (rand < 0.7 + 0.1 * difficulty) type = 'food';
      else type = 'junk';
      setFallingObjects(prev => [
        ...prev,
        {
          id: objectId++,
          x: getRandomX(),
          y: GAME_HEIGHT - 0.5,
          type
        }
      ]);
      lastObjectAdd.current = state.clock.elapsedTime * 1000;
    }
    // Oyun sonu
    if (missed >= 3 || bombsCaught >= 3) {
      setGameOver(true);
      setTimeout(() => {
        setShowEnd(true);
        onGameEnd(missed >= 3 || bombsCaught >= 3 ? 0 : score);
      }, 1200);
    }
  });

  // Oyun başlatıldığında sıfırla
  useEffect(() => {
    setScore(0);
    setCombo(0);
    setMissed(0);
    setBombsCaught(0);
    setDifficulty(1);
    setShowEnd(false);
    setFallingObjects([]);
    setCatcherX(GAME_WIDTH / 2);
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-lg font-bold text-cyan-300">Doğru Yemi Yakala (Canvas/R3F)</div>
      <div className="mb-2 text-gray-200">Skor: <span className="font-mono">{score}</span> | Combo: <span className="font-mono">{combo}</span> | Kaçan: <span className="font-mono">{missed}/3</span> | Bomba: <span className="font-mono">{bombsCaught}/3</span> | Zorluk: <span className="font-mono">{difficulty.toFixed(1)}</span></div>
      <Canvas
        orthographic
        camera={{ position: [GAME_WIDTH / 2, GAME_HEIGHT / 2, 20], zoom: 50, near: 0.1, far: 100 }}
        style={{ width: 400, height: 500, background: '#0f172a', borderRadius: 16, border: '2px solid #06b6d4', cursor: 'pointer' }}
        onPointerMove={handlePointerMove}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 10, 10]} intensity={0.5} />
        <FallingObjects objects={fallingObjects} />
        <Catcher x={catcherX} />
      </Canvas>
      {showEnd && (
        <div className="mt-4 text-xl font-bold text-green-300 animate-bounce">Oyun Bitti! Puanın: {score}</div>
      )}
    </div>
  );
} 