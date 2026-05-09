import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Binary, Link, Cpu, Lock,  Hexagon, 
    Globe,  Zap as ZapIcon, ChevronRight
} from 'lucide-react';
import researchData from '../Data/research.json';
import SecurityCTA from './SecurityCTA';

const iconList = [Shield, Binary, Link, Cpu, Hexagon];

const ResearchPage: React.FC = () => {
    const revealVariant = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <div className="research-page">
            <header className="page-hero">
                <motion.div 
                    className="container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="section-label" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '40px' }}>RESEARCH LAB</span>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 84px)', fontWeight: '800' }}>RESEARCH <span className="text-gradient">& DEVELOPMENT</span></h1>
                    <p style={{ maxWidth: '800px', margin: '24px auto', fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Driving innovation through advanced security research. We continuously study emerging technologies, threat models, and practical defense strategies to keep digital infrastructure safer.
                    </p>
                </motion.div>
            </header>

            <section style={{ padding: '40px 0' }}>
                <div className="container">
                    <motion.div 
                        style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}
                        
                        
                        
                        animate="visible" variants={revealVariant}
                    >
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                            <div style={{ color: 'var(--accent-blue)', background: 'rgba(0, 212, 255, 0.05)', padding: '12px', borderRadius: '12px' }}><Globe size={32} /></div>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Our vision</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', maxWidth: '900px' }}>
                                    Our long-term vision is to strengthen blockchain and digital security standards through continuous research, tool-building, responsible vulnerability discovery, and protocol hardening. We do not only audit systems - we study how they fail and how to make them resilient by design.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* RWA CASE STUDY HEADER */}
            <section style={{ padding: '100px 0 40px', textAlign: 'center' }}>
                <div className="container">
                    <motion.div    animate="visible" variants={revealVariant}>
                        <h2 style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '16px' }}>RWA <span style={{ color: 'var(--accent-gold)' }}>CASE STUDY</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '48px' }}>Institutional Proof of Concept (POC) architecture for Real World Assets</p>
                    </motion.div>
                </div> 
            </section>

            {/* 1. CORE DEFINITIONS */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                        <div style={{ width: '40px', height: '1px', background: 'var(--accent-mint)' }}></div>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>1. Core Definitions</h3>
                    </div>
                    <div className="services-grid">
                        {[
                            { icon: <Globe size={24} />, title: 'Digital Twin', text: 'A blockchain-based representation of a physical copper batch, containing an immutable record of its origin, weight, and grade.' },
                            { icon: <Shield size={24} />, title: 'ESG Hash', text: 'A SHA-256 cryptographic fingerprint of off-chain environmental and social data stored on-chain to prevent data tampering.' },
                            { icon: <ZapIcon size={24} />, title: 'State Machine', text: 'A logic flow within the smart contract that restricts copper batches to a specific sequence of statuses (e.g., MINED → IN_TRANSIT).' },
                            { icon: <Lock size={24} />, title: 'Permissioned Node', text: 'A network participant that requires explicit authorization to join, ensuring the data remains within the enterprise consortium.' }
                        ].map((item, i) => (
                            <motion.div key={i} animate="visible" variants={revealVariant}    style={{ padding: '32px', borderLeft: '1px solid var(--border)' }}>
                                <div style={{ color: 'var(--accent-mint)', marginBottom: '24px' }}>{item.icon}</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. POC COMPONENTS & GOVERNANCE (RENUMBERED) */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                        <div style={{ width: '40px', height: '1px', background: 'var(--accent-mint)' }}></div>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>2. POC Components & Governance</h3>
                    </div>
                    
                    <div className="row g-4">
                        {/* PHASE 01 */}
                        <div className="col-md-4">
                            <div style={{ padding: '32px', borderLeft: '2px solid var(--border)', background: 'transparent' }}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-blue)', marginBottom: '12px', textTransform: 'uppercase' }}>PHASE 01</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#fff' }}>ESG DATA COLLECTION</h4>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronRight size={14} className="text-gradient" /> Mining Application</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>Capturing raw metadata: Energy (kWh), Carbon (CO2e), and Waste Output via IoT.</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronRight size={14} className="text-gradient" /> Data Validator</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>Off-chain validation layer ensuring data integrity before blockchain entry.</div>
                                </div>
                            </div>
                        </div>

                        {/* PHASE 02 */}
                        <div className="col-md-4">
                            <div style={{ padding: '32px', borderLeft: '2px solid var(--accent-mint)', background: 'rgba(0, 255, 204, 0.02)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-mint)', marginBottom: '12px', textTransform: 'uppercase' }}>PHASE 02</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#a855f7', marginBottom: '24px' }}>ON-CHAIN TOKENIZATION</h4>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronRight size={14} className="text-gradient" /> Smart Contract Logic</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>Executing ESG-to-Asset mapping and Batch ID generation via Solidity.</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronRight size={14} className="text-gradient" /> Proof Hub</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>Generating immutable cryptographic hashes for ESG documentation and URI links.</div>
                                </div>
                            </div>
                        </div>

                        {/* PHASE 03 */}
                        <div className="col-md-4">
                            <div style={{ padding: '32px', borderLeft: '2px solid var(--border)', background: 'transparent' }}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-blue)', marginBottom: '12px', textTransform: 'uppercase' }}>PHASE 03</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#fff' }}>AUDITOR INTERFACE</h4>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronRight size={14} className="text-gradient" /> Real-Time Visualization</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>Institutional dashboard displaying live provenance and historical ESG performance.</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronRight size={14} className="text-gradient" /> Governance Portal</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>Voting interface for compliance standards and role-based participant management.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SECURITY & VERIFICATION (RENUMBERED) */}
            <section style={{ padding: '60px 0 100px' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                        <div style={{ width: '40px', height: '1px', background: 'var(--accent-mint)' }}></div>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>3. Security & Verification</h3>
                    </div>
                    <div className="row g-5">
                        {[
                            { title: 'Digital Signatures', text: 'Every state change requires an EIP-712 signature from the custodian\'s private key.', color: 'var(--accent-blue)' },
                            { title: 'Audit Trail', text: 'Blockchain provide a time-stamped history of every AssetStatus change, unalterable and transparent.', color: 'var(--accent-mint)' },
                            { title: 'Off-chain Storage', text: 'Sensitive documents are stored in encrypted S3 buckets, with only the hash and URI on ledger.', color: 'var(--accent-blue)' }
                        ].map((item, i) => (
                            <div className="col-md-4" key={i}>
                                <motion.div style={{ padding: '24px 0' }} animate="visible" variants={revealVariant}   >
                                    <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: item.color }}>{item.title}</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' }}>{item.text}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* R&D FOCUS AREAS */}
            <section style={{ padding: '100px 0', borderTop: '1px solid var(--border)' }}>
                <div className="container">
                    <motion.div 
                        style={{ textAlign: 'center', marginBottom: '80px' }}
                        
                        
                        
                        animate="visible" variants={revealVariant}
                    >
                        <span className="section-label" style={{ color: 'var(--accent-blue)', background: 'rgba(0, 212, 255, 0.1)' }}>Capabilities</span>
                        <h2 style={{ fontSize: '42px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                            <Link size={32} className="text-gradient" /> R&D focus areas
                        </h2>
                    </motion.div>

                    <div className="services-grid">
                        {researchData.map((item, index) => {
                            const Icon = iconList[index % iconList.length];
                            return (
                                <motion.div className="service-card" key={item.id} animate="visible" variants={revealVariant}   >
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="s-icon">
                                            <Icon size={28} />
                                        </div>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-mint)', background: 'rgba(0, 255, 204, 0.1)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>{item.status}</span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{item.category}</p>
                                    <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', color: 'var(--text-muted)' }}>{item.description}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                                        {item.tags.map((tag) => (
                                            <span key={tag} className="tag" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.03)' }}>#{tag}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <SecurityCTA />
        </div>
    );
};

export default ResearchPage;
