import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Shield, Lock, Send } from 'lucide-react';

const AuditVisual: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let width = mount.clientWidth;
        let height = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Security Shield / Hexagon
        const shieldGroup = new THREE.Group();
        scene.add(shieldGroup);

        // Lock Body
        const bodyGeo = new THREE.BoxGeometry(4, 3, 1.5);
        const bodyMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.3 });
        const lockBody = new THREE.Mesh(bodyGeo, bodyMat);
        lockBody.position.y = -1;
        shieldGroup.add(lockBody);

        // Lock Shackle (Torus half)
        const shackleGeo = new THREE.TorusGeometry(1.8, 0.4, 16, 32, Math.PI);
        const shackleMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.5 });
        const shackle = new THREE.Mesh(shackleGeo, shackleMat);
        shackle.position.y = 1;
        shieldGroup.add(shackle);

        // Keyhole/Center
        const keyholeGeo = new THREE.CircleGeometry(0.5, 32);
        const keyholeMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, side: THREE.DoubleSide });
        const keyhole = new THREE.Mesh(keyholeGeo, keyholeMat);
        keyhole.position.y = -1;
        keyhole.position.z = 0.8;
        shieldGroup.add(keyhole);

        // Particles
        const particlesGeo = new THREE.BufferGeometry();
        const count = 200;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 0.05,
            transparent: true,
            opacity: 0.4
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        const animate = () => {
            requestAnimationFrame(animate);

            lockBody.rotation.y += 0.005;
            shackle.rotation.y += 0.005;
            keyhole.rotation.y += 0.005;

            shieldGroup.rotation.z = Math.sin(Date.now() * 0.0005) * 0.1;

            particles.rotation.y += 0.0005;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!mount) return;
            width = mount.clientWidth;
            height = mount.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mount) mount.removeChild(renderer.domElement);
            renderer.dispose();
            bodyGeo.dispose();
            bodyMat.dispose();
            shackleGeo.dispose();
            shackleMat.dispose();
            keyholeGeo.dispose();
            keyholeMat.dispose();
            particlesGeo.dispose();
            particlesMat.dispose();
        };
    }, []);

    return <div ref={mountRef} className="position-absolute w-100 h-100 top-0 start-0 z-0" style={{ pointerEvents: 'none' }} />;
};

const RequestAuditPage: React.FC = () => {
    const [formData, setFormData] = useState({
        projectName: '',
        contactEmail: '',
        telegram: '',
        auditType: 'Smart Contract Audit',
        nContracts: '',
        loc: '',
        blockchain: 'Ethereum',
        additionalNotes: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Using same EmailJS logic as ContactForm, but potentially different template if available.
        // For now using the same secrets as ContactPage.
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUDIT_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        const templateParams = {
            from_name: formData.projectName,
            from_email: formData.contactEmail,
            message: `
                Project: ${formData.projectName}
                Type: ${formData.auditType}
                Email: ${formData.contactEmail}
                Contracts: ${formData.nContracts}
                LOC: ${formData.loc}
                Chain: ${formData.blockchain}
                Telegram: ${formData.telegram}
                Notes: ${formData.additionalNotes}
            `,
            to_email: 'gujaratirutvik007@gmail.com'
        };

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
            setFormData({
                projectName: '',
                contactEmail: '',
                telegram: '',
                auditType: 'Smart Contract Audit',
                nContracts: '',
                loc: '',
                blockchain: 'Ethereum',
                additionalNotes: ''
            });
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="bg-black text-white min-vh-100 position-relative overflow-hidden w-100 audit-form-page">
            <style>
                {`
                    .audit-form-page input::placeholder,
                    .audit-form-page textarea::placeholder {
                        color: rgba(255, 255, 255, 0.5) !important;
                    }
                    .audit-form-page input,
                    .audit-form-page textarea,
                    .audit-form-page select {
                        background-color: rgba(0, 0, 0, 0.5) !important;
                        color: white !important;
                        border-color: rgba(255, 255, 255, 0.1) !important;
                    }
                    .audit-form-page input:focus,
                    .audit-form-page textarea:focus,
                    .audit-form-page select:focus {
                        background-color: rgba(0, 0, 0, 0.7) !important;
                        border-color: #00f2ff !important;
                        box-shadow: 0 0 0 0.25rem rgba(0, 242, 255, 0.25) !important;
                    }
                `}
            </style>
            <AuditVisual />

            <div className="container position-relative z-1 d-flex flex-column justify-content-center min-vh-100 py-5">
                <div className="row justify-content-center align-items-center" style={{ paddingTop: '100px' }}>

                    {/* Intro Text */}
                    <div className="col-lg-5 mb-5 mb-lg-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="badge border border-info text-info rounded-pill px-3 py-2 mb-3 bg-transparent">SECURE YOUR PROTOCOL</span>
                            <h1 className="display-3 fw-bold mb-4">
                                Request a <br />
                                <span className="text-info">Security Audit</span>
                            </h1>
                            <p className="lead text-white-50 mb-5">
                                Cyphrix provides comprehensive smart contract audits, penetration testing, and formal verification services.
                                Secure your code before deployment.
                            </p>

                            <div className="d-flex align-items-center gap-4 text-white-50 small">
                                <div className="d-flex align-items-center gap-2">
                                    <Shield size={18} className="text-success" />
                                    <span>Detailed Reporting</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Lock size={18} className="text-info" />
                                    <span>Private & Confidential</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Form Card */}
                    <div className="col-lg-6 offset-lg-1">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="p-4 p-md-5 rounded-5 border border-white border-opacity-10 bg-dark bg-opacity-75 backdrop-blur-lg shadow-2xl"
                        >
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small text-info fw-bold">Project Name</label>
                                        <input
                                            name="projectName"
                                            value={formData.projectName}
                                            onChange={handleChange}
                                            className="form-control bg-black border-secondary text-white shadow-none"
                                            placeholder="DeFi Protocol V1"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-info fw-bold">Audit Type</label>
                                        <select
                                            name="auditType"
                                            value={formData.auditType}
                                            onChange={handleChange}
                                            className="form-select bg-black border-secondary text-white shadow-none"
                                        >
                                            <option>Smart Contract Audit</option>
                                            <option>Penetration Testing</option>
                                            <option>Formal Verification</option>
                                            <option>Consultation</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label small text-info fw-bold">No. of Contracts</label>
                                        <input
                                            type="number"
                                            name="nContracts"
                                            value={formData.nContracts}
                                            onChange={handleChange}
                                            className="form-control bg-black border-secondary text-white shadow-none"
                                            placeholder="5"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-info fw-bold">Lines of Code (approx)</label>
                                        <input
                                            type="number"
                                            name="loc"
                                            value={formData.loc}
                                            onChange={handleChange}
                                            className="form-control bg-black border-secondary text-white shadow-none"
                                            placeholder="1500"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small text-info fw-bold">Target Chain</label>
                                        <select
                                            name="blockchain"
                                            value={formData.blockchain}
                                            onChange={handleChange}
                                            className="form-select bg-black border-secondary text-white shadow-none"
                                        >
                                            <option>Ethereum</option>
                                            <option>BSC</option>
                                            <option>Polygon</option>
                                            <option>Arbitrum</option>
                                            <option>Solana</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small text-info fw-bold">Contact Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            className="form-control bg-black border-secondary text-white shadow-none"
                                            placeholder="security@project.io"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small text-info fw-bold">Telegram / Discord</label>
                                        <input
                                            name="telegram"
                                            value={formData.telegram}
                                            onChange={handleChange}
                                            className="form-control bg-black border-secondary text-white shadow-none"
                                            placeholder="@username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label small text-info fw-bold">Additional Notes / Scope</label>
                                    <textarea
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleChange}
                                        className="form-control bg-black border-secondary text-white shadow-none"
                                        rows={3}
                                        placeholder="Specific contracts to focus on, timeline requirements..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending' || status === 'success'}
                                    className={`btn ${status === 'success' ? 'btn-success' : 'btn-info'} text-dark fw-bold py-3 mt-3 w-100 rounded-pill d-flex align-items-center justify-content-center gap-2`}
                                >
                                    {status === 'sending' ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : status === 'success' ? (
                                        <>Request Sent <Shield size={18} /></>
                                    ) : (
                                        <>Submit Request <Send size={18} /></>
                                    )}
                                </button>
                                {status === 'success' && <p className="text-success small text-center mt-2">We will review your request and get back to you shortly via secure channel.</p>}
                                {status === 'error' && <p className="text-danger small text-center mt-2">Failed to send request. Please try again or email us directly.</p>}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAuditPage;
