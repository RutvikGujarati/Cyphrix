import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LOGO_VIEWBOX = 2500;
const LOGO_WORLD_SCALE = 1000 / 1250;
const SCROLL_RANGE = 700;

interface HeroVisualProps {
  /** Drives logo transition (0–1) during scroll-jack; when set, page does not scroll. */
  logoProgress?: number;
}

const HeroVisual = ({ logoProgress }: HeroVisualProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const ripples = useRef<Array<{ x: number; z: number; time: number; power: number }>>([]);
  const mouseWorld = useRef({ x: 0, z: 0 });
  const smoothMouse = useRef({ x: 0, z: 0 });
  const mouseActive = useRef(false);
  const scrollProgress = useRef(0);
  const smoothScroll = useRef(0);
  const logoPositions = useRef<Float32Array | null>(null);
  const logoProgressRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    logoProgressRef.current = logoProgress;
  }, [logoProgress]);

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

    const sampleLogoPoints = (img: HTMLImageElement): Float32Array => {
      const res = 400;
      const canvas = document.createElement('canvas');
      canvas.width = res;
      canvas.height = res;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, res, res);
      const data = ctx.getImageData(0, 0, res, res).data;
      const points: { x: number; y: number }[] = [];
      const stride = 2;
      for (let py = 0; py < res; py += stride) {
        for (let px = 0; px < res; px += stride) {
          const i = (py * res + px) * 4;
          if (data[i + 3] > 80) {
            const sx = (px / res) * LOGO_VIEWBOX;
            const sy = (py / res) * LOGO_VIEWBOX;
            points.push({ x: sx, y: sy });
          }
        }
      }
      const out = new Float32Array(numParticles * 3);
      const center = LOGO_VIEWBOX / 2;
      if (points.length === 0) return out;
      for (let i = 0; i < numParticles; i++) {
        const p = points[i % points.length];
        const wx = (p.x - center) * LOGO_WORLD_SCALE;
        const wz = (center - p.y) * LOGO_WORLD_SCALE;
        out[i * 3] = wx;
        out[i * 3 + 1] = 0;
        out[i * 3 + 2] = wz;
      }
      if (points.length < numParticles) {
        for (let i = points.length; i < numParticles; i++) {
          const p = points[Math.floor(Math.random() * points.length)];
          out[i * 3] = (p.x - center) * LOGO_WORLD_SCALE;
          out[i * 3 + 1] = 0;
          out[i * 3 + 2] = (center - p.y) * LOGO_WORLD_SCALE;
        }
      } else if (points.length > numParticles) {
        const shuffled = [...points].sort(() => Math.random() - 0.5);
        for (let i = 0; i < numParticles; i++) {
          const p = shuffled[i];
          out[i * 3] = (p.x - center) * LOGO_WORLD_SCALE;
          out[i * 3 + 1] = 0;
          out[i * 3 + 2] = (center - p.y) * LOGO_WORLD_SCALE;
        }
      }
      return out;
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoPositions.current = sampleLogoPoints(img);
    };
    img.src = '/Cyphrix.svg';

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

    const onScroll = () => {
      if (logoProgressRef.current === undefined) {
        scrollProgress.current = Math.min(1, window.scrollY / SCROLL_RANGE);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });

    const hoverRadius = 380;
    const hoverStrength = 65;
    const mouseLerp = 0.06;
    const waveSpeed = 320;
    const waveWidth = 280;
    const scrollLerp = 0.04;
    const positionLerp = 0.06;

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      const dt = 0.016;
      time += 0.008;

      if (logoProgressRef.current !== undefined) {
        scrollProgress.current = Math.max(0, Math.min(1, logoProgressRef.current));
      } else {
        scrollProgress.current = Math.min(1, window.scrollY / SCROLL_RANGE);
      }
      smoothMouse.current.x += (mouseWorld.current.x - smoothMouse.current.x) * mouseLerp;
      smoothMouse.current.z += (mouseWorld.current.z - smoothMouse.current.z) * mouseLerp;
      smoothScroll.current += (scrollProgress.current - smoothScroll.current) * scrollLerp;

      const posAttr = particles.geometry.attributes.position;
      const currentArr = posAttr.array as Float32Array;
      const logo = logoPositions.current;

      ripples.current = ripples.current.filter(r => {
        r.time += dt * 1.2;
        return r.time < 7;
      });

      const s = smoothScroll.current;
      const waveInfluence = 1 - s;

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const baseX = basePositions[i3];
        const baseZ = basePositions[i3 + 2];

        let targetX: number, targetY: number, targetZ: number;

        if (logo && s > 0.001) {
          const lx = logo[i3];
          const ly = logo[i3 + 1];
          const lz = logo[i3 + 2];
          targetX = baseX * waveInfluence + lx * s;
          targetZ = baseZ * waveInfluence + lz * s;
          let waveY = Math.sin(baseX * 0.004 + time) * 8 + Math.cos(baseZ * 0.004 + time) * 8;
          waveY *= waveInfluence;
          targetY = waveY + ly * s;
        } else {
          targetX = baseX;
          targetZ = baseZ;
          targetY = Math.sin(baseX * 0.004 + time) * 8 + Math.cos(baseZ * 0.004 + time) * 8;
        }

        if (waveInfluence > 0.01) {
          if (mouseActive.current) {
            const dx = baseX - smoothMouse.current.x;
            const dz = baseZ - smoothMouse.current.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < hoverRadius) {
              const t = dist / hoverRadius;
              targetY += hoverStrength * Math.pow(1 - t * t, 1.2) * waveInfluence;
            }
          }
          ripples.current.forEach(r => {
            const dx = baseX - r.x;
            const dz = baseZ - r.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const currentRadius = r.time * waveSpeed;
            const distFromWave = Math.abs(dist - currentRadius);
            if (distFromWave < waveWidth) {
              const decay = Math.pow(1 - r.time / 7, 1.5);
              const t = distFromWave / waveWidth;
              targetY += Math.sin(t * Math.PI) * r.power * decay * waveInfluence;
            }
          });
        }

        currentArr[i3] += (targetX - currentArr[i3]) * positionLerp;
        currentArr[i3 + 1] += (targetY - currentArr[i3 + 1]) * positionLerp;
        currentArr[i3 + 2] += (targetZ - currentArr[i3 + 2]) * positionLerp;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('scroll', onScroll);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="position-fixed top-0 start-0 w-100 h-100 z-0"
      style={{ background: 'radial-gradient(circle at 50% 50%, #001214 0%, #000 100%)', cursor: 'crosshair' }} />
  );
};

export default HeroVisual;