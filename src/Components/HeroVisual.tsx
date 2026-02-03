import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LOGO_VIEWBOX = 2500;
// Reduce logo size and adjust aspect for vertical orientation
// Further refine aspect ratio for a perfect hexagon
const LOGO_WORLD_SCALE_X = 0.25; // best fit for hexagon width
const LOGO_WORLD_SCALE_Y = 0.22; // best fit for hexagon height
const LOGO_WORLD_SCALE_Z = 0.25;

const SCROLL_RANGE = 600;

interface HeroVisualProps {
  /** Drives logo transition (0–1) during scroll-jack; when set, page does not scroll. */
  logoProgress?: number;
}

const HeroVisual = ({ logoProgress }: HeroVisualProps) => {
  const numParticles = 40000;
  const mountRef = useRef<HTMLDivElement>(null);
  const ripples = useRef<Array<{ x: number; z: number; time: number; power: number }>>([]);
  const mouseWorld = useRef({ x: 0, z: 0 });
  const smoothMouse = useRef({ x: 0, z: 0 });
  const mouseActive = useRef(false);
  const scrollProgress = useRef(0);
  const smoothScroll = useRef(0);
  const logoPositions = useRef<Float32Array | null>(null);
  const logoProgressRef = useRef<number | undefined>(undefined);
  const bangProgress = useRef(0);
  const bangStarted = useRef(false);
  const bangDelay = useRef(0);
  const randomDirs = useRef(new Float32Array(numParticles * 3));

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

    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 800 + Math.random() * 400; // Expansion radius

      randomDirs.current[i3] = Math.sin(phi) * Math.cos(theta) * r;
      randomDirs.current[i3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      randomDirs.current[i3 + 2] = Math.cos(phi) * r;
    }
    // Create a custom blue gradient texture for particles (logo stays blue themed)
    function createBlueGradientTexture() {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#00c6fb'); // blue
      gradient.addColorStop(0.5, '#005bea'); // deeper blue
      gradient.addColorStop(1, '#00f2ff'); // cyan
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const material = new THREE.PointsMaterial({
      size: 5.2,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      map: createBlueGradientTexture(),
      depthWrite: false,
    });
    // Add a blue ambient light for the overall scene
    const ambient = new THREE.AmbientLight(0x1a3cff, 0.45);
    scene.add(ambient);

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
        // Center and scale logo, and transform in y-axis for vertical orientation
        const wx = (p.x - center) * LOGO_WORLD_SCALE_X;
        // Center logo vertically (reduce upward offset)
        const wy = (center - p.y) * LOGO_WORLD_SCALE_Y - 30; // -30 centers logo better
        const wz = 0 * LOGO_WORLD_SCALE_Z;
        out[i * 3] = wx;
        out[i * 3 + 1] = wy;
        out[i * 3 + 2] = wz;
      }
      if (points.length < numParticles) {
        for (let i = points.length; i < numParticles; i++) {
          const p = points[Math.floor(Math.random() * points.length)];
          const wx = (p.x - center) * LOGO_WORLD_SCALE_X;
          const wy = (center - p.y) * LOGO_WORLD_SCALE_Y - 30;
          const wz = 0 * LOGO_WORLD_SCALE_Z;
          out[i * 3] = wx;
          out[i * 3 + 1] = wy;
          out[i * 3 + 2] = wz;
        }
      } else if (points.length > numParticles) {
        const shuffled = [...points].sort(() => Math.random() - 0.5);
        for (let i = 0; i < numParticles; i++) {
          const p = shuffled[i];
          const wx = (p.x - center) * LOGO_WORLD_SCALE_X;
          const wy = (center - p.y) * LOGO_WORLD_SCALE_Y - 30;
          const wz = 0 * LOGO_WORLD_SCALE_Z;
          out[i * 3] = wx;
          out[i * 3 + 1] = wy;
          out[i * 3 + 2] = wz;
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

      // Reset bang if scrolling back
      if (scrollProgress.current < 1) {
        bangStarted.current = false;
        bangProgress.current = 0;
        bangDelay.current = 0;
      }

      // Trigger bang after logo transformation completes with a short delay
      if (scrollProgress.current >= 1) {
        bangDelay.current += dt;
        if (bangDelay.current > 0.5 && !bangStarted.current) { // 0.5 second delay
          bangStarted.current = true;
          bangProgress.current = 0;
        }
        if (bangStarted.current) {
          bangProgress.current += dt * 1.5;
          bangProgress.current = Math.min(1, bangProgress.current);
        }
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

        // Modern waveform: more dynamic, flowing, and layered
        const waveBase = Math.sin(baseX * 0.008 + time * 1.2) * 18 + Math.cos(baseZ * 0.008 + time * 1.1) * 18;
        const waveLayer = Math.sin((baseX + baseZ) * 0.004 + time * 0.7) * 8;

        if (logo && s > 0.001) {
          const lx = logo[i3];
          const ly = logo[i3 + 1];
          const lz = logo[i3 + 2];
          targetX = baseX * waveInfluence + lx * s;
          targetZ = baseZ * waveInfluence + lz * s;
          let waveY = (waveBase + waveLayer) * waveInfluence;
          targetY = waveY + ly * s;
        } else {
          targetX = baseX;
          targetZ = baseZ;
          targetY = waveBase + waveLayer;
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

        // Big Bang dispersion after logo completes
        if (bangProgress.current > 0) {
          const bang = bangProgress.current;

          // Instead of pushing from center, we lerp toward random spherical targets
          // This creates an explosion that fills the 3D space uniformly
          targetX += randomDirs.current[i3] * bang;
          targetY += randomDirs.current[i3 + 1] * bang;
          targetZ += randomDirs.current[i3 + 2] * bang;

          // Optional: Add a subtle spinning turbulence to the bang expansion
          const swirl = bang * 2.0;
          const sX = targetX;
          const sZ = targetZ;
          targetX = sX * Math.cos(swirl) - sZ * Math.sin(swirl);
          targetZ = sX * Math.sin(swirl) + sZ * Math.cos(swirl);
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

  // Add a shining half-sun effect using a CSS radial gradient overlay
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <div
        ref={mountRef}
        className="position-fixed top-0 start-0 w-100 h-100 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #001214 0%, #000 100%)',
          width: '100vw',
          height: '100vh',
          cursor: 'crosshair',
        }}
      />
      {/* Shining half-sun effect in the top left corner */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,246,176,0.38) 0%, rgba(0,198,251,0.12) 30%, rgba(0,0,0,0) 60%)',
        }}
      />
    </div>
  );
};

export default HeroVisual;