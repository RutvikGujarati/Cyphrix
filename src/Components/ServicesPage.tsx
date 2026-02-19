import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileCode,
  ShieldCheck,
  Globe,
  Network,
  Coins,
  MonitorSmartphone,
  CloudCog,
  type LucideIcon,
} from 'lucide-react';
import servicesData from '../Data/services.json';
import ServicesVisual from './ServicesVisual';
import './Services.css';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  FileCode,
  ShieldCheck,
  Globe,
  Network,
  Coins,
  MonitorSmartphone,
  CloudCog,
};

const PHRASES = ['Build Secure', 'Scale Confidently', 'Lead with Blockchain'];
const STEP = 400;
const MAX_VIRTUAL = PHRASES.length * STEP;

const ServicesPage: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const virtualY = useRef(0);
  const touchStartY = useRef(0);

  const updateFromDelta = useCallback((delta: number) => {
    virtualY.current += delta;
    virtualY.current = Math.max(0, Math.min(MAX_VIRTUAL, virtualY.current));
    const idx = Math.min(PHRASES.length - 1, Math.floor(virtualY.current / STEP));
    setPhraseIndex(idx);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (window.scrollY > 0) return;
    const atMax = virtualY.current >= MAX_VIRTUAL;
    const scrollingDown = e.deltaY > 0;
    if (atMax && scrollingDown) return;
    if (e.cancelable) e.preventDefault();
    updateFromDelta(e.deltaY);
  }, [updateFromDelta]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (window.scrollY > 0) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    touchStartY.current = currentY;
    const atMax = virtualY.current >= MAX_VIRTUAL;
    const scrollingDown = deltaY > 0;
    if (atMax && scrollingDown) return;
    if (e.cancelable) e.preventDefault();
    updateFromDelta(deltaY * 0.6);
  }, [updateFromDelta]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleTouchMove]);

  const data = servicesData as {
    tagline: string;
    intro: string;
    closing: string;
    pageTitle: string;
    pageIntro: string;
    services: Array<{
      id: number;
      icon: string;
      title: string;
      summary: string;
      detail: string;
      tagline: string;
      platforms?: string[];
      bullets?: string[];
      methodology?: string[];
      deliverables?: string;
      keywords?: string;
    }>;
  };

  return (
    <div className="services-page min-vh-100 text-white position-relative">
      {/* Scroll-driven Three.js background */}
      <div
        className="position-fixed top-0 start-0 w-100 vh-100 services-visual-wrapper"
        style={{ zIndex: 0, pointerEvents: 'none' }}
        aria-hidden
      >
        <ServicesVisual />
      </div>
      <div className="position-relative services-page-content" style={{ zIndex: 1 }}>
        {/* Hero - tagline swaps in place with each scroll */}
        <section className="services-hero d-flex flex-column align-items-center justify-content-center text-center">
          <div className="services-hero-phrase-swap">
            <AnimatePresence mode="wait">
              <motion.h1
                key={phraseIndex}
                className="display-4 fw-bold mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {PHRASES[phraseIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
        
        </section>

        {/* Services - main content */}
        <div className="container py-5">
        {/* Page title (SEO / detailed section) */}
        <section className="py-4 border-top border-white border-opacity-10">
          <h2 className="h3 fw-bold text-info mb-3">{data.pageTitle}</h2>
          <p className="text-white-50 mb-0">{data.pageIntro}</p>
        </section>

        {/* Service cards - scrollable sections */}
        {data.services.map((service, index) => (
          <motion.section
            key={service.id}
            className="py-5 border-top border-white border-opacity-10 service-detail-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="row align-items-start">
              <div className="col-lg-4 mb-4 mb-lg-0">
                <span className="service-icon-display d-inline-flex align-items-center justify-content-center mb-2" aria-hidden>
                  {(() => {
                    const IconComponent = ICON_MAP[service.icon];
                    return IconComponent ? <IconComponent size={40} strokeWidth={1.5} className="text-info" /> : null;
                  })()}
                </span>
                <h3 className="h4 fw-bold text-info">
                  {service.title}
                </h3>
                <p className="small text-white-50 mb-0 mt-2">
                  {service.tagline}
                </p>
              </div>
              <div className="col-lg-8">
                <p className="text-white mb-3">{service.summary}</p>
                <p className="text-white-50 small mb-3">{service.detail}</p>
                {service.platforms && service.platforms.length > 0 && (
                  <div className="mb-3">
                    <span className="small fw-bold text-info text-uppercase">Platforms</span>
                    <ul className="list-unstyled small text-white-50 mb-0 mt-1">
                      {service.platforms.map((p, i) => (
                        <li key={i} className="mb-1">• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.bullets && service.bullets.length > 0 && (
                  <ul className="list-unstyled small text-white-50 mb-3">
                    {service.bullets.map((b, i) => (
                      <li key={i} className="mb-1 d-flex align-items-center gap-2">
                        <span className="text-info">✔</span> {b}
                      </li>
                    ))}
                  </ul>
                )}
                {service.methodology && service.methodology.length > 0 && (
                  <div className="mb-3">
                    <span className="small fw-bold text-info text-uppercase">Audit methodology</span>
                    <ul className="list-unstyled small text-white-50 mb-0 mt-1">
                      {service.methodology.map((m, i) => (
                        <li key={i} className="mb-1">• {m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.deliverables && (
                  <p className="small text-white-50 mb-0">
                    <span className="text-info">Deliverables:</span> {service.deliverables}
                  </p>
                )}
              </div>
            </div>
          </motion.section>
        ))}


        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
