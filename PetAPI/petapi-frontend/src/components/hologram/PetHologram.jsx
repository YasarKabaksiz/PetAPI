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

function Model({ modelPath, pulse, rotate, scale = [1,1,1], position = [0, -0.5, 0], isHeadstone = false }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  // Headstone için ilk render'da yönü düz bakacak şekilde ayarla
  useEffect(() => {
    if (group.current && isHeadstone) {
      group.current.rotation.y = -Math.PI / 2; // -90 derece döndür
    }
  }, [isHeadstone, modelPath]);

  useFrame((state, delta) => {
    if (group.current) {
      if (rotate) {
        group.current.rotation.y += delta * 0.5;
      }
      // Headstone için canlılık efekti: yavaşça yukarı-aşağı hareket ve hafif dönme
      if (isHeadstone) {
        group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
        group.current.rotation.y += delta * 0.15;
      } else {
        group.current.position.set(...position);
      }
      // Pulse efekti: scale animasyonu
      const pulseScale = pulse ? 1.15 + 0.1 * Math.sin(state.clock.elapsedTime * 10) : 1;
      group.current.scale.set(scale[0] * pulseScale, scale[1] * pulseScale, scale[2] * pulseScale);
    }
  });
  return <primitive ref={group} object={scene} />;
}

export default function PetHologram({ petType = "Kedi", effectType, effectKey, modelName }) {
  // modelName öncelikli, yoksa petType'a göre model seç
  let modelFile = modelName || (petType === "Köpek" ? "dog.glb" : petType === "Kuş" ? "bird.glb" : "cat.glb");
  const modelPath = `/models/${modelFile}`;
  const isHeadstone = modelFile === 'headstone.glb';

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
    <Canvas camera={{ position: isHeadstone ? [0, 2, 25] : [0, 1.2, 2.5], fov: 35 }} style={{ background: 'transparent' }}>
      {/* Kasvetli ışıklandırma headstone için */}
      {isHeadstone ? (
        <>
          <ambientLight intensity={0.3} />
          <directionalLight position={[0, 5, 2]} intensity={0.5} color="#aaa" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
        </>
      )}
      {/* Efekt sırasında kısa süreli ışık parlaması */}
      {isEffectActive && !isHeadstone && (
        <pointLight position={[0, 1, 0]} intensity={2.5} color={effectColor} decay={2} distance={4} />
      )}
      <Model 
        modelPath={modelPath} 
        pulse={isEffectActive && !isHeadstone} 
        rotate={!isHeadstone}
        scale={isHeadstone ? [2.5,2.5,2.5] : [1,1,1]}
        position={isHeadstone ? [0, -1.2, 0] : [0, -0.5, 0]}
        isHeadstone={isHeadstone}
      />
      {!isHeadstone && <Particles color={effectColor} count={effectType === 'play' ? 60 : 40} visible={isEffectActive} />}
      {/* Kamera kontrolü */}
      <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />
    </Canvas>
  );
} 