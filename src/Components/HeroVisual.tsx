import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LOGO_VIEWBOX = 2500;
const LOGO_WORLD_SCALE_X = 0.25;
const LOGO_WORLD_SCALE_Y = 0.22;
const LOGO_WORLD_SCALE_Z = 0.25;

const SCROLL_RANGE = 600;

interface HeroVisualProps {
  logoProgress?: number;
  onVisualComplete?: () => void;
}

const HeroVisual = ({ logoProgress, onVisualComplete }: HeroVisualProps) => {
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
  const shakeProgress = useRef(0);
  const randomDirs = useRef(new Float32Array(numParticles * 3));
  const particleVelocities = useRef(new Float32Array(numParticles * 3));
  const particleColors = useRef(new Float32Array(numParticles * 3));
  const hasTriggeredComplete = useRef(false);

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

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersect = new THREE.Vector3();

    const positions = new Float32Array(numParticles * 3);
    const basePositions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

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

      colors[i3] = 0.0;
      colors[i3 + 1] = 0.78;
      colors[i3 + 2] = 0.98;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    for (let i = 0; i < numParticles; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1800 + Math.random() * 1200;

      randomDirs.current[i3] = Math.sin(phi) * Math.cos(theta) * r;
      randomDirs.current[i3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      randomDirs.current[i3 + 2] = Math.cos(phi) * r;

      particleVelocities.current[i3] = (Math.random() - 0.5) * 0.3;
      particleVelocities.current[i3 + 1] = (Math.random() - 0.5) * 0.3;
      particleVelocities.current[i3 + 2] = (Math.random() - 0.5) * 0.3;

      const hue = Math.random();
      if (hue < 0.35) {
        particleColors.current[i3] = 1.0;
        particleColors.current[i3 + 1] = 0.2 + Math.random() * 0.2;
        particleColors.current[i3 + 2] = 0.0;
      } else if (hue < 0.7) {
        particleColors.current[i3] = 1.0;
        particleColors.current[i3 + 1] = 0.5 + Math.random() * 0.4;
        particleColors.current[i3 + 2] = 0.0;
      } else {
        particleColors.current[i3] = 1.0;
        particleColors.current[i3 + 1] = 1.0;
        particleColors.current[i3 + 2] = 0.9 + Math.random() * 0.1;
      }
    }

    function createBlueGradientTexture() {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, '#00f2ff');
      gradient.addColorStop(0.5, '#005bea');
      gradient.addColorStop(1, 'rgba(0,198,251,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const material = new THREE.PointsMaterial({
      size: 5.2,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      map: createBlueGradientTexture(),
      depthWrite: false,
      vertexColors: true,
    });

    const ambient = new THREE.AmbientLight(0x1a3cff, 0.45);
    scene.add(ambient);

    const logoLight = new THREE.PointLight(0x00c6fb, 0, 500);
    logoLight.position.set(0, 0, 0);
    scene.add(logoLight);

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 3000;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 3000;
      starPos[i * 3 + 2] = -1000 + Math.random() * -3000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 2.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

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
        const wx = (p.x - center) * LOGO_WORLD_SCALE_X;
        const wy = (center - p.y) * LOGO_WORLD_SCALE_Y - 30;
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
    const scrollLerp = 0.025;
    const positionLerp = 0.035;

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

      if (scrollProgress.current < 0.98) {
        bangStarted.current = false;
        bangProgress.current = 0;
        bangDelay.current = 0;
        shakeProgress.current = 0;
        hasTriggeredComplete.current = false;
      }

      if (scrollProgress.current >= 0.98 && smoothScroll.current > 0.99) {
        bangDelay.current += dt;

        // Wait 1.0s (Hold) + 0.8s (Shake) = 1.8s total before explode
        if (bangDelay.current > 1.8 && !bangStarted.current) {
          bangStarted.current = true;
          bangProgress.current = 0;
        }
        if (bangStarted.current) {
          bangProgress.current += dt * 0.25;
          bangProgress.current = Math.min(1, bangProgress.current);

          if (bangProgress.current >= 1 && onVisualComplete && !hasTriggeredComplete.current) {
            hasTriggeredComplete.current = true;
            onVisualComplete();
          }
        }
      }

      smoothMouse.current.x += (mouseWorld.current.x - smoothMouse.current.x) * mouseLerp;
      smoothMouse.current.z += (mouseWorld.current.z - smoothMouse.current.z) * mouseLerp;
      smoothScroll.current += (scrollProgress.current - smoothScroll.current) * scrollLerp;

      const posAttr = particles.geometry.attributes.position;
      const colorAttr = particles.geometry.attributes.color;
      const currentArr = posAttr.array as Float32Array;
      const colorArr = colorAttr.array as Float32Array;
      const logo = logoPositions.current;

      ripples.current = ripples.current.filter(r => {
        r.time += dt * 1.2;
        return r.time < 7;
      });

      const s = smoothScroll.current;
      const easedS = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
      const waveInfluence = 1 - easedS;

      const logoFormed = easedS > 0.97;
      const sunBrightness = logoFormed ? Math.min(1, (easedS - 0.97) / 0.03) : 0;

      logoLight.intensity = sunBrightness * 8;
      material.opacity = 0.72 + sunBrightness * 0.28;

      if (logoFormed && bangDelay.current < 1.8) {
        if (bangDelay.current > 1.0) {
          shakeProgress.current = Math.min(1, (bangDelay.current - 1.0) / 0.8);
        } else {
          shakeProgress.current = 0;
        }
      }

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const baseX = basePositions[i3];
        const baseZ = basePositions[i3 + 2];

        let targetX: number, targetY: number, targetZ: number;

        const waveBase = Math.sin(baseX * 0.008 + time * 1.2) * 18 + Math.cos(baseZ * 0.008 + time * 1.1) * 18;
        const waveLayer = Math.sin((baseX + baseZ) * 0.004 + time * 0.7) * 8;

        if (logo && easedS > 0.001) {
          const lx = logo[i3];
          const ly = logo[i3 + 1];
          const lz = logo[i3 + 2];
          targetX = baseX * waveInfluence + lx * easedS;
          targetZ = baseZ * waveInfluence + lz * easedS;
          const  waveY = (waveBase + waveLayer) * waveInfluence;
          targetY = waveY + ly * easedS;
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

        if (shakeProgress.current > 0 && bangProgress.current === 0) {
          const shake = shakeProgress.current;
          const intensity = 8 * shake;
          const freq = 40;
          const shakeX = Math.sin(time * freq + i * 0.1) * intensity;
          const shakeY = Math.cos(time * freq * 1.3 + i * 0.15) * intensity;
          const shakeZ = Math.sin(time * freq * 0.8 + i * 0.12) * intensity;

          targetX += shakeX;
          targetY += shakeY;
          targetZ += shakeZ;
        }

        if (bangProgress.current > 0) {
          const bang = Math.pow(bangProgress.current, 1.3);

          const explosionX = randomDirs.current[i3];
          const explosionY = randomDirs.current[i3 + 1];
          const explosionZ = randomDirs.current[i3 + 2];

          targetX += explosionX * bang;
          targetY += explosionY * bang;
          targetZ += explosionZ * bang;

          const swirl = bang * 2.2;
          const sX = targetX;
          const sZ = targetZ;
          targetX = sX * Math.cos(swirl) - sZ * Math.sin(swirl);
          targetZ = sX * Math.sin(swirl) + sZ * Math.cos(swirl);

          const fireR = particleColors.current[i3];
          const fireG = particleColors.current[i3 + 1];
          const fireB = particleColors.current[i3 + 2];

          colorArr[i3] = (1 - bang) * (0.0 + sunBrightness * 1.0) + bang * fireR;
          colorArr[i3 + 1] = (1 - bang) * (0.78 + sunBrightness * 0.22) + bang * fireG;
          colorArr[i3 + 2] = (1 - bang) * (0.98 + sunBrightness * 0.02) + bang * fireB;
        } else {
          colorArr[i3] = 0.0 + sunBrightness * 1.0;
          colorArr[i3 + 1] = 0.78 + sunBrightness * 0.22;
          colorArr[i3 + 2] = 0.98 + sunBrightness * 0.02;
        }

        currentArr[i3] += (targetX - currentArr[i3]) * positionLerp;
        currentArr[i3 + 1] += (targetY - currentArr[i3 + 1]) * positionLerp;
        currentArr[i3 + 2] += (targetZ - currentArr[i3 + 2]) * positionLerp;
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      if (stars) {
        stars.rotation.z += 0.0002;
      }

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
  }, [onVisualComplete]);

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