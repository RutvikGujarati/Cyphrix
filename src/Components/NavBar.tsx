import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import "./NavBar.css";

interface HeaderProps {
  onNavigate: (page: "home" | "projects" | "contact" | "research" | "audit" | "services" | "flowofaudit" | "partnerwithus") => void;
}

const items = [
  ["services", "Services"], ["projects", "Projects"], ["research", "R&D"],
  ["flowofaudit", "Flow of Audit"], ["partnerwithus", "Partner Alliance"], ["contact", "Contact"],
] as const;

export default function Header({ onNavigate }: HeaderProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const isActive = (page: string) => {
    if (page === "home") return location.pathname === "/";
    if (page === "contact") return location.pathname === "/inquiry";
    return location.pathname.includes(page);
  };
  const go = (page: Parameters<HeaderProps["onNavigate"]>[0]) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <nav className={`nav-bar${scrolled ? " is-scrolled" : ""}`} aria-label="Primary navigation">
        <div className="container nav-inner">
          <button className="nav-logo" onClick={() => go("home")} aria-label="Cyphrix home" aria-current={isActive("home") ? "page" : undefined} data-cursor="Home">
            <span className="brand-mark" aria-hidden="true" /><span>CYPHRIX</span>
          </button>
          <div className="nav-links">
            {items.map(([page, label]) => <button key={page} className={isActive(page) ? "active" : ""} aria-current={isActive(page) ? "page" : undefined} onClick={() => go(page)}>{label}</button>)}
          </div>
          <button className={`nav-cta${isActive("audit") ? " active" : ""}`} aria-current={isActive("audit") ? "page" : undefined} onClick={() => go("audit")} data-cursor="Audit">Request Audit <ArrowUpRight size={14} /></button>
          <button className="nav-menu-trigger" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-navigation" className="mobile-navigation" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mobile-navigation__meta"><span>Secure channel</span><b>CYX / NAV</b></div>
            <div className="mobile-navigation__links">
              <button className={isActive("home") ? "active" : ""} aria-current={isActive("home") ? "page" : undefined} onClick={() => go("home")}><span>00</span>Home</button>
              {items.map(([page, label], index) => <button key={page} className={isActive(page) ? "active" : ""} aria-current={isActive(page) ? "page" : undefined} onClick={() => go(page)}><span>0{index + 1}</span>{label}</button>)}
            </div>
            <button className="mobile-navigation__cta" onClick={() => go("audit")}>Request Audit <ArrowUpRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
