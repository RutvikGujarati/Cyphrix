import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    Briefcase,
    FlaskConical,
    Mail,
    Home,
    Settings
} from 'lucide-react';
import './NavBar.css';

interface HeaderProps {
    onNavigate: (page: 'home' | 'projects' | 'contact' | 'research' | 'audit' | 'services' | 'flowofaudit' | 'partnerwithus') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const location = useLocation();

    const isActive = (page: string) => {
        if (page === 'home' && location.pathname === '/') return true;
        if (page === 'contact' && location.pathname === '/inquiry') return true;
        if (page === 'audit' && location.pathname === '/request-audit') return true;
        return location.pathname.includes(page);
    };

    const handleNav = (page: 'home' | 'projects' | 'contact' | 'research' | 'audit' | 'services' | 'flowofaudit' | 'partnerwithus') => {
        onNavigate(page);
    };

    return (
        <>
            {/* Desktop / Top Nav */}
            <nav className="nav-bar">
                <div className="container nav-inner">
                    <div className="logo" onClick={() => handleNav('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src="/Cyphrix.svg" alt="Cyphrix" style={{ height: '40px', width: 'auto' }} />
                        <span style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '0.05em' }}>CYPHRIX</span>
                    </div>
                    
                    <div className="nav-links">
                        <button className={isActive('services') ? 'active' : ''} onClick={() => handleNav('services')}>Services</button>
                        <button className={isActive('projects') ? 'active' : ''} onClick={() => handleNav('projects')}>Projects</button>
                        <button className={isActive('research') ? 'active' : ''} onClick={() => handleNav('research')}>R&D</button>
                        <button className={isActive('flowofaudit') ? 'active' : ''} onClick={() => handleNav('flowofaudit')}>Flow of Audit</button>
                        <button className={isActive('partnerwithus') ? 'active' : ''} onClick={() => handleNav('partnerwithus')}>Partner Alliance</button>
                        <button className={isActive('contact') ? 'active' : ''} onClick={() => handleNav('contact')}>Contact</button>
                    </div>

                    <div className="nav-actions">
                        <button className="nav-cta" onClick={() => handleNav('audit')}>Request Audit →</button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav - Optimized for all 7 primary sections */}
            <div className="bottom-nav">
                <button className={isActive('home') ? 'active' : ''} onClick={() => handleNav('home')}>
                    <Home size={18} />
                    <span>Home</span>
                </button>
                <button className={isActive('services') ? 'active' : ''} onClick={() => handleNav('services')}>
                    <LayoutGrid size={18} />
                    <span>Services</span>
                </button>
                <button className={isActive('projects') ? 'active' : ''} onClick={() => handleNav('projects')}>
                    <Briefcase size={18} />
                    <span>Work</span>
                </button>
                <button className={isActive('research') ? 'active' : ''} onClick={() => handleNav('research')}>
                    <FlaskConical size={18} />
                    <span>R&D</span>
                </button>
                <button className={isActive('flowofaudit') ? 'active' : ''} onClick={() => handleNav('flowofaudit')}>
                    <Settings size={18} />
                    <span>Audit</span>
                </button>
                <button className={isActive('contact') ? 'active' : ''} onClick={() => handleNav('contact')}>
                    <Mail size={18} />
                    <span>Mail</span>
                </button>
            </div>
        </>
    );
};

export default Header;