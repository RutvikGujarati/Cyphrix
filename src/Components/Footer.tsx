import React from 'react';
import { Github, Twitter, Linkedin, MapPin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-transparent text-white pt-5 pb-4 border-top border-white border-opacity-10 position-relative z-theme-footer">
            <div className="container">
                <div className="row border-top border-white border-opacity-10 pt-4 align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <span className="h5 fw-bold tracking-tight mb-0">CYPHRIX</span>
                        <small className="d-block text-white-50 mt-1">&copy; {new Date().getFullYear()} Cyphrix Technologies. All rights reserved.</small>
                        <address className="text-white-50 small mt-2 mb-0 fst-normal d-flex align-items-start gap-2 justify-content-center justify-content-md-start">
                            <MapPin size={14} className="mt-1 flex-shrink-0" />
                            <span>
                                B/75, Sukhsagar Society, Chitra,<br />
                                Bhavnagar
                            </span>
                        </address>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <div className="d-flex justify-content-center justify-content-md-end gap-3 text-white-50">
                            <a href="#" className="text-reset hover-white transition-colors"><Twitter size={18} /></a>
                            <a href="#" className="text-reset hover-white transition-colors"><Github size={18} /></a>
                            <a href="https://www.linkedin.com/company/cyphrixtechnologies/about/" target="_blank" rel="noopener noreferrer" className="text-reset hover-white transition-colors"><Linkedin size={18} /></a>
                            <a href="https://www.instagram.com/cyphrixtechnologies?igsh=MXZoOTA1eWZlOXpoeg==" target="_blank" rel="noopener noreferrer" className="text-reset hover-white transition-colors"><Instagram size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
