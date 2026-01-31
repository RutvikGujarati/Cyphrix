import  { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroVisual = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.set(0, 150, 600);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    mountRef.current.appendChild(renderer.domElement);

    const numParticles = 30000;
    const positions = new Float32Array(numParticles * 3);
    const planePositions = new Float32Array(numParticles * 3);
    const ethPositions = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      
      // 1. PLANE STATE
      planePositions[i3] = (Math.random() - 0.5) * 1800;
      planePositions[i3 + 1] = 0;
      planePositions[i3 + 2] = (Math.random() - 0.5) * 1200;

      // 2. REFINED COMPACT ETHEREUM STATE
      const side = Math.random() > 0.5 ? 1 : -1;
      const r1 = Math.random();
      const r2 = Math.random();
      const a = 1 - Math.sqrt(r1);
      const b = Math.sqrt(r1) * (1 - r2);
      const c = Math.sqrt(r1) * r2;

      // Reduced size for a more sophisticated, "small" look
      const size = 120; // Halved from previous version
      const heightOffset = 180; // Adjusted for perspective

      const v0 = new THREE.Vector3(0, side * size * 1.8, 0); // Taller tip for sharper diamond
      const v1 = new THREE.Vector3(size, 0, 0);
      const v2 = new THREE.Vector3(0, 0, size);
      const v3 = new THREE.Vector3(-size, 0, 0);
      const v4 = new THREE.Vector3(0, 0, -size);

      const facePick = Math.floor(Math.random() * 4);
      let targetPos = new THREE.Vector3();
      
      if (facePick === 0) targetPos.addScaledVector(v0, a).addScaledVector(v1, b).addScaledVector(v2, c);
      else if (facePick === 1) targetPos.addScaledVector(v0, a).addScaledVector(v2, b).addScaledVector(v3, c);
      else if (facePick === 2) targetPos.addScaledVector(v0, a).addScaledVector(v3, b).addScaledVector(v4, c);
      else targetPos.addScaledVector(v0, a).addScaledVector(v4, b).addScaledVector(v1, c);

      ethPositions[i3] = targetPos.x;
      ethPositions[i3 + 1] = targetPos.y + heightOffset;
      ethPositions[i3 + 2] = targetPos.z;

      positions[i3] = planePositions[i3];
      positions[i3 + 1] = planePositions[i3 + 1];
      positions[i3 + 2] = planePositions[i3 + 2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x999999, // Muted grey like Offground, switch to Cyan on progress
      size: 1.1,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll);

    let count = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      count += 0.01;
      
      const posAttr = particles.geometry.attributes.position;
      const currentArr = posAttr.array as Float32Array;
      const progress = Math.min(scrollY.current / 800, 1);

      // Dynamic color shift on morph
      if (progress > 0.5) {
        material.color.setHex(0x0dcaf0); // Cyan glow when forming
        material.opacity = 0.6;
      } else {
        material.color.setHex(0x999999);
        material.opacity = 0.4;
      }

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const waveY = (Math.sin((planePositions[i3] * 0.01) + count) * 20);

        // Linear interpolation for position
        const targetX = THREE.MathUtils.lerp(planePositions[i3], ethPositions[i3], progress);
        const targetY = THREE.MathUtils.lerp(planePositions[i3 + 1] + waveY, ethPositions[i3 + 1], progress);
        const targetZ = THREE.MathUtils.lerp(planePositions[i3 + 2], ethPositions[i3 + 2], progress);

        currentArr[i3] += (targetX - currentArr[i3]) * 0.07;
        currentArr[i3 + 1] += (targetY - currentArr[i3 + 1]) * 0.07;
        currentArr[i3 + 2] += (targetZ - currentArr[i3 + 2]) * 0.07;
      }

      // Small constant rotation for a "hovering" feel
      particles.rotation.y += 0.002;

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();
    return () => {
      window.removeEventListener('scroll', onScroll);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="position-fixed top-0 start-0 w-100 h-100 z-0" 
         style={{ background: 'radial-gradient(circle at 50% 10%, #0c2024 0%, #000 90%)', pointerEvents: 'none' }} />;
};

export default HeroVisual;