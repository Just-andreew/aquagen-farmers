// src/RasBox.jsx
// 1. Import Suspense from react!
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

const BioFilter = ({ isWarning }) => {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.y += 0.01;
    if (isWarning) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.08;
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={[1.5, -0.2, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
      <meshStandardMaterial 
        color={isWarning ? "#f59e0b" : "#2dd4bf"} 
        emissive={isWarning ? "#f59e0b" : "#000000"} 
        emissiveIntensity={isWarning ? 0.4 : 0}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};

const MainTank = () => (
  <mesh position={[-0.5, 0, 0]}>
    <cylinderGeometry args={[1.2, 1.2, 1.6, 32]} />
    <meshStandardMaterial 
      color="#0f766e" 
      transparent 
      opacity={0.8} 
      roughness={0.1}
      metalness={0.5}
    />
  </mesh>
);

export default function RasBoxScene({ systemStatus }) {
  const hasWarning = systemStatus === 'warning';

  return (
    <div style={{ 
      height: '240px', 
      width: '100%', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
      border: '1px solid var(--border-color)', 
      marginBottom: '32px',
      position: 'relative'
    }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        {/* 2. Wrap the 3D elements in Suspense. fallback={null} means "show nothing while loading" */}
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          
          <MainTank />
          <BioFilter isWarning={hasWarning} />
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', backgroundColor: 'rgba(2, 43, 38, 0.8)', borderRadius: '20px', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-light)' }}>
        Live RAS View
      </div>
    </div>
  );
}