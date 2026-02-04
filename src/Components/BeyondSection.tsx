import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BeyondVisual = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Clean up any existing renderer first
    if (rendererRef.current) {
      if (mount.contains(rendererRef.current.domElement)) {
        mount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const shaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            return fract(p.x * p.y);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.1;
          
          float n = noise(uv * 2.0 + t);
          n += noise(uv * 4.0 - t * 0.5) * 0.5;
          
          vec3 cyan = vec3(0.0, 0.9, 1.0);
          vec3 deepPurple = vec3(0.5, 0.0, 1.0);
          vec3 spaceGold = vec3(1.0, 0.8, 0.4);

          vec3 base = mix(cyan, deepPurple, uScroll);
          vec3 finalColor = mix(base, spaceGold, n * 0.3);
          
          gl_FragColor = vec4(finalColor * n * 0.4, 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMat);
    scene.add(plane);

    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 2] = Math.random() * -50;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const onScroll = () => {
      const currentScroll = window.scrollY - window.innerHeight;
      shaderMat.uniforms.uScroll.value = Math.max(0, Math.min(1, currentScroll / (window.innerHeight * 2)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      shaderMat.uniforms.uTime.value += 0.01;

      stars.position.z += 0.01 + (shaderMat.uniforms.uScroll.value * 0.05);
      if (stars.position.z > 10) stars.position.z = 0;

      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      if (!mount || !renderer) return;
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      shaderMat.uniforms.uResolution.value.set(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);

      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }

      plane.geometry.dispose();
      shaderMat.dispose();
      starGeo.dispose();
      starMat.dispose();

      if (renderer) {
        renderer.dispose();
        if (mount && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }

      sceneRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="beyond-visual w-100 h-100" />;
};

export default function BeyondSection() {
  return (
    <section className="beyond-section position-relative bg-black" style={{ minHeight: '150vh' }}>
      {/* BACKGROUND COMBO VISUAL */}
      <div className="position-fixed top-0 start-0 w-100 vh-100 z-0">
        <BeyondVisual />
      </div>

      {/* SERVICE 1: BLOCKCHAIN INFRASTRUCTURE */}
      <div className="position-relative min-vh-50 d-flex align-items-center z-1 px-4 px-lg-5 py-5">
        <div className="col-lg-6">
          <p className="text-info small tracking-widest text-uppercase fw-bold mb-3">[ 01_INFRASTRUCTURE ]</p>
          <h2 className="display-3 fw-bold text-white mb-4">Smart Contract Auditing</h2>
          <p className="lead text-white-50 mb-4">Securing the logical foundation of the decentralized web through rigorous bytecode analysis and formal verification.</p>
          <div className="row g-4 opacity-75">
            <div className="col-6 small border-start border-info ps-3">NODE VALIDATION</div>
            <div className="col-6 small border-start border-info ps-3">GAS OPTIMIZATION</div>
          </div>
        </div>
      </div>

      {/* SERVICE 2: SECURITY AGENCY */}
      <div className="position-relative min-vh-50 d-flex align-items-center justify-content-end z-1 px-4 px-lg-5 py-5">
        <div className="col-lg-6 text-lg-end">
          <p className="text-purple small tracking-widest text-uppercase fw-bold mb-3" style={{ color: '#a070ff' }}>[ 02_PROTOCOL_INTEGRITY ]</p>
          <h2 className="display-3 fw-bold text-white mb-4">Consensus Security</h2>
          <p className="lead text-white-50 mb-4">Architecting resilient cryptographic primitives and consensus mechanisms to ensure zero-trust ledger immutability.</p>
          <div className="d-flex gap-4 justify-content-lg-end opacity-75 small">
            <span>CRYPTOGRAPHIC PROOFS</span>
            <span className="text-info">/</span>
            <span>BYZANTINE FAULT TOLERANCE</span>
          </div>
        </div>
      </div>

      {/* SERVICE 3: INTEGRATED ECOSYSTEM */}
      <div className="position-relative min-vh-50 d-flex align-items-center justify-content-center z-1 px-4 px-lg-5 text-center py-5">
        <div className="col-lg-8">
          <p className="text-warning small tracking-widest text-uppercase fw-bold mb-3">[ 03_SYNERGY ]</p>
          <h2 className="display-3 fw-bold text-white mb-4">Web3 Ecosystem Defense</h2>
          <p className="lead text-white-50 mb-5">A comprehensive shield merging blockchain transparency with enterprise-grade cybersecurity protocols.</p>
          <div className="row g-4 text-start">
            <div className="col-md-4">
              <div className="p-3 border border-white border-opacity-10 rounded-4 h-100">
                <h5 className="text-white h6">DeFi Security</h5>
                <p className="small text-white mb-0">Protecting liquidity pools and cross-chain bridges from market manipulation and logic errors.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border border-white border-opacity-10 rounded-4 h-100">
                <h5 className="text-white h6">On-Chain Forensics</h5>
                <p className="small text-white mb-0">Real-time monitoring of transaction flows to detect anomalies and trace illicit funds.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border border-white border-opacity-10 rounded-4 h-100">
                <h5 className="text-white h6">DAOs & Governance</h5>
                <p className="small text-white mb-0">Auditing voting protocols and governance structures to ensure democratic integrity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}