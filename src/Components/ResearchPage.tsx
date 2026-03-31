import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ScanSearch, Radar, KeyRound, Bot, FlaskConical } from 'lucide-react';
import researchData from '../Data/research.json';
import NeuralNetworkBackground from './NeuralNetworkBackground';

const extraTracks = [
  {
    title: 'Secure-by-design architecture reviews',
    text: 'We evaluate protocol architecture before deployment to reduce exploitable assumptions early in the lifecycle.',
  },
  {
    title: 'Responsible vulnerability disclosure',
    text: 'Findings are validated and communicated with actionable remediation guidance and severity context.',
  },
  {
    title: 'Adversarial simulation workflows',
    text: 'We run scenario-based attack simulations to test real-world resilience beyond unit-level checks.',
  },
];

const iconList = [Shield, ScanSearch, Radar, KeyRound, Bot];

type ResearchItem = {
  id: number;
  title: string;
  category: string;
  status: string;
  description: string;
  tags: string[];
};

const ResearchPage: React.FC = () => {
  const typedData = researchData as ResearchItem[];

  return (
    <div className="bg-black text-white min-vh-100 position-relative overflow-x-hidden">
      <div className="position-fixed top-0 start-0 w-100 h-100 z-0" style={{ pointerEvents: 'none' }}>
        <NeuralNetworkBackground />
      </div>

      <div
        className="position-fixed top-0 start-0 w-100 h-100 z-0"
        style={{ background: 'radial-gradient(circle at center, transparent 0%, #000 90%)', pointerEvents: 'none' }}
      />

      <div className="position-relative z-1" style={{ paddingTop: '150px', paddingBottom: '4rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="text-center mb-5"
          >
            <span className="badge border border-info text-info rounded-pill px-3 py-2 mb-3 bg-transparent">RESEARCH LAB</span>
            <h1 className="display-4 fw-bold text-uppercase mb-3">
              Research <span className="text-info">&</span> Development
            </h1>
            <p className="lead text-white-50 mx-auto" style={{ maxWidth: '820px' }}>
              Driving innovation through advanced security research. We continuously study emerging technologies, threat
              models, and practical defense strategies to keep digital infrastructure safer.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="rounded-4 border border-info border-opacity-25 bg-black bg-opacity-50 p-4 p-md-5 mb-4"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <h2 className="h4 text-info mb-3">Our vision</h2>
            <p className="text-white-50 mb-0">
              Our long-term vision is to strengthen blockchain and digital security standards through continuous
              research, tool-building, responsible vulnerability discovery, and protocol hardening. We do not only audit
              systems - we study how they fail and how to make them resilient by design.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-5"
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <FlaskConical size={20} className="text-info" />
              <h2 className="h4 mb-0">R&D focus areas</h2>
            </div>

            <div className="row g-4">
              {typedData.map((item, index) => {
                const Icon = iconList[index % iconList.length];
                return (
                  <div className="col-12 col-lg-6" key={item.id}>
                    <motion.article
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.45, delay: index * 0.05 }}
                      className="h-100 rounded-4 border border-white border-opacity-10 p-4 bg-black bg-opacity-50"
                      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="p-2 rounded bg-white bg-opacity-10">
                          <Icon size={22} className="text-info" />
                        </div>
                        <span className="badge rounded-pill border border-info border-opacity-50 text-info px-3 py-2">
                          {item.status}
                        </span>
                      </div>

                      <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                      <p className="small text-info mb-2 text-uppercase" style={{ letterSpacing: '0.08em' }}>
                        {item.category}
                      </p>
                      <p className="text-white-50 mb-3">{item.description}</p>

                      <div className="d-flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="small border border-white border-opacity-10 text-white-50 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="rounded-4 border border-white border-opacity-10 bg-black bg-opacity-50 p-4 p-md-5"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <h2 className="h4 mb-3">Extended Cyphrix research tracks</h2>
            <div className="row g-3">
              {extraTracks.map((track) => (
                <div className="col-12 col-md-4" key={track.title}>
                  <div className="rounded-3 border border-white border-opacity-10 p-3 h-100">
                    <h3 className="h6 text-info mb-2">{track.title}</h3>
                    <p className="small text-white-50 mb-0">{track.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
