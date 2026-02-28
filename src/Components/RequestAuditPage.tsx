import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Shield, Lock, Send } from 'lucide-react';

const AuditVisual: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let width = mount.clientWidth;
        let height = mount.clientHeight;

        const getScale = () => Math.max(0.4, Math.min(1, Math.min(width, height) / 500));
        let scale = getScale();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Security Shield / Hexagon
        const shieldGroup = new THREE.Group();
        shieldGroup.scale.set(scale, scale, scale);
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
            size: 0.08 * scale,
            transparent: true,
            opacity: 0.4
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        particles.scale.set(scale, scale, scale);
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
            scale = getScale();
            shieldGroup.scale.set(scale, scale, scale);
            particles.scale.set(scale, scale, scale);
            particlesMat.size = 0.08 * scale;
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
        additionalNotes: '',
        testingType: 'Black Box',
        targetAsset: '',
        pentestScope: 'Web Application',
        verificationScope: 'Invariants & Safety Properties',
        consultTopic: 'Smart Contract Architecture',
        timeline: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [otpExpiry, setOtpExpiry] = useState(0);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [otpError, setOtpError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [verifiedEmail, setVerifiedEmail] = useState('');

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    useEffect(() => {
        if (verifiedEmail && formData.contactEmail !== verifiedEmail) {
            setOtpSent(false); setOtpVerified(false); setOtpValue(''); setOtpToken(''); setOtpExpiry(0); setVerifiedEmail('');
        }
    }, [formData.contactEmail, verifiedEmail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!emailRegex.test(formData.contactEmail)) { setOtpError('Enter a valid email first'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 3000); return; }
        setOtpStatus('sending'); setOtpError('');
        try {
            const res = await fetch('/api/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.contactEmail }) });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || result.error || 'Failed');
            setOtpToken(result.token); setOtpExpiry(result.expiresAt); setOtpSent(true); setOtpStatus('sent'); setCooldown(60);
        } catch (err: any) {
            setOtpError(err.message || 'Failed to send OTP'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 5000);
        }
    };

    const handleVerifyOtp = () => {
        if (otpValue.length !== 6) return;
        setOtpVerified(true);
        setVerifiedEmail(formData.contactEmail);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.projectName.trim()) { setErrorMsg('Project name is required'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!emailRegex.test(formData.contactEmail)) { setErrorMsg('Please enter a valid email address'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!otpVerified) { setErrorMsg('Please verify your email first'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }

        setStatus('sending');

        const details: Record<string, string> = {};
        if (formData.auditType === 'Smart Contract Audit') {
            if (formData.nContracts) details['Contracts'] = formData.nContracts;
            if (formData.loc) details['Lines of Code'] = formData.loc;
            details['Blockchain'] = formData.blockchain;
        } else if (formData.auditType === 'Penetration Testing') {
            details['Testing Type'] = formData.testingType;
            if (formData.targetAsset) details['Target'] = formData.targetAsset;
            details['Scope'] = formData.pentestScope;
        } else if (formData.auditType === 'Formal Verification') {
            if (formData.nContracts) details['Contracts'] = formData.nContracts;
            if (formData.loc) details['Lines of Code'] = formData.loc;
            details['Blockchain'] = formData.blockchain;
            details['Verification Scope'] = formData.verificationScope;
        } else {
            details['Topic'] = formData.consultTopic;
            if (formData.timeline) details['Timeline'] = formData.timeline;
        }

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'audit',
                    subject: `Audit Request: ${formData.auditType} — ${formData.projectName}`,
                    name: formData.projectName,
                    email: formData.contactEmail,
                    audit: { auditType: formData.auditType, telegram: formData.telegram, details, notes: formData.additionalNotes },
                    otp: otpValue,
                    otpToken,
                    otpExpiry,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || result.error || 'Send failed');
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
            setFormData({ projectName: '', contactEmail: '', telegram: '', auditType: 'Smart Contract Audit', nContracts: '', loc: '', blockchain: 'Ethereum', additionalNotes: '', testingType: 'Black Box', targetAsset: '', pentestScope: 'Web Application', verificationScope: 'Invariants & Safety Properties', consultTopic: 'Smart Contract Architecture', timeline: '' });
            setOtpSent(false); setOtpVerified(false); setOtpValue(''); setOtpToken(''); setOtpExpiry(0); setVerifiedEmail('');
        } catch (error: any) {
            console.error('Email Error:', error);
            setErrorMsg(error.message || 'Unknown error');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 8000);
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

                                {/* Dynamic fields based on audit type */}
                                {formData.auditType === 'Smart Contract Audit' && (
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label small text-info fw-bold">No. of Contracts</label>
                                            <input type="number" name="nContracts" value={formData.nContracts} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="5" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-info fw-bold">Lines of Code (approx)</label>
                                            <input type="number" name="loc" value={formData.loc} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="1500" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-info fw-bold">Target Chain</label>
                                            <select name="blockchain" value={formData.blockchain} onChange={handleChange} className="form-select bg-black border-secondary text-white shadow-none">
                                                <option>Ethereum</option>
                                                <option>BSC</option>
                                                <option>Polygon</option>
                                                <option>Arbitrum</option>
                                                <option>Solana</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {formData.auditType === 'Penetration Testing' && (
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label small text-info fw-bold">Testing Type</label>
                                            <select name="testingType" value={formData.testingType} onChange={handleChange} className="form-select bg-black border-secondary text-white shadow-none">
                                                <option>Black Box</option>
                                                <option>White Box</option>
                                                <option>Gray Box</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-info fw-bold">Target (URL / IP)</label>
                                            <input name="targetAsset" value={formData.targetAsset} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="https://app.example.com" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-info fw-bold">Scope</label>
                                            <select name="pentestScope" value={formData.pentestScope} onChange={handleChange} className="form-select bg-black border-secondary text-white shadow-none">
                                                <option>Web Application</option>
                                                <option>API</option>
                                                <option>Mobile Application</option>
                                                <option>Network / Infrastructure</option>
                                                <option>Cloud Environment</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {formData.auditType === 'Formal Verification' && (
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <label className="form-label small text-info fw-bold">No. of Contracts</label>
                                            <input type="number" name="nContracts" value={formData.nContracts} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="3" />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small text-info fw-bold">Lines of Code</label>
                                            <input type="number" name="loc" value={formData.loc} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="1500" />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small text-info fw-bold">Target Chain</label>
                                            <select name="blockchain" value={formData.blockchain} onChange={handleChange} className="form-select bg-black border-secondary text-white shadow-none">
                                                <option>Ethereum</option>
                                                <option>BSC</option>
                                                <option>Polygon</option>
                                                <option>Solana</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small text-info fw-bold">Verification Scope</label>
                                            <select name="verificationScope" value={formData.verificationScope} onChange={handleChange} className="form-select bg-black border-secondary text-white shadow-none">
                                                <option>Invariants & Safety Properties</option>
                                                <option>Liveness & Fairness</option>
                                                <option>Functional Correctness</option>
                                                <option>Full Specification</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {formData.auditType === 'Consultation' && (
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-info fw-bold">Consultation Topic</label>
                                            <select name="consultTopic" value={formData.consultTopic} onChange={handleChange} className="form-select bg-black border-secondary text-white shadow-none">
                                                <option>Smart Contract Architecture</option>
                                                <option>Blockchain Selection & Design</option>
                                                <option>Security Review & Strategy</option>
                                                <option>Token Economics</option>
                                                <option>Regulatory & Compliance</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-info fw-bold">Preferred Timeline</label>
                                            <input name="timeline" value={formData.timeline} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="e.g. 2 weeks, ASAP" />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="form-label small text-info fw-bold">Contact Email <span className="text-danger">*</span></label>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
                                            className={`form-control bg-black border-secondary text-white shadow-none ${otpVerified ? 'border-success' : ''}`}
                                            placeholder="security@project.io" required disabled={otpVerified}
                                        />
                                        {!otpVerified ? (
                                            <button type="button" onClick={handleSendOtp} disabled={otpStatus === 'sending' || cooldown > 0}
                                                className="btn btn-outline-info btn-sm rounded-pill px-3 text-nowrap">
                                                {otpStatus === 'sending' ? 'Sending...' : cooldown > 0 ? `Resend (${cooldown}s)` : otpSent ? 'Resend OTP' : 'Verify Email'}
                                            </button>
                                        ) : (
                                            <span className="btn btn-success btn-sm rounded-pill px-3 text-nowrap disabled d-flex align-items-center gap-1">Verified</span>
                                        )}
                                    </div>
                                    {otpStatus === 'error' && <small className="text-danger mt-1 d-block">{otpError}</small>}
                                </div>

                                {otpSent && !otpVerified && (
                                    <div>
                                        <label className="form-label small text-info fw-bold">Enter 6-digit verification code</label>
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text" maxLength={6} value={otpValue}
                                                onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                className="form-control bg-black border-secondary text-white shadow-none text-center fw-bold"
                                                style={{ letterSpacing: '6px', maxWidth: '200px', fontFamily: 'monospace' }}
                                                placeholder="------"
                                            />
                                            <button type="button" onClick={handleVerifyOtp} disabled={otpValue.length !== 6}
                                                className="btn btn-info btn-sm text-dark rounded-pill px-3 fw-bold">Confirm</button>
                                        </div>
                                        <small className="text-white-50 mt-1 d-block">Check your inbox for the code. Expires in 5 minutes.</small>
                                    </div>
                                )}

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label small text-info fw-bold">Telegram / Discord</label>
                                        <input name="telegram" value={formData.telegram} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" placeholder="@username" />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label small text-info fw-bold">Additional Notes / Scope</label>
                                    <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} className="form-control bg-black border-secondary text-white shadow-none" rows={3} placeholder="Specific contracts to focus on, timeline requirements..."></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending' || status === 'success' || !otpVerified}
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
                                {status === 'error' && <p className="text-danger small text-center mt-2">{errorMsg || 'Failed to send request. Please try again or email us directly.'}</p>}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAuditPage;
