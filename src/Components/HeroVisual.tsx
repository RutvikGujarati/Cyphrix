import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroVisual = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const ripples = useRef<Array<{ x: number; z: number; time: number; power: number }>>([]);
  const mouseWorld = useRef({ x: 0, z: 0 });
  const smoothMouse = useRef({ x: 0, z: 0 });
  const mouseActive = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
    camera.position.set(0, 550, 850);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Raycaster for mouse -> world position on y=0 plane
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersect = new THREE.Vector3();

    const numParticles = 40000;
    const positions = new Float32Array(numParticles * 3);
    const basePositions = new Float32Array(numParticles * 3);
    const velocities = new Float32Array(numParticles);

    const gridSize = Math.sqrt(numParticles);
    const spacing = 32;

    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      const x = (i % gridSize - gridSize / 2) * spacing;
      const z = (Math.floor(i / gridSize) - gridSize / 2) * spacing;

      basePositions[i3] = x;
      basePositions[i3 + 1] = 0;
      basePositions[i3 + 2] = z;

      positions[i3] = x;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = z;
      velocities[i] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00f2ff,
      size: 4.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const getWorldFromMouse = (clientX: number, clientY: number) => {
      mouse.x = (clientX / width) * 2 - 1;
      mouse.y = -(clientY / height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, intersect);
      return { x: intersect.x, z: intersect.z };
    };

    const onMouseMove = (e: MouseEvent) => {
      const w = getWorldFromMouse(e.clientX, e.clientY);
      mouseWorld.current.x = w.x;
      mouseWorld.current.z = w.z;
      mouseActive.current = true;
    };

    const onMouseLeave = () => {
      mouseActive.current = false;
    };

    const onClick = (e: MouseEvent) => {
      const w = getWorldFromMouse(e.clientX, e.clientY);
      ripples.current.push({
        x: w.x,
        z: w.z,
        time: 0,
        power: 200,
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onClick);

    const hoverRadius = 380;
    const hoverStrength = 65;
    const mouseLerp = 0.06;
    const waveSpeed = 320;
    const waveWidth = 280;

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      const dt = 0.016;
      time += 0.008;

      // Smooth mouse follow
      smoothMouse.current.x += (mouseWorld.current.x - smoothMouse.current.x) * mouseLerp;
      smoothMouse.current.z += (mouseWorld.current.z - smoothMouse.current.z) * mouseLerp;

      const posAttr = particles.geometry.attributes.position;
      const currentArr = posAttr.array as Float32Array;

      ripples.current = ripples.current.filter(r => {
        r.time += dt * 1.2;
        return r.time < 7;
      });

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const x = basePositions[i3];
        const z = basePositions[i3 + 2];

        // Base wave motion
        let targetY = Math.sin(x * 0.004 + time) * 8 + Math.cos(z * 0.004 + time) * 8;

        // Hover: smooth bump that follows cursor (gaussian-like falloff)
        if (mouseActive.current) {
          const dx = x - smoothMouse.current.x;
          const dz = z - smoothMouse.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < hoverRadius) {
            const t = dist / hoverRadius;
            const falloff = Math.pow(1 - t * t, 1.2);
            targetY += hoverStrength * falloff;
          }
        }

        // Click: smooth expanding wave (smooth sine profile)
        ripples.current.forEach(r => {
          const dx = x - r.x;
          const dz = z - r.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const currentRadius = r.time * waveSpeed;
          const distFromWave = Math.abs(dist - currentRadius);

          if (distFromWave < waveWidth) {
            const decay = Math.pow(1 - r.time / 7, 1.5);
            const t = distFromWave / waveWidth;
            const wave = Math.sin(t * Math.PI) * r.power * decay;
            targetY += wave;
          }
        });

        // Smooth spring physics
        const spring = 0.07;
        const damping = 0.91;
        velocities[i] += (targetY - currentArr[i3 + 1]) * spring;
        velocities[i] *= damping;
        currentArr[i3 + 1] += velocities[i];
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onClick);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="position-fixed top-0 start-0 w-100 h-100 z-0"
      style={{ background: 'radial-gradient(circle at 50% 50%, #001214 0%, #000 100%)', cursor: 'crosshair' }} />
  );
};

export default HeroVisual;