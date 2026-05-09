import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Points = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 100; // Ultra-low count for absolute performance
    
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    // Static scroll capture - no continuous polling
    const scrollOffset = useRef(0);
    useEffect(() => {
        const handleScroll = () => {
            scrollOffset.current = window.scrollY * 0.0004; // Extremely subtle movement
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentY = useRef(0);

    useFrame((state) => {
        if (pointsRef.current) {
            // Constant slow rotation (GPU side mostly)
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            
            // Subtle smoothing for position
            currentY.current += (-scrollOffset.current - currentY.current) * 0.05;
            pointsRef.current.position.y = currentY.current;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.015} 
                color="#00d4ff" 
                transparent 
                opacity={0.12} 
                sizeAttenuation 
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                depthTest={false}
            />
        </points>
    );
};

const ThreeBackground: React.FC = () => {
    return (
        <div className="three-canvas-container" style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas 
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ 
                    antialias: false, 
                    powerPreference: "high-performance",
                    alpha: true,
                    stencil: false,
                    depth: false,
                    precision: 'lowp' // Extreme optimization
                }}
                dpr={0.8} // Sub-native resolution for speed
                performance={{ min: 0.1 }}
            >
                <Points />
            </Canvas>
        </div>
    );
};

export default React.memo(ThreeBackground);
