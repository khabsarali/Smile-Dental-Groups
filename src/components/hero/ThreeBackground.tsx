import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeOverlayProps {
  stage: number;
  progress: number;
}

// 3D Holographic Particle Field Component
function ParticleField({ stage }: { stage: number }) {
  const count = 300;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sca[i] = Math.random() * 0.05 + 0.02;
    }
    return [pos, sca];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.03;
    pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05;

    // Subtle parallax shift based on pointer
    pointsRef.current.position.x = state.pointer.x * 0.3;
    pointsRef.current.position.y = state.pointer.y * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={stage === 2 || stage === 3 ? '#00E5FF' : '#4FC3F7'}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Holographic Scanner Plane & Ring (Stage 2 X-Ray Diagnostics)
function HolographicHUD({ stage, progress }: { stage: number; progress: number }) {
  const ringRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.2;
      ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(time * 2) * 2;
    }
  });

  if (stage !== 2 && stage !== 3) return null;

  return (
    <group ref={ringRef} position={[0, 0, 0]}>
      {/* Outer Wireframe Hologram Ring */}
      <mesh>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} wireframe />
      </mesh>
      
      {/* Inner Rotating HUD Segment */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.82, 64]} />
        <meshBasicMaterial color="#4FC3F7" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Horizontal Laser Scanning Beam */}
      <mesh ref={laserRef} position={[0, 0, 0]}>
        <planeGeometry args={[7, 0.05]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export const ThreeBackground: React.FC<ThreeOverlayProps> = ({ stage, progress }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4FC3F7" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00E5FF" />
        
        <ParticleField stage={stage} />
        <HolographicHUD stage={stage} progress={progress} />
      </Canvas>
    </div>
  );
};
