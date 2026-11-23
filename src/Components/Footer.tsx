import React from 'react';
import { Github, Instagram, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
    { label: 'Email Cyphrix', href: 'mailto:cyphrixsupport@cyphrixtech.com', Icon: Mail },
    { label: 'Cyphrix website source on GitHub', href: 'https://github.com/RutvikGujarati/Cyphrix', Icon: Github },
    { label: 'Cyphrix on LinkedIn', href: 'https://www.linkedin.com/company/cyphrixtechnologies/', Icon: Linkedin },
    { label: 'Cyphrix on Instagram', href: 'https://www.instagram.com/cyphrixtechnologies/', Icon: Instagram },
];

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
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/Cyphrix.svg" alt="" width="32" height="32" />
                        <span style={{ fontWeight: '900', letterSpacing: '0.1em', fontSize: '18px' }}>CYPHRIX</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        © {new Date().getFullYear()} CYPHRIX TECHNOLOGIES — ALL RIGHTS RESERVED
                    </span>
                </div>
                
                <div className="footer-socials" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {footerLinks.map(({ label, href, Icon }) => (
                        <a
                            key={href}
                            href={href}
                            target={href.startsWith('https:') ? '_blank' : undefined}
                            rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                            aria-label={label}
                            style={{ display: 'grid', placeItems: 'center', width: '44px', height: '44px', color: 'var(--accent-blue)' }}
                        >
                            <Icon size={20} aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
