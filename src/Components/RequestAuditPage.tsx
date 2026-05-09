import React, { useState } from 'react';
import { Shield, Terminal, Zap, Cpu } from 'lucide-react';
import { api } from '../api/client';

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
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verifying' | 'success' | 'error'>('idle');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'contactEmail') {
            setEmailVerified(false);
            setOtpSent(false);
        }
    };

    const handleSendOtp = async () => {
        if (!emailRegex.test(formData.contactEmail)) { setErrorMsg('Enter a valid work email'); setOtpStatus('error'); setTimeout(() => setOtpStatus('idle'), 4000); return; }
        setOtpStatus('sending');
        setErrorMsg('');
        try {
            await api.sendOtp(formData.contactEmail);
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
            await api.verifyOtp(formData.contactEmail, otp);
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
                type: 'audit',
                subject: `Audit Request: ${formData.auditType} — ${formData.projectName}`,
                name: formData.projectName,
                email: formData.contactEmail,
                audit: { auditType: formData.auditType, telegram: formData.telegram, details: {}, notes: formData.additionalNotes },
            });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error: unknown) {
            setErrorMsg(error instanceof Error ? error.message : 'Error sending request');
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
        <div className="audit-request-page">
            <header className="page-hero">
                <div className="container">
                    <span className="section-label">Technical Intake</span>
                    <h1>Request <span className="text-gradient">Protocol Audit</span></h1>
                    <p style={{ maxWidth: '700px', margin: '24px auto', fontSize: '18px', color: 'var(--text-muted)' }}>
                        Initialize your security pipeline with Cyphrix. Provide technical parameters for a comprehensive audit scope.
                    </p>
                </div>
            </header>

            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div className="services-grid">
                        {/* Sidebar Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="service-card" style={{ minHeight: 'auto' }}>
                                <div className="s-icon"><Shield size={28} /></div>
                                <h3>Methodology</h3>
                                <p>Multi-phased security pipeline combining manual invariant analysis with adversarial fuzzing.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Zap size={18} color="var(--accent-mint)" />
                                        <span style={{ fontSize: '14px', fontWeight: '700' }}>24h Response Window</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Cpu size={18} color="var(--accent-blue)" />
                                        <span style={{ fontSize: '14px', fontWeight: '700' }}>Full Remediation Support</span>
                                    </div>
                                </div>
                            </div>
                            <div className="service-card" style={{ minHeight: 'auto' }}>
                                <div className="s-icon"><Terminal size={28} /></div>
                                <h3>Confidentiality</h3>
                                <p>Technical data is processed through secure channels with zero-disclosure scoping protocols.</p>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="service-card" style={{ padding: '56px' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                                    <div>
                                        <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Project Name</label>
                                        <input style={inputStyle} name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Protocol Name" required />
                                    </div>
                                    <div>
                                        <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Audit Type</label>
                                        <select style={inputStyle} name="auditType" value={formData.auditType} onChange={handleChange}>
                                            <option>Smart Contract Audit</option>
                                            <option>Infrastructure Review</option>
                                            <option>Formal Verification</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Auth Email</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input style={inputStyle} type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="security@project.io" required readOnly={emailVerified} />
                                        {!emailVerified ? (
                                            <button type="button" className="tag" onClick={handleSendOtp} disabled={otpStatus === 'sending'} style={{ cursor: 'pointer', padding: '0 24px' }}>
                                                {otpStatus === 'sending' ? '...' : 'OTP'}
                                            </button>
                                        ) : (
                                            <div className="tag" style={{ color: 'var(--accent-mint)', borderColor: 'var(--accent-mint)' }}>VERIFIED ✓</div>
                                        )}
                                    </div>
                                </div>

                                {/* ONLY SHOW AFTER OTP SENT */}
                                {otpSent && !emailVerified && (
                                    <div style={{ marginBottom: '32px' }}>
                                        <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px', color: 'var(--accent-mint)' }}>Verification Code</label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <input style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.4em' }} type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" />
                                            <button type="button" className="btn-primary" style={{ padding: '0 24px' }} onClick={handleVerifyOtp} disabled={otpStatus === 'verifying' || otp.length !== 6}>VERIFY</button>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                                    <div>
                                        <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Primary Chain</label>
                                        <select style={inputStyle} name="blockchain" value={formData.blockchain} onChange={handleChange}>
                                            <option>Ethereum</option>
                                            <option>Solana</option>
                                            <option>Base / L2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Telegram ID</label>
                                        <input style={inputStyle} name="telegram" value={formData.telegram} onChange={handleChange} placeholder="@identifier" />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '48px' }}>
                                    <label className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>Additional Details</label>
                                    <textarea style={{ ...inputStyle, minHeight: '140px', borderRadius: '24px' }} name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} placeholder="Provide repository links or technical architecture overview..."></textarea>
                                </div>

                                <button type="submit" disabled={status === 'sending' || status === 'success' || !emailVerified} style={{ width: '100%' }} className="btn-primary">
                                    {status === 'sending' ? 'TRANSMITTING...' : status === 'success' ? 'TRANSMITTED ✓' : 'SUBMIT SCOPE'}
                                </button>
                                {(otpStatus === 'error' || status === 'error') && <p style={{ color: 'var(--accent-gold)', textAlign: 'center', marginTop: '24px', fontSize: '14px', fontWeight: '700' }}>{errorMsg}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RequestAuditPage;
