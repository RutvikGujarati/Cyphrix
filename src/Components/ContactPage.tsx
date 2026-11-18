import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  Mail, ShieldCheck, Zap, Linkedin,  ExternalLink } from 'lucide-react';
import { api } from '../api/client';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verifying' | 'success' | 'error'>('idle');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'email') {
            setEmailVerified(false);
            setOtpSent(false);
        }
    };

    const handleSendOtp = async () => {
        if (!emailRegex.test(formData.email)) { setErrorMsg('Enter a valid email'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 4000); return; }
        setOtpStatus('sending');
        setErrorMsg('');
        try {
            await api.sendOtp(formData.email);
            setOtpStatus('idle');
            setOtpSent(true);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'Failed to send code');
            setOtpStatus('error');
            setTimeout(() => setOtpStatus('idle'), 6000);
        }
    };

    const handleVerifyOtp = async () => {
        if (!/^\d{6}$/.test(otp)) { setErrorMsg('Enter 6-digit code'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 3000); return; }
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
        if (!emailVerified) { setErrorMsg('Verify email first'); setStatus('error'); setTimeout(() => setStatus('idle'), 4000); return; }
        setStatus('sending');
        setErrorMsg('');
        try {
            await api.sendEmail({
                type: 'contact',
                subject: `Contact: ${formData.name}`,
                name: formData.name,
                email: formData.email,
                company: formData.company,
                message: formData.message,
            });
            setStatus('success');
            setFormData({ name: '', company: '', email: '', message: '' });
            setEmailVerified(false);
            setOtpSent(false);
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error: unknown) {
            setErrorMsg(error instanceof Error ? error.message : 'Error');
            setStatus('error');
        }
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border)',
        padding: '16px',
        borderRadius: '16px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        transition: '0.3s'
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div>
                    <label className="section-label" style={{ fontSize: '10px', marginBottom: '12px' }}>Full Name</label>
                    <input style={inputStyle} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div>
                    <label className="section-label" style={{ fontSize: '10px', marginBottom: '12px' }}>Company</label>
                    <input style={inputStyle} type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" />
                </div>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
                <label className="section-label" style={{ fontSize: '10px', marginBottom: '12px' }}>Work Email</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@acme.com" required readOnly={emailVerified} />
                    {!emailVerified ? (
                        <button type="button" className="tag" onClick={handleSendOtp} disabled={otpStatus === 'sending'} style={{ cursor: 'pointer', padding: '0 24px' }}>
                            {otpStatus === 'sending' ? '...' : 'OTP'}
                        </button>
                    ) : (
                        <div className="tag" style={{ color: 'var(--accent-mint)', borderColor: 'var(--accent-mint)' }}>VERIFIED ✓</div>
                    )}
                </div>
            </div>

            {otpSent && !emailVerified && (
                <div style={{ marginBottom: '32px' }}>
                    <label className="section-label" style={{ fontSize: '10px', marginBottom: '12px', color: 'var(--accent-mint)' }}>OTP Code</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.4em' }} type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" />
                        <button type="button" className="btn-primary" style={{ padding: '0 24px' }} onClick={handleVerifyOtp} disabled={otpStatus === 'verifying' || otp.length !== 6}>VERIFY</button>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '40px' }}>
                <label className="section-label" style={{ fontSize: '10px', marginBottom: '12px' }}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: '120px', borderRadius: '24px' }} name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Briefly describe your inquiry..." required></textarea>
            </div>

            {errorMsg && (
                <div style={{ 
                    padding: '12px 20px', 
                    background: 'rgba(255, 50, 50, 0.1)', 
                    border: '1px solid rgba(255, 50, 50, 0.2)', 
                    borderRadius: '12px', 
                    color: '#ff6b6b', 
                    fontSize: '13px', 
                    marginBottom: '24px',
                    fontWeight: '600'
                }}>
                    Error: {errorMsg}
                </div>
            )}

            <button type="submit" disabled={status === 'sending' || status === 'success' || !emailVerified} style={{ width: '100%' }} className="btn-primary">
                {status === 'sending' ? 'TRANSMITTING...' : status === 'success' ? 'TRANSMITTED ✓' : 'Submit'}
            </button>
        </form>
    );
}

const ContactPage = () => {
    const revealVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="contact-page">
            <header className="page-hero">
                <motion.div 
                    className="container"
                    animate="visible" 
                    variants={revealVariant}
                >
                    <span className="section-label">Technical Intake</span>
                    <h1>Initialize <span className="text-gradient">Secure Contact</span></h1>
                    <p style={{ maxWidth: '700px', margin: '24px auto', fontSize: '18px', color: 'var(--text-muted)' }}>
                        Our engineering team is available for high-criticality smart contract audits and infrastructure architecture review.
                    </p>
                </motion.div>
            </header>

            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div className="services-grid">
                        <motion.div className="service-card" animate="visible" variants={revealVariant}>
                            <div className="s-icon"><Mail size={28} /></div>
                            <h3>Inquiry Process</h3>
                            <p>All inquiries are handled through a secure verification channel. We prioritize protocols with upcoming mainnet deployments.</p>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <ShieldCheck size={20} color="var(--accent-mint)" />
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '800' }}>Confidential Scope</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Zero-disclosure scoping calls.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <Zap size={20} color="var(--accent-blue)" />
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '800' }}>Rapid Response</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Technical review within 24h.</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className="service-card" style={{ padding: '56px' }} animate="visible" variants={revealVariant}>
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* REDESIGNED TECHNICAL LEADERSHIP SECTION V2 */}
            <section style={{ padding: '120px 0', borderTop: '1px solid var(--border)', background: 'linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.02))' }}>
                <div className="container">
                    <motion.div 
                        style={{ textAlign: 'center', marginBottom: '80px' }}
                        animate="visible" 
                        variants={revealVariant}
                    >
                        <span className="section-label" style={{ color: 'var(--accent-mint)', background: 'rgba(0, 255, 204, 0.1)' }}>Elite Core</span>
                        <h2 style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '-0.02em' }}>Technical <span style={{ color: 'var(--accent-gold)' }}>Leadership</span></h2>
                    </motion.div>
                    
                    <div className="row g-5 justify-content-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {[
                            { 
                                name: 'Rutvik Gujarati', 
                                seed: 'Felix', 
                                role: 'Lead Smart Contract Developer',
                                linkedin: 'https://www.linkedin.com/in/rutvik-gujarati/',
                                upwork: 'https://www.upwork.com/freelancers/~01344498305b18074d',
                                specialty: 'Security-first architecture, Gas optimization, Multi-chain bridging.',
                                accent: 'var(--accent-mint)'
                            },
                            { 
                                name: 'Vishal Baraiya', 
                                seed: 'Luna', 
                                role: 'Senior Smart Contract Auditor',
                                linkedin: 'https://www.linkedin.com/in/vishal-baraiya-05989a151/',
                                upwork: 'https://www.upwork.com/freelancers/~01584c56637012678c',
                                specialty: 'Formal verification, Invariant testing, DeFi logic vulnerability research.',
                                accent: 'var(--accent-blue)'
                            },
                            {
                                name: 'Shristi Vyas',
                                seed: 'Shristi Vyas',
                                linkedin: 'https://www.linkedin.com/in/shristi-vyas-b8535b196/',
                                accent: 'var(--accent-mint)'
                            }
                        ].map((member) => (
                            <div className="col-md-6 col-lg-4 d-flex" key={member.name}>
                                <motion.div 
                                    className="service-card" 
                                    style={{ 
                                        padding: '0', 
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden', 
                                        background: 'rgba(13, 17, 23, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '32px',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}
                                    animate="visible" 
                                    variants={revealVariant}
                                    whileHover={{ y: -10, borderColor: member.accent }}
                                >
                                    {/* CARD HEADER */}
                                    <div style={{ position: 'relative', height: '140px', background: `linear-gradient(135deg, ${member.accent}11, transparent)` }}>
                                        <div style={{ position: 'absolute', bottom: '-40px', left: '40px' }}>
                                            <div style={{ 
                                                width: '100px', height: '100px', borderRadius: '28px', 
                                                background: 'var(--bg)', border: `2px solid ${member.accent}33`,
                                                padding: '6px', boxShadow: `0 10px 30px -10px ${member.accent}66`
                                            }}>
                                                <img src={`https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(member.seed)}`} alt="" style={{ width: '100%', height: '100%' }} />
                                            </div>
                                        </div>
                                      
                                    </div>

                                    {/* CARD CONTENT */}
                                    <div style={{ padding: '60px clamp(20px, 3vw, 40px) 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.01em' }}>{member.name}</h3>
                                        {member.role && <div style={{ fontSize: '12px', color: member.accent, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>{member.role}</div>}
                                        {member.specialty && <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' }}>{member.specialty}</p>}
                                        <div className="profile-links">
                                            <a className="btn-ghost" href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`}>
                                                <Linkedin size={14} aria-hidden="true" /> LinkedIn
                                            </a>
                                            {member.upwork && (
                                                <a className="btn-ghost" href={member.upwork} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Upwork`}>
                                                    <ExternalLink size={14} aria-hidden="true" /> Upwork
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContactPage;
