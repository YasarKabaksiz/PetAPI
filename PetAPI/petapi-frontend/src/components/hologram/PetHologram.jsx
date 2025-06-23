import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Partikül patlaması için yardımcı fonksiyon
function getRandomSpherePoints(count, radius = 1.5) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    points.push([x, y, z]);
  }
  return points;
}

function Particles({ color = 'yellow', count = 40, visible }) {
  const [positions] = useState(() => getRandomSpherePoints(count));
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      // Patlama animasyonu: partiküller dışa doğru yayılır
      ref.current.material.size = 0.15 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
    }
  });
  if (!visible) return null;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length}
          array={new Float32Array(positions.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.2} sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

function Model({ modelPath, pulse }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
      // Pulse efekti: scale animasyonu
      const scale = pulse ? 1.15 + 0.1 * Math.sin(state.clock.elapsedTime * 10) : 1;
      group.current.scale.set(scale, scale, scale);
    }
  });
  return <primitive ref={group} object={scene} />;
}

export default function PetHologram({ petType = "Kedi", effectType, effectKey }) {
  // petType: "Kedi", "Köpek", "Kuş"
  let modelPath = "/models/cat.glb";
  if (petType === "Köpek") modelPath = "/models/dog.glb";
  if (petType === "Kuş") modelPath = "/models/bird.glb";

  // Efekt state'i
  const [isEffectActive, setEffectActive] = useState(false);

  useEffect(() => {
    if (effectType) {
      setEffectActive(true);
      const timer = setTimeout(() => {
        setEffectActive(false);
      }, 1000); // Efekt 1 saniye sürsün
      return () => clearTimeout(timer);
    }
  }, [effectType, effectKey]);

  // Efekt renkleri
  const effectColor = effectType === 'feed' ? 'lightgreen' : effectType === 'play' ? 'yellow' : 'white';

  return (
    <Canvas camera={{ position: [0, 1.2, 3.5], fov: 40 }} style={{ background: 'transparent' }}>
      {/* Yumuşak bir ışık ve gölge */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      {/* Efekt sırasında kısa süreli ışık parlaması */}
      {isEffectActive && (
        <pointLight position={[0, 1, 0]} intensity={2.5} color={effectColor} decay={2} distance={4} />
      )}
      <Model modelPath={modelPath} pulse={isEffectActive} />
      {/* Gerçekçi partikül patlaması */}
      <Particles color={effectColor} count={effectType === 'play' ? 60 : 40} visible={isEffectActive} />
      {/* Kamera kontrolü */}
      <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />
    </Canvas>
  );
} 