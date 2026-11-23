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

    const handleNav = (event: React.MouseEvent<HTMLAnchorElement>, page: 'home' | 'projects' | 'contact' | 'research' | 'audit' | 'services' | 'flowofaudit' | 'partnerwithus') => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onNavigate(page);
    };

    return (
        <>
            {/* Desktop / Top Nav */}
            <nav className="nav-bar">
                <div className="container nav-inner">
                    <a className="logo" href="/" onClick={(event) => handleNav(event, 'home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img src="/Cyphrix.svg" alt="Cyphrix" width="40" height="40" />
                        <span style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '0.05em' }}>CYPHRIX</span>
                    </a>
                    
                    <div className="nav-links">
                        <a className={isActive('services') ? 'active' : ''} href="/services" onClick={(event) => handleNav(event, 'services')}>Services</a>
                        <a className={isActive('projects') ? 'active' : ''} href="/projects" onClick={(event) => handleNav(event, 'projects')}>Projects</a>
                        <a className={isActive('research') ? 'active' : ''} href="/research" onClick={(event) => handleNav(event, 'research')}>R&D</a>
                        <a className={isActive('flowofaudit') ? 'active' : ''} href="/flowofaudit" onClick={(event) => handleNav(event, 'flowofaudit')}>Flow of Audit</a>
                        <a className={isActive('partnerwithus') ? 'active' : ''} href="/partnerwithus" onClick={(event) => handleNav(event, 'partnerwithus')}>Partner Alliance</a>
                        <a className={isActive('contact') ? 'active' : ''} href="/inquiry" onClick={(event) => handleNav(event, 'contact')}>Contact</a>
                    </div>

                    <div className="nav-actions">
                        <a className="nav-cta" href="/request-audit" onClick={(event) => handleNav(event, 'audit')}>Request Audit →</a>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav - Optimized for all 7 primary sections */}
            <div className="bottom-nav">
                <a className={isActive('home') ? 'active' : ''} href="/" onClick={(event) => handleNav(event, 'home')}>
                    <Home size={18} />
                    <span>Home</span>
                </a>
                <a className={isActive('services') ? 'active' : ''} href="/services" onClick={(event) => handleNav(event, 'services')}>
                    <LayoutGrid size={18} />
                    <span>Services</span>
                </a>
                <a className={isActive('projects') ? 'active' : ''} href="/projects" onClick={(event) => handleNav(event, 'projects')}>
                    <Briefcase size={18} />
                    <span>Work</span>
                </a>
                <a className={isActive('research') ? 'active' : ''} href="/research" onClick={(event) => handleNav(event, 'research')}>
                    <FlaskConical size={18} />
                    <span>R&D</span>
                </a>
                <a className={isActive('flowofaudit') ? 'active' : ''} href="/flowofaudit" onClick={(event) => handleNav(event, 'flowofaudit')}>
                    <Settings size={18} />
                    <span>Audit</span>
                </a>
                <a className={isActive('contact') ? 'active' : ''} href="/inquiry" onClick={(event) => handleNav(event, 'contact')}>
                    <Mail size={18} />
                    <span>Mail</span>
                </a>
            </div>
        </>
    );
};

export default Header;
