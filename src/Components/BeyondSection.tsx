import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './BeyondSection.css';

const CYAN = 0x00f2ff;

/**
 * Unique "Beyond" section: full-viewport tunnel of light and particles,
 * minimal typography – one line, one feeling.
 */
const BeyondVisual = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Tunnel: rings receding into depth
    const ringCount = 24;
    const rings: THREE.LineLoop[] = [];
    const ringGeo = new THREE.BufferGeometry();
    const ringPoints: THREE.Vector3[] = [];
    const ringRadius = 3;
    const ringSegments = 32;
    for (let i = 0; i <= ringSegments; i++) {
      const t = (i / ringSegments) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(t) * ringRadius, Math.sin(t) * ringRadius, 0));
    }
    ringGeo.setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < ringCount; i++) {
      const z = -2 - i * 0.4;
      const ring = new THREE.LineLoop(ringGeo.clone(), ringMat.clone());
      ring.position.z = z;
      ring.scale.setScalar(0.3 + (i / ringCount) * 0.7);
      scene.add(ring);
      rings.push(ring);
    }

    // Particles drifting through tunnel
    const particleCount = 600;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: CYAN,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', resize);

    let frameId: number;
    let time = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.012;
      rings.forEach((r, i) => {
        r.position.z += 0.08;
        if (r.position.z > 2) r.position.z = -10;
        (r.material as THREE.LineBasicMaterial).opacity = 0.2 + 0.3 * Math.sin(time + i * 0.2);
      });
      const arr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 2] += 0.04;
        if (arr[i * 3 + 2] > 10) arr[i * 3 + 2] = -10;
      }
      particleGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
      mount.removeChild(renderer.domElement);
      ringGeo.dispose();
      ringMat.dispose();
      rings.forEach((r) => r.geometry.dispose());
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="beyond-visual w-100 h-100" aria-hidden />;
};

export default function BeyondSection() {
  return (
    <section className="beyond-section position-relative min-vh-100 d-flex align-items-center justify-content-center py-5 overflow-hidden">
      <div className="beyond-backdrop" aria-hidden />
      <div className="beyond-visual-wrapper position-absolute top-0 start-0 w-100 h-100">
        <BeyondVisual />
      </div>
      <div className="position-relative z-2 text-center px-4">
        <p className="beyond-label text-uppercase small fw-bold text-info opacity-75 mb-3 letter-spacing-wide">
          Beyond the Mesh
        </p>
        <h2 className="beyond-headline display-4 fw-bold text-white mb-0">
          Verifiable. Encrypted. Resilient.
        </h2>
      </div>
    </section>
  );
}
