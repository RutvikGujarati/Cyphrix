import React from 'react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer" style={{ marginTop: '100px', borderTop: '1px solid var(--border)', padding: '40px 0' }}>
            <div className="container footer-inner" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '20px' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/Cyphrix.svg" alt="Cyphrix" style={{ height: '32px', width: 'auto' }} />
                        <span style={{ fontWeight: '900', letterSpacing: '0.1em', fontSize: '18px' }}>CYPHRIX</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        © {new Date().getFullYear()} CYPHRIX TECHNOLOGIES — ALL RIGHTS RESERVED
                    </span>
                </div>
                
                <div className="footer-socials" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <a href="#" style={{ color: 'var(--accent-blue)', transition: '0.3s' }}><Twitter size={20} /></a>
                    <a href="#" style={{ color: 'var(--accent-blue)', transition: '0.3s' }}><Github size={20} /></a>
                    <a href="https://www.linkedin.com/company/cyphrixtechnologies/about/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', transition: '0.3s' }}><Linkedin size={20} /></a>
                    <a href="https://www.instagram.com/cyphrixtechnologies?igsh=MXZoOTA1eWZlOXpoeg==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', transition: '0.3s' }}><Instagram size={20} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
