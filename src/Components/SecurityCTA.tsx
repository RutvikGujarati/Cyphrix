import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const SecurityCTA: React.FC = () => {
    return (
        <section className="cta-section" style={{ textAlign: 'center', padding: '120px 0' }}>
            <div className="container">
                <motion.div
                    
                    whileInView={{ opacity: 1, y: 0 }}
                    
                    transition={{ duration: 0.8 }}
                >
                    <span className="section-label" style={{ 
                        background: 'rgba(255, 122, 0, 0.1)', 
                        color: 'var(--accent-gold)',
                        border: '1px solid rgba(255, 122, 0, 0.2)',
                        padding: '6px 16px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '900',
                        letterSpacing: '0.2em',
                        marginBottom: '32px',
                        display: 'inline-block'
                    }}>
                        INFRASTRUCTURE PROTECTION FRAMEWORK
                    </span>
                    
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.03em' }}>
                        Security & Cloud Assurance
                    </h2>
                    
                    <p style={{ maxWidth: '700px', margin: '0 auto 48px', color: 'var(--text-muted)', fontSize: '20px', lineHeight: '1.6' }}>
                        End-to-end security spanning web applications, infrastructure VAPT, and cloud assurance.
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <a 
                            href="https://gold-favourable-bonobo-219.mypinata.cloud/ipfs/bafkreidiir2cnaauu2syqs3ewlitagocvaj3xgkj3xwirwtsgjd5i5hpzq" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="nav-cta"
                            style={{ 
                                padding: '18px 48px', 
                                fontSize: '15px', 
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            VIEW BROCHURE <ExternalLink size={18} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SecurityCTA;
