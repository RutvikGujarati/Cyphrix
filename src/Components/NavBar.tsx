import React from 'react';
import logo from "/Cyphrix.svg";

interface HeaderProps {
    onNavigate: (page: 'home' | 'contact') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    return (
        <header className="fixed-top py-4 shadow-none">
            <div className="container">
                {/* Advanced Glassmorphism using Bootstrap classes */}
                <nav className="navbar navbar-dark rounded-pill px-4 py-2 border border-info border-opacity-25 bg-black bg-opacity-75 shadow-lg">
                    <div className="container-fluid d-flex align-items-center justify-content-between">

                        {/* 1. LOGO: Using negative margins to break the border */}
                        <a
                            className="navbar-brand d-flex align-items-center m-0 p-0"
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                        >
                            <div className="position-relative mt-n3 mb-n3" style={{ width: '64px' }}>
                                <img
                                    src={logo}
                                    alt="Cyphrix"
                                    className="img-fluid"
                                />
                            </div>
                            <div className="ms-3 d-none d-sm-block">
                                <span className="fw-bold text-white lh-1 h5 mb-0 d-block">CYPHRIXTECH</span>
                                <small className="text-info font-monospace opacity-75" style={{ fontSize: '0.65rem' }}>
                                    TRUST. ENCRYPTED.
                                </small>
                            </div>
                        </a>

                        {/* 2. DUAL ACTION BUTTONS */}
                        <div className="d-flex align-items-center">
                            {/* Connect Us / Inquire */}
                            <button
                                onClick={() => onNavigate('contact')}
                                className="btn btn-link text-white text-decoration-none small fw-bold text-uppercase d-none d-md-inline-block px-3 border-0"
                            >
                                Inquire
                            </button>

                            {/* Vertical Divider */}
                            <div className="vr bg-white opacity-25 mx-3 d-none d-md-block" style={{ height: '20px' }}></div>

                            {/* Request Audit: High-contrast CTA */}
                            <button className="btn btn-info rounded-pill px-4 py-2 fw-bold text-uppercase small text-dark border-0">
                                Request Audit
                            </button>
                        </div>

                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;