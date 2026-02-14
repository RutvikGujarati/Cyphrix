import React, { useState } from 'react';
import logo from "/Cyphrix.svg";
import './NavBar.css';

interface HeaderProps {
    onNavigate: (page: 'home' | 'projects' | 'contact' | 'research' | 'audit') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNav = (page: 'home' | 'projects' | 'contact' | 'research' | 'audit') => {
        onNavigate(page);
        setIsOpen(false);
    };

    return (
        <header className="fixed-top py-2 py-md-4 shadow-none">
            <div className="container px-2 px-sm-3">
                <nav className="navbar navbar-expand-lg navbar-dark p-0 border-0 bg-transparent shadow-none">
                    <div className={`container-fluid p-2 px-3 transition-all duration-300 ${isOpen ? 'rounded-4' : 'rounded-pill'} border border-info border-opacity-25 bg-black bg-opacity-75 shadow-lg`}
                        style={{ backdropFilter: 'blur(20px)' }}>

                        {/* Logo */}
                        <a className="navbar-brand d-flex align-items-center m-0 p-0" href="#" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>
                            <div className="position-relative nav-logo-wrap">
                                <img src={logo} alt="Cyphrix" className="img-fluid" />
                            </div>
                            <div className="ms-2 d-none d-sm-block">
                                <span className="fw-bold text-white lh-1 h5 mb-0 d-block tracking-tight">CYPHRIX</span>
                                <small className="text-info font-monospace opacity-75 nav-tagline">TRUST. ENCRYPTED.</small>
                            </div>
                        </a>

                        {/* Toggler */}
                        <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setIsOpen(!isOpen)}>
                            <span className="navbar-toggler-icon" />
                        </button>

                        {/* Menu */}
                        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
                            <div className="nav-menu-inner d-flex flex-column flex-lg-row align-items-center w-100 py-3 py-lg-0">
                                <div className="d-flex flex-column flex-lg-row align-items-center justify-content-lg-center gap-2 gap-lg-4 flex-grow-1">
                                    <button onClick={() => handleNav('projects')} className="nav-link-btn">Projects</button>
                                    <button onClick={() => handleNav('research')} className="nav-link-btn">R&D</button>
                                    <button onClick={() => handleNav('contact')} className="nav-link-btn">Assurance</button>
                                    <button onClick={() => handleNav('contact')} className="nav-link-btn">Contact</button>
                                </div>
                                <button onClick={() => handleNav('audit')} className="btn btn-info rounded-pill px-4 py-2 fw-bold text-uppercase small text-dark border-0 mt-3 mt-lg-0">
                                    Request Audit
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;