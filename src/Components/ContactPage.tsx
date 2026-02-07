import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

const ContactVisual = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let width = mount.clientWidth;
        let height = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.set(0, 80, 200);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const ringGeo = new THREE.RingGeometry(20, 22, 128);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00f2ff,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        const scanRing = new THREE.Mesh(ringGeo, ringMat);
        scanRing.rotation.x = -Math.PI / 2;
        scene.add(scanRing);

        const streamCount = 80;
        const streamGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(streamCount * 6);

        for (let i = 0; i < streamCount; i++) {
            const x = (Math.random() - 0.5) * 300;
            const z = (Math.random() - 0.5) * 300;
            const yTop = Math.random() * 120 + 40;
            positions.set([x, 0, z, x, yTop, z], i * 6);
        }

        streamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const streamMat = new THREE.LineBasicMaterial({
            color: 0x00c6fb,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });

        const streams = new THREE.LineSegments(streamGeo, streamMat);
        scene.add(streams);

        let ringScale = 1;
        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            ringScale += 0.015;
            scanRing.scale.set(ringScale, ringScale, ringScale);
            scanRing.material.opacity = Math.max(0, 0.5 - ringScale * 0.05);

            if (ringScale > 8) {
                ringScale = 1;
                scanRing.material.opacity = 0.4;
            }
            streams.rotation.y += 0.0006;
            renderer.render(scene, camera);
        };

        animate();

        const resize = () => {
            if (!mount) return;
            width = mount.clientWidth;
            height = mount.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            streamGeo.dispose();
            streamMat.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="w-100 h-100 position-absolute top-0 start-0 z-0"
            style={{ pointerEvents: 'none' }}
        />
    );
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
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <label className="form-label small text-white-50">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label small text-white-50">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none"
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
                    className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none"
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
                    className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none"
                    rows={4}
                    placeholder="How can we help you?"
                    required
                ></textarea>
            </div>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mt-2">
                <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    className={`btn ${status === 'success' ? 'btn-success' : 'btn-info text-dark'} fw-bold py-2 px-4 rounded-pill transition-all w-100 w-sm-auto`}
                >
                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {status === 'error' && <span className="text-danger small text-center text-sm-start">Transmission Failed.</span>}
            </div>
        </form>
    );
}

export default function ContactPage() {
    return (
        <div className="min-vh-100 w-100 position-relative bg-black text-white d-flex align-items-center py-5 overflow-hidden">
            <ContactVisual />
            <div className="container position-relative z-1 py-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-5 text-center text-lg-start">
                        <div className="mb-4">
                            <span className="badge border border-info text-info rounded-pill px-3 py-2 mb-3 bg-transparent">SECURE CHANNEL OPEN</span>
                            <h1 className="display-4 display-md-3 fw-bold mb-4">Initialize<br className="d-none d-lg-block" /> Contact</h1>
                            <p className="lead text-white-50 mx-auto mx-lg-0" style={{ maxWidth: '500px' }}>
                                Ready to secure your infrastructure? Our elite team of auditors and security architects is standing by.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-6 offset-lg-1">
                        <div className="p-3 p-sm-4 border border-white border-opacity-10 bg-black bg-opacity-50 rounded-4" style={{ backdropFilter: 'blur(12px)' }}>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}