import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

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
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verifying' | 'success' | 'error'>('idle');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'email') setEmailVerified(false);
    };

    const handleSendOtp = async () => {
        if (!emailRegex.test(formData.email)) { setErrorMsg('Please enter a valid email first'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 4000); return; }
        setOtpStatus('sending');
        setErrorMsg('');
        try {
            await api.sendOtp(formData.email);
            setOtpStatus('idle');
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'Failed to send code');
            setOtpStatus('error');
            setTimeout(() => setOtpStatus('idle'), 6000);
        }
    };

    const handleVerifyOtp = async () => {
        if (!/^\d{6}$/.test(otp)) { setErrorMsg('Enter a 6-digit code'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 3000); return; }
        setOtpStatus('verifying');
        setErrorMsg('');
        try {
            await api.verifyOtp(formData.email, otp);
            setEmailVerified(true);
            setOtpStatus('success');
            setOtp('');
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'Invalid code');
            setOtpStatus('error');
            setTimeout(() => setOtpStatus('idle'), 4000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailVerified) { setErrorMsg('Please verify your email first'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!formData.name.trim()) { setErrorMsg('Name is required'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!emailRegex.test(formData.email)) { setErrorMsg('Please enter a valid email address'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        if (!formData.message.trim()) { setErrorMsg('Message is required'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }

        setStatus('sending');
        setErrorMsg('');
        try {
            await api.sendEmail({
                type: 'contact',
                subject: `Contact: ${formData.name}${formData.company ? ` (${formData.company})` : ''}`,
                name: formData.name,
                email: formData.email,
                company: formData.company,
                message: formData.message,
            });
            setStatus('success');
            setFormData({ name: '', company: '', email: '', message: '' });
            setEmailVerified(false);
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error: unknown) {
            console.error('Email Error:', error);
            setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
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
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none" style={{ flex: '1 1 180px' }}
                        placeholder="john@acme.com" required readOnly={emailVerified}
                    />
                    {!emailVerified ? (
                        <>
                            <button type="button" onClick={handleSendOtp} disabled={otpStatus === 'sending'} className="btn btn-outline-info py-2 px-3 rounded-2 text-nowrap">
                                {otpStatus === 'sending' ? 'Sending...' : 'Send OTP'}
                            </button>
                            <input
                                type="text" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none text-center" style={{ width: '90px' }}
                                placeholder="000000"
                            />
                            <button type="button" onClick={handleVerifyOtp} disabled={otpStatus === 'verifying' || otp.length !== 6} className="btn btn-info text-dark fw-bold py-2 px-3 rounded-2 text-nowrap d-inline-flex align-items-center gap-1">
                                {otpStatus === 'verifying' ? 'Verifying...' : <>Verify <ShieldCheck size={14} /></>}
                            </button>
                        </>
                    ) : (
                        <span className="badge bg-success py-2 px-3 d-inline-flex align-items-center gap-1">Verified <ShieldCheck size={14} /></span>
                    )}
                </div>
                {(otpStatus === 'error' || status === 'error') && <span className="text-danger small mt-1 d-block">{errorMsg}</span>}
            </div>
            <div>
                <label className="form-label small text-white-50">Message <span className="text-danger">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="form-control bg-dark border-secondary text-white rounded-2 py-2 shadow-none" rows={4} placeholder="How can we help you?" required></textarea>
            </div>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mt-2">
                <button type="submit" disabled={status === 'sending' || status === 'success' || !emailVerified}
                    className={`btn ${status === 'success' ? 'btn-success' : 'btn-info text-dark'} fw-bold py-2 px-4 rounded-pill transition-all w-100 w-sm-auto`}>
                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {!emailVerified && <span className="text-white-50 small">Verify your email to send.</span>}
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