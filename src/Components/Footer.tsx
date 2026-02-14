import React from 'react';
import { ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-transparent text-white pt-5 pb-4 border-top border-white border-opacity-10 position-relative z-theme-footer">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h3 className="display-6 fw-bold mb-4 text-uppercase tracking-widest">
                            <span className="text-white">The</span> <span className="text-info">Team</span>
                        </h3>
                        <p className="text-white-50 mb-5">
                            Architects of the decentralized future.
                        </p>

                        <div className="row justify-content-center g-3">
                            {/* Member 1 - Rutvik */}
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-25 h-100 d-flex flex-column align-items-center hover-lift transition-all">
                                    <div className="mb-3 position-relative">
                                        <div className="rounded-circle overflow-hidden p-1" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
                                            <img
                                                src="https://api.dicebear.com/9.x/identicon/svg?seed=Felix"
                                                alt="Rutvik Gujarati"
                                                className="w-100 h-100 rounded-circle bg-black"
                                            />
                                        </div>
                                        <div className="position-absolute bottom-0 end-0 bg-success border border-black rounded-circle p-1" style={{ width: '10px', height: '10px' }}></div>
                                    </div>
                                    <h6 className="fw-bold mb-1">Rutvik Gujarati</h6>
                                    <a target="_blank" href="https://www.upwork.com/freelancers/~0119617106c07ee432?viewMode=1" className="btn btn-sm btn-outline-light rounded-pill px-3 mt-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                        <span>Upwork</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Member 2 - Vishal */}
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-25 h-100 d-flex flex-column align-items-center hover-lift transition-all">
                                    <div className="mb-3 position-relative">
                                        <div className="rounded-circle overflow-hidden p-1" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #a855f7, #db2777)' }}>
                                            <img
                                                src="https://api.dicebear.com/9.x/identicon/svg?seed=Luna"
                                                alt="Vishal Baraiya"
                                                className="w-100 h-100 rounded-circle bg-black"
                                            />
                                        </div>
                                        <div className="position-absolute bottom-0 end-0 bg-success border border-black rounded-circle p-1" style={{ width: '10px', height: '10px' }}></div>
                                    </div>
                                    <h6 className="fw-bold mb-1">Vishal Baraiya</h6>
                                    <a target="_blank" href="https://www.upwork.com/freelancers/vishalb43?mp_source=share" className="btn btn-sm btn-outline-light rounded-pill px-3 mt-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                        <span>Upwork</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Member 3 - Kinal */}
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-25 h-100 d-flex flex-column align-items-center hover-lift transition-all">
                                    <div className="mb-3 position-relative">
                                        <div className="rounded-circle overflow-hidden p-1" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                                            <img
                                                src="https://api.dicebear.com/9.x/identicon/svg?seed=Aneka"
                                                alt="Kinal Makavana"
                                                className="w-100 h-100 rounded-circle bg-black"
                                            />
                                        </div>
                                        <div className="position-absolute bottom-0 end-0 bg-success border border-black rounded-circle p-1" style={{ width: '10px', height: '10px' }}></div>
                                    </div>
                                    <h6 className="fw-bold mb-1">Kinal Makavana</h6>
                                    <a target="_blank" href="https://www.upwork.com/freelancers/~01aab1fed28d527e46?mp_source=share" className="btn btn-sm btn-outline-light rounded-pill px-3 mt-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                        <span>Upwork</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row border-top border-white border-opacity-10 pt-4 align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <span className="h5 fw-bold tracking-tight mb-0">CYPHRIX</span>
                        <small className="d-block text-white-50 mt-1">&copy; {new Date().getFullYear()} Cyphrix Technologies. All rights reserved.</small>
                        <address className="text-white-50 small mt-2 mb-0 fst-normal">
                            B/75, Sukhsagar Society, Chitra,<br />
                            Bhavnagar
                        </address>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <div className="d-flex justify-content-center justify-content-md-end gap-3 text-white-50">
                            <a href="#" className="text-reset hover-white transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="text-reset hover-white transition-colors"><Github size={18} /></a>
                            <a href="#" className="text-reset hover-white transition-colors"><Linkedin size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
