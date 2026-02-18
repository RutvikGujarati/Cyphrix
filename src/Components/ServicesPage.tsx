import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
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

const ServicesPage: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

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
        {/* Hero - centered heading, full viewport */}
        <motion.section
          className="services-hero d-flex flex-column align-items-center justify-content-center text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="display-4 fw-bold mb-4">
            {data.tagline}
          </h1>
          <p className="lead text-white-50 mx-auto px-3" style={{ maxWidth: '640px' }}>
            {data.intro}
          </p>
        </motion.section>

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
