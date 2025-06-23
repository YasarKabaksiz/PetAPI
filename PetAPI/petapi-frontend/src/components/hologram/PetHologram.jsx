import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ modelPath, ...props }) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  // Modeli sürekli döndür
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
    }
  });

  return <primitive ref={group} object={scene} {...props} />;
}

export default function PetHologram({ petType = "Kedi", effectKey }) {
  // petType: "Kedi", "Köpek", "Kuş"
  let modelPath = "/models/cat.glb";
  if (petType === "Köpek") modelPath = "/models/dog.glb";
  if (petType === "Kuş") modelPath = "/models/bird.glb";

  return (
    <Canvas camera={{ position: [0, 1.2, 3.5], fov: 40 }} style={{ background: 'transparent' }}>
      {/* Yumuşak bir ışık ve gölge */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      {/* Model */}
      <Model modelPath={modelPath} position={[0, -0.5, 0]} />
      {/* Kamera kontrolü */}
      <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />
    </Canvas>
  );
} 