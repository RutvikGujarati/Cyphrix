import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import type { ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

/**
 * CUSTOM SHADER DEFINITION
 * This creates the organic "curtain" streaks and flowing movement.
 */
const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#00f2ff"),
    uColorB: new THREE.Color("#456fff"),
    uOpacity: 0.5,
    uSpeed: 0.2,
    uMouse: new THREE.Vector2(0, 0),
  },
  // Vertex Shader: Bends the geometry like a waving flag
  `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSpeed;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Organic "Curtain" wave logic
    float wave = sin(pos.x * 1.2 + uTime * uSpeed) * 0.25;
    wave += cos(pos.y * 1.8 + uTime * uSpeed * 0.4) * 0.15;
    
    // Parallax sway based on mouse position
    pos.x += uMouse.x * 0.3 * (1.0 - uv.y); 
    pos.z += wave + (uMouse.y * 0.2);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader: Handles the vertical streaks and color blending
  `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Generate the "Northern Lights" vertical streak noise
    float noise = random(vec2(vUv.x * 12.0, 1.0));
    
    // Vertical gradient mask (fades top and bottom)
    float mask = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    
    // Horizontal shimmer/flow
    float shimmer = sin(vUv.x * 6.0 + uTime * 0.6 + noise * 0.3);
    
    // Mix the two primary brand colors
    vec3 finalColor = mix(uColorA, uColorB, vUv.y + shimmer * 0.4);
    
    // Transparency logic for that ghostly glow
    float alpha = mask * uOpacity * (0.4 + 0.6 * shimmer);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

// Register the shader with R3F
extend({ AuroraMaterial });

// TypeScript declaration for the custom element (R3F JSX namespace)
declare module '@react-three/fiber' {
  interface ThreeElements {
    auroraMaterial: ThreeElement<typeof AuroraMaterial>;
  }
}

/**
 * SUB-COMPONENT: Single unified aurora field (no stacked layers)
 */
const AuroraField: React.FC = () => {
  const matRef = useRef<any>(null);
  
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.getElapsedTime();
      // Smoothly interpolate mouse position for a lag-free feel
      matRef.current.uMouse.lerp(new THREE.Vector2(state.mouse.x, state.mouse.y), 0.03);
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      {/* Dense geometry keeps wave distortion smooth */}
      <planeGeometry args={[16, 8, 160, 160]} />
      <auroraMaterial
        ref={matRef}
        transparent
        uColorA={new THREE.Color('#00f2ff')}
        uColorB={new THREE.Color('#456fff')}
        uOpacity={0.45}
        uSpeed={0.26}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

/**
 * MAIN EXPORT: The Interactive Background Canvas
 */
export const AuroraBackground: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: '#000000'
    }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <AuroraField />
      </Canvas>
    </div>
  );
};

export default AuroraBackground;