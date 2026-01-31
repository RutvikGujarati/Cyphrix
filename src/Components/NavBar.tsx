import React, { useEffect } from 'react';

const Header: React.FC = () => {

    useEffect(() => {
        const handleScroll = () => {
            // setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navStyle = {
        background: 'rgba(10, 10, 20, 0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
    };

    const logoBoxStyle = {
        width: '42px',
        height: '42px',
        background: 'linear-gradient(135deg, #00f2ff 0%, #0066ff 100%)',
        color: '#000'
    };

    return (
        <header className="fixed-top py-3" style={{ zIndex: 1000 }}>
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-dark rounded-4 px-3 py-2 border border-info border-opacity-25" style={navStyle}>
                    <div className="container-fluid">
                        {/* Logo */}
                        <a className="navbar-brand d-flex align-items-center me-auto" href="#home">
                            <div className="rounded-3 d-flex align-items-center justify-content-center me-3" style={logoBoxStyle}>
                                <span className="fw-bold h5 mb-0">C</span>
                            </div>
                            <div className="d-flex flex-column">
                                <span className="fw-bold text-white">CYPHRIXTECH</span>
                                <small className="text-info" style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>
                                    TRUST. ENCRYPTED.
                                </small>
                            </div>
                        </a>

                        <button
                            className="navbar-toggler border-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
                                <li className="nav-item">
                                    <a className="nav-link text-white-50 fw-semibold px-3" href="#home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white-50 fw-semibold px-3" href="#services">Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white-50 fw-semibold px-3" href="#audit">Process</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white-50 fw-semibold px-3" href="#about">About</a>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <button className="btn btn-outline-info btn-sm rounded-pill px-4 fw-semibold">
                                        Request Audit
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;