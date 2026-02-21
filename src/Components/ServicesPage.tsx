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
  
      <div className="position-relative services-page-content" style={{ zIndex: 1, paddingTop: '100px' }}>

        {/* Services - main content */}
        <div className="container">
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
