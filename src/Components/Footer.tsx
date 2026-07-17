import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-wordmark" aria-label="Cyphrix Technologies">
        <span className="brand-mark" aria-hidden="true" />
        <strong>
          <span className="wordmark-cut" data-text="C">C</span>
          <span className="wordmark-clean">y</span>
          <span className="wordmark-cut" data-text="phrix">phrix</span>
        </strong>
      </div>
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} CYPHRIX TECHNOLOGIES — ALL RIGHTS RESERVED</p>
        <div className="footer-socials">
          <a href="#" aria-label="Cyphrix on Twitter"><Twitter /></a>
          <a href="#" aria-label="Cyphrix on GitHub"><Github /></a>
          <a href="https://www.linkedin.com/company/cyphrixtechnologies/about/" target="_blank" rel="noopener noreferrer" aria-label="Cyphrix on LinkedIn"><Linkedin /></a>
          <a href="https://www.instagram.com/cyphrixtechnologies?igsh=MXZoOTA1eWZlOXpoeg==" target="_blank" rel="noopener noreferrer" aria-label="Cyphrix on Instagram"><Instagram /></a>
        </div>
      </div>
    </footer>
  );
}
