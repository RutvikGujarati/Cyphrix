import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

const ContactVisual = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
        camera.position.z = 400;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // --- DENSE NETWORK GLOBE ---
        // Increase density for "accurate" tech look
        const particleCount = 400;
        const r = 160;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        // Fibonacci Sphere distribution for even spread
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < particleCount; i++) {
            const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

            positions[i * 3] = x * r;
            positions[i * 3 + 1] = y * r;
            positions[i * 3 + 2] = z * r;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00f2ff, // Brighter Cyan
            size: 2.5,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connections
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00c6fb,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });

        const lineGeo = new THREE.BufferGeometry();
        // Dynamic line buffer? No, let's precompute neighbors to save perf.
        // We only connect close neighbors.
        const linePositions: number[] = [];

        for (let i = 0; i < particleCount; i++) {
            // Check all other particles? O(N^2) for 400 is 160,000 checks. Fine for init.
            let connections = 0;
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                // Distance threshold ~35 units
                if (distSq < 35 * 35 && connections < 4) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                    connections++;
                }
            }
        }
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(lineGeo, lineMaterial);
        scene.add(lines);

        // Add an inner "core" sphere for depth
        const coreGeo = new THREE.IcosahedronGeometry(r * 0.4, 1);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        const animate = () => {
            requestAnimationFrame(animate);

            particles.rotation.y += 0.0015;
            lines.rotation.y += 0.0015;
            core.rotation.y -= 0.002;
            core.rotation.x += 0.001;

            // Subtle bob
            const time = Date.now() * 0.0005;
            scene.rotation.z = Math.sin(time) * 0.1;

            renderer.render(scene, camera);
        };
        animate();

        const resize = () => {
            if (!mount) return;
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            lineGeo.dispose();
            material.dispose();
            lineMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-100 h-100 position-absolute top-0 start-0 z-0" style={{ pointerEvents: 'none' }} />;
};

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // EMAILJS CONFIGURATION
        // REPLACE THESE WITH YOUR ACTUAL KEYS FROM https://www.emailjs.com/
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            company: formData.company,
            message: formData.message,
            to_email: 'gujaratirutvik007@gmail.com'
        };

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            setStatus('success');
            setFormData({ name: '', company: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <label className="form-label small text-white-50">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control bg-dark border-secondary text-white rounded-2 py-2"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small text-white-50">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-control bg-dark border-secondary text-white rounded-2 py-2"
                        placeholder="Acme Corp"
                    />
                </div>
            </div>
            <div>
                <label className="form-label small text-white-50">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control bg-dark border-secondary text-white rounded-2 py-2"
                    placeholder="john@acme.com"
                    required
                />
            </div>
            <div>
                <label className="form-label small text-white-50">Message</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control bg-dark border-secondary text-white rounded-2 py-2"
                    rows={4}
                    placeholder="How can we help you?"
                    required
                ></textarea>
            </div>

            <div className="d-flex align-items-center gap-3 mt-2">
                <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    className={`btn ${status === 'success' ? 'btn-success' : 'btn-info text-dark'} fw-bold py-2 px-4 rounded-pill transition-all`}
                >
                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {status === 'error' && <span className="text-danger small">Transmission Failed. Check console.</span>}
            </div>
        </form>
    );
}

export default function ContactPage() {
    return (
        <div className="vh-100 w-100 position-relative bg-black text-white d-flex align-items-center justify-content-center overflow-hidden" style={{ paddingTop: '80px' }}>
            <ContactVisual />
            <div className="container position-relative z-1">
                <div className="row align-items-center">
                    <div className="col-lg-5 mb-5 mb-lg-0">
                        <div className="mb-4">
                            <span className="badge border border-info text-info rounded-pill px-3 py-2 mb-3 bg-transparent">SECURE CHANNEL OPEN</span>
                            <h1 className="display-3 fw-bold mb-4">Initialize<br />Contact</h1>
                            <p className="lead text-white-50">
                                Ready to secure your infrastructure? Our elite team of auditors and security architects is standing by.
                            </p>
                        </div>
                        <div className="d-flex flex-column gap-3 border-start border-white border-opacity-10 ps-4">
                            <div>
                                <h6 className="text-uppercase small text-white-50 mb-1">Secure Comms</h6>
                                <p className="mb-0">establish@cyphrix.tech</p>
                            </div>
                            <div>
                                <h6 className="text-uppercase small text-white-50 mb-1">PGP Key</h6>
                                <p className="font-monospace small opacity-50 mb-0">0x4D 8A 2F 91 C3 ...</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 offset-lg-1">
                        <div className="p-4 border border-white border-opacity-10 bg-black bg-opacity-50 backdrop-blur-md rounded-4">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
