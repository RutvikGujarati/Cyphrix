import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExternalLink } from 'lucide-react';
import { OTP_API_BASE_URL } from '../config/api';

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
    const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpValue, setOtpValue] = useState('');
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
        if (verifiedEmail && formData.email !== verifiedEmail) {
            setOtpSent(false);
            setOtpVerified(false);
            setOtpValue('');
            setVerifiedEmail('');
        }
    }, [formData.email, verifiedEmail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!emailRegex.test(formData.email)) { setOtpError('Enter a valid email first'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 3000); return; }
        setOtpStatus('sending');
        setOtpError('');
        try {
            const res = await fetch(`${OTP_API_BASE_URL}/api/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const text = await res.text();
            let result: any;
            try { result = JSON.parse(text); } catch { throw new Error('Server returned an unexpected response. Please try again.'); }
            if (!res.ok) throw new Error(result.detail || result.error || 'Failed');
            setOtpSent(true);
            setOtpStatus('sent');
            setCooldown(60);
        } catch (err: any) {
            setOtpError(err.message || 'Failed to send OTP');
            setOtpStatus('error');
            setTimeout(() => setOtpStatus('idle'), 5000);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpValue.length !== 6) return;
        setOtpStatus('sending');
        setOtpError('');
        try {
            const res = await fetch(`${OTP_API_BASE_URL}/api/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: otpValue }),
            });
            const text = await res.text();
            let result: any;
            try { result = JSON.parse(text); } catch { throw new Error('Server returned an unexpected response. Please try again.'); }
            if (!res.ok) throw new Error(result.detail || result.error || 'OTP verification failed');
            setOtpVerified(true);
            setVerifiedEmail(formData.email);
            setOtpStatus('sent');
        } catch (err: any) {
            setOtpError(err.message || 'Failed to verify OTP');
            setOtpStatus('error');
            setTimeout(() => setOtpStatus('idle'), 5000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) { setErrorMsg('Name is required'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!emailRegex.test(formData.email)) { setErrorMsg('Please enter a valid email address'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!otpVerified) { setErrorMsg('Please verify your email first'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!formData.message.trim()) { setErrorMsg('Message is required'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }

        setStatus('sending');
        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    subject: `Contact: ${formData.name}${formData.company ? ` (${formData.company})` : ''}`,
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    message: formData.message,
                }),
            });
            const text = await res.text();
            let result: any;
            try { result = JSON.parse(text); } catch { throw new Error('Server returned an unexpected response. Please try again.'); }
            if (!res.ok) throw new Error(result.detail || result.error || 'Send failed');
            setStatus('success');
            setFormData({ name: '', company: '', email: '', message: '' });
            setOtpSent(false); setOtpVerified(false); setOtpValue(''); setVerifiedEmail('');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error: any) {
            console.error('Email Error:', error);
            setErrorMsg(error.message || 'Unknown error');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 8000);
        }
    };

    return (
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <label className="form-label small text-white-50">Name <span className="text-danger">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none" placeholder="John Doe" required />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label small text-white-50">Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none" placeholder="Acme Corp" />
                </div>
            </div>
            <div>
                <label className="form-label small text-white-50">Email <span className="text-danger">*</span></label>
                <div className="d-flex gap-2">
                    <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className={`form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none ${otpVerified ? 'border-success' : ''}`}
                        placeholder="john@acme.com" required disabled={otpVerified}
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
                    <label className="form-label small text-white-50">Enter 6-digit verification code</label>
                    <div className="d-flex gap-2">
                        <input
                            type="text" maxLength={6} value={otpValue}
                            onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none text-center fw-bold"
                            style={{ letterSpacing: '6px', maxWidth: '200px', fontFamily: 'monospace' }}
                            placeholder="------"
                        />
                        <button type="button" onClick={handleVerifyOtp} disabled={otpValue.length !== 6}
                            className="btn btn-info btn-sm text-dark rounded-pill px-3 fw-bold">
                            Confirm
                        </button>
                    </div>
                    <small className="text-white-50 mt-1 d-block">Check your inbox for the code. Expires in 5 minutes.</small>
                </div>
            )}
            <div>
                <label className="form-label small text-white-50">Message <span className="text-danger">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none" rows={4} placeholder="How can we help you?" required></textarea>
            </div>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mt-2">
                <button type="submit" disabled={status === 'sending' || status === 'success' || !otpVerified}
                    className={`btn ${status === 'success' ? 'btn-success' : 'btn-info text-dark'} fw-bold py-2 px-4 rounded-pill transition-all w-100 w-sm-auto`}>
                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {status === 'error' && <span className="text-danger small text-center text-sm-start">{errorMsg || 'Transmission Failed.'}</span>}
            </div>
        </form>
    );
}

export default function ContactPage() {
    return (
        <div className="min-vh-100 w-100 position-relative bg-black text-white py-5 overflow-hidden">
            <ContactVisual />
            <div className="container position-relative z-1 py-5">
                <div className="row align-items-center g-5 mb-5">
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

                <section className="border-top border-white border-opacity-10 pt-5 mt-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h3 className="display-6 fw-bold mb-4 text-uppercase tracking-widest">
                                <span className="text-white">The</span> <span className="text-info">Team</span>
                            </h3>
                            <p className="text-white-50 mb-5">Architects of the decentralized future.</p>
                            <div className="row justify-content-center g-3">
                                <div className="col-md-4">
                                    <div className="p-3 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-25 h-100 d-flex flex-column align-items-center hover-lift transition-all">
                                        <div className="mb-3 position-relative">
                                            <div className="rounded-circle overflow-hidden p-1" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
                                                <img src="https://api.dicebear.com/9.x/identicon/svg?seed=Felix" alt="Rutvik Gujarati" className="w-100 h-100 rounded-circle bg-black" />
                                            </div>
                                            <div className="position-absolute bottom-0 end-0 bg-success border border-black rounded-circle p-1" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                        <h6 className="fw-bold mb-1">Rutvik Gujarati</h6>
                                        <a target="_blank" rel="noopener noreferrer" href="https://www.upwork.com/freelancers/~0119617106c07ee432?viewMode=1" className="btn btn-sm btn-outline-light rounded-pill px-3 mt-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                            <span>Upwork</span> <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-25 h-100 d-flex flex-column align-items-center hover-lift transition-all">
                                        <div className="mb-3 position-relative">
                                            <div className="rounded-circle overflow-hidden p-1" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #a855f7, #db2777)' }}>
                                                <img src="https://api.dicebear.com/9.x/identicon/svg?seed=Luna" alt="Vishal Baraiya" className="w-100 h-100 rounded-circle bg-black" />
                                            </div>
                                            <div className="position-absolute bottom-0 end-0 bg-success border border-black rounded-circle p-1" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                        <h6 className="fw-bold mb-1">Vishal Baraiya</h6>
                                        <a target="_blank" rel="noopener noreferrer" href="https://www.upwork.com/freelancers/vishalb43?mp_source=share" className="btn btn-sm btn-outline-light rounded-pill px-3 mt-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                            <span>Upwork</span> <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-25 h-100 d-flex flex-column align-items-center hover-lift transition-all">
                                        <div className="mb-3 position-relative">
                                            <div className="rounded-circle overflow-hidden p-1" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                                                <img src="https://api.dicebear.com/9.x/identicon/svg?seed=Aneka" alt="Kinal Makavana" className="w-100 h-100 rounded-circle bg-black" />
                                            </div>
                                            <div className="position-absolute bottom-0 end-0 bg-success border border-black rounded-circle p-1" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                        <h6 className="fw-bold mb-1">Kinal Makavana</h6>
                                        <a target="_blank" rel="noopener noreferrer" href="https://www.upwork.com/freelancers/~01aab1fed28d527e46?mp_source=share" className="btn btn-sm btn-outline-light rounded-pill px-3 mt-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                            <span>Upwork</span> <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}