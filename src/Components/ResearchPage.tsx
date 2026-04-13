import React, { Activity } from 'react';
import { motion } from 'framer-motion';
import { Shield, ScanSearch, Radar, KeyRound, Bot, FlaskConical, Database, Code2, Server, Lock, Cpu, Globe, Zap,Layout } from 'lucide-react';
import researchData from '../Data/research.json';
import NeuralNetworkBackground from './NeuralNetworkBackground';

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
      {/* Background elements */}
      <div className="position-fixed top-0 start-0 w-100 h-100 z-0" style={{ pointerEvents: 'none' }}>
        <NeuralNetworkBackground />
      </div>

      <div
        className="position-fixed top-0 start-0 w-100 h-100 z-0"
        style={{ background: 'radial-gradient(circle at center, transparent 0%, #000 90%)', pointerEvents: 'none' }}
      />

      <div className="position-relative z-1" style={{ paddingTop: '150px', paddingBottom: '4rem' }}>
        <div className="container">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="text-center mb-5"
          >
            <span className="badge border border-white border-opacity-25 text-white text-opacity-75 rounded-pill px-3 py-2 mb-3 bg-transparent tracking-widest small">RESEARCH LAB</span>
            <h1 className="display-4 fw-bold text-uppercase mb-3">
              Research <span style={{ color: '#a855f7' }}>&</span> Development
            </h1>
            <p className="lead text-white-50 mx-auto" style={{ maxWidth: '820px' }}>
              Driving innovation through advanced security research. We continuously study emerging technologies, threat
              models, and practical defense strategies to keep digital infrastructure safer.
            </p>
          </motion.div>

          {/* Vision Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="rounded-4 border border-info border-opacity-25 bg-black bg-opacity-50 p-4 p-md-5 mb-5"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          >
            <h2 className="h4 text-white mb-3 d-flex align-items-center gap-2">
              <Radar size={22} className="opacity-50" /> Our vision
            </h2>
            <p className="text-white-50 mb-0 fs-5 lh-base">
              Our long-term vision is to strengthen blockchain and digital security standards through continuous
              research, tool-building, responsible vulnerability discovery, and protocol hardening. We do not only audit
              systems - we study how they fail and how to make them resilient by design.
            </p>
          </motion.section>

          {/* RWA CASE STUDY - NEW CONTENT */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-5"
          >
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold text-white mb-3">RWA CASE STUDY</h2>
              <p className="text-white-50">Deep dive into our Proof of Concept (POC) architecture for Real World Assets</p>
              <div className="d-flex justify-content-center gap-2">
                <span className="badge border border-white border-opacity-10 text-white text-opacity-50 px-3">ARCHITECTURE</span>
                <span className="badge border border-white border-opacity-10 text-white text-opacity-50 px-3">SOLIDITY</span>
                <span className="badge border border-white border-opacity-10 text-white text-opacity-50 px-3">ESG DATA</span>
              </div>
            </div>

            {/* Core Definitions */}
            <div className="row g-4 mb-5">
              <div className="col-12">
                <h3 className="h4 mb-4 d-flex align-items-center gap-2">
                  <Database size={20} className="text-white opacity-50" /> 1. Core Definitions
                </h3>
              </div>
              {[
                { title: 'Digital Twin', icon: Globe, text: 'A blockchain-based representation of a physical copper batch, containing an immutable record of its origin, weight, and grade.' },
                { title: 'ESG Hash', icon: Shield, text: 'A SHA-256 cryptographic fingerprint of off-chain environmental and social data stored on-chain to prevent data tampering.' },
                { title: 'State Machine', icon: Zap, text: 'A logic flow within the smart contract that restricts copper batches to a specific sequence of statuses (e.g., MINED → IN_TRANSIT).' },
                { title: 'Permissioned Node', icon: Lock, text: 'A network participant that requires explicit authorization to join, ensuring the data remains within the enterprise consortium.' }
              ].map((def, idx) => (
                <div className="col-12 col-md-6 col-lg-3" key={idx}>
                  <div className="bg-dark bg-opacity-50 h-100 p-4 rounded-3 border border-white border-opacity-10">
                    <def.icon className="text-white text-opacity-75 mb-3" size={32} />
                    <h4 className="h6 fw-bold mb-2 text-white">{def.title}</h4>
                    <p className="small text-white-50 mb-0">{def.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ER Diagram Section */}
            <motion.div
              className="glass-card p-4 p-md-5 mb-5 border border-white border-opacity-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="h5 text-white opacity-50 mb-5 text-center text-uppercase tracking-widest">Entity Relationship Architecture</h3>

              <div className="position-relative py-5 overflow-hidden" style={{ minHeight: '500px' }}>
                <div className="row justify-content-center g-4 position-relative z-1">
                  {/* Participant */}
                  <div className="col-12 col-sm-6 col-md-4">
                    <div className="bg-dark bg-opacity-50 border border-white border-opacity-25 rounded-3 p-3 h-100">
                      <div className="bg-secondary bg-opacity-50 text-white fw-bold small px-2 py-1 rounded mb-2 d-inline-block">PARTICIPANT</div>
                      <div className="text-start small opacity-75">
                        <div className="d-flex justify-content-between mb-1"><span>PK participant_id</span><span className="text-white opacity-50">🔑</span></div>
                        <div>role</div>
                      </div>
                    </div>
                  </div>

                  {/* Copper Batch */}
                  <div className="col-12 col-sm-6 col-md-4">
                    <div className="bg-dark bg-opacity-50 border border-warning border-opacity-25 rounded-3 p-3 h-100">
                      <div className="bg-warning text-black fw-bold small px-2 py-1 rounded mb-2 d-inline-block">COPPER_BATCH</div>
                      <div className="text-start small opacity-75">
                        <div className="d-flex justify-content-between mb-1"><span>PK batch_id</span><span className="text-info">🔑</span></div>
                        <div>batch_code</div>
                      </div>
                    </div>
                  </div>

                  {/* Ownership Intermediate */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="bg-dark bg-opacity-80 rounded-3 p-3 text-center border" style={{ borderColor: 'rgba(168, 85, 247, 0.3)', backgroundColor: 'rgba(168, 85, 247, 0.05)' }}>
                      <div className="fw-bold small px-2 py-1 rounded mb-2 d-inline-block" style={{ backgroundColor: '#a855f7', color: 'white' }}>OWNERSHIP</div>
                      <div className="text-start small opacity-75">
                        <div className="d-flex justify-content-between mb-1"><span>PK ownership_id</span><span className="text-info">🔑</span></div>
                        <div className="mb-1">FK participant_id</div>
                        <div>FK batch_id</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="bg-dark bg-opacity-50 border border-white border-opacity-25 rounded-3 p-3">
                      <div className="bg-secondary bg-opacity-50 text-white fw-bold small px-2 py-1 rounded mb-2 d-inline-block">ESG_DOCUMENT</div>
                      <div className="text-start small opacity-75">
                        <div className="d-flex justify-content-between mb-1"><span>PK esg_doc_id</span><span className="text-white opacity-50">🔑</span></div>
                        <div>FK batch_id</div>
                      </div>
                      <div className="mt-3 pt-3 border-top border-white border-opacity-10">
                        <div className="small fw-bold text-white opacity-75 mb-2">ONCHAIN_PROOF</div>
                        <div className="text-start small opacity-60">
                          <div>• tx_hash</div>
                          <div>• block_number</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SVG Connections */}
                <svg className="position-absolute top-0 start-0 w-100 h-100 opacity-20 d-none d-md-block" style={{ pointerEvents: 'none' }}>
                  <line x1="25%" y1="20%" x2="50%" y2="40%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="75%" y1="20%" x2="50%" y2="40%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="50%" y1="40%" x2="50%" y2="60%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>
            </motion.div>

            {/* Smart Contract & Data Ingestion */}
            <div className="row g-4 mb-5">
              <div className="col-12 col-lg-6">
                <h3 className="h5 mb-4 d-flex align-items-center gap-2">
                  <Code2 size={20} className="text-info" /> 2. Smart Contract Logic
                </h3>
                <div className="bg-dark bg-opacity-50 rounded-4 border border-white border-opacity-10 p-4 font-monospace small position-relative shadow-inner">
                  <div className="position-absolute top-0 end-0 p-3 opacity-25">Solidity</div>
                  <pre className="mb-0 overflow-auto" style={{ maxHeight: '400px', scrollbarWidth: 'thin' }}>
                    {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CopperRWA {
  enum AssetStatus { Mined, Processed, InTransit, Exported, Delivered }

  struct CopperBatch {
    string batchId;    // Unique Identifier from ERP
    uint256 weight;    // Weight in Metric Tons
    bytes32 dataHash;  // ESG & Logistics metadata hash
    address custodian; // Current entity responsible
    AssetStatus status;// Current stage in lifecycle
  }

  mapping(string => CopperBatch) public registry;
  mapping(address => bool) public isAuthorized;

  modifier onlyAuthorized() {
    require(isAuthorized[msg.sender], "Unauthorized");
    _;
  }

  function createBatch(string memory _id, uint256 _w, bytes32 _h) 
    public onlyAuthorized {
    registry[_id] = CopperBatch(_id, _w, _h, msg.sender, AssetStatus.Mined);
  }
}`}
                  </pre>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <h3 className="h5 mb-4 d-flex align-items-center gap-2">
                  <Server size={20} className="text-info" /> 3. Data Ingestion (Node.js)
                </h3>
                <div className="bg-dark bg-opacity-50 rounded-4 border border-white border-opacity-10 p-4 font-monospace small position-relative shadow-inner">
                  <div className="position-absolute top-0 end-0 p-3 opacity-25">Node.js</div>
                  <pre className="mb-0 overflow-auto" style={{ maxHeight: '400px', scrollbarWidth: 'thin' }}>
                    {`const crypto = require('crypto');

/**
 * Creates a deterministic hash of the ESG metadata.
 */
function createIntegrityHash(metadata) {
  const dataString = JSON.stringify(
    metadata, 
    Object.keys(metadata).sort()
  );
  return '0x' + crypto
    .createHash('sha256')
    .update(dataString)
    .digest('hex');
}

// Example ESG Payload
const currentEsgData = {
  carbonIntensity: "2.4t",
  waterRecyclingRate: "85%",
  mineId: "CHI-092"
};`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="mb-5">
              <h3 className="h4 mb-4 d-flex align-items-center gap-2">
                <Cpu size={20} className="text-info" /> 4. POC Components & Governance
              </h3>
              <div className="glass-card p-4 p-md-5 border border-white border-opacity-10 overflow-hidden position-relative">
                {/* Connecting Line Visualization */}
                <div className="position-absolute top-50 start-0 end-0 d-none d-md-block" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.2), transparent)', transform: 'translateY(-50%)', zIndex: 0 }}></div>
                
                <div className="row g-4 text-center position-relative" style={{ zIndex: 1 }}>
                  {/* Step 1: Off-Chain */}
                  <div className="col-12 col-md-4">
                    <div className="h-100 p-4 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-80 position-relative hover-lift transition-all">
                      <div className="position-absolute top-0 end-0 p-3 opacity-20"><Activity size={32} /></div>
                      <div className="badge rounded-pill bg-opacity-10 text-white-50 mb-3 px-3 py-1 small">PHASE 01</div>
                      <h4 className="h6 fw-bold mb-4 text-white text-opacity-90 text-uppercase tracking-widest">ESG Data Collection</h4>
                      <div className="text-start space-y-3">
                        <div className="p-3 rounded  bg-opacity-5 border border-white border-opacity-5 small text-white-50">
                          <div className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                            <span className="w-1 h-1 bg-purple-500 rounded-full"></span> Mining Application
                          </div>
                          Capturing raw metadata: Energy (kWh), Carbon (CO2e), and Waste Output via IoT.
                        </div>
                        <div className="p-3 rounded  bg-opacity-5 border border-white border-opacity-5 small text-white-50 mt-2">
                          <div className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                            <span className="w-1 h-1 bg-purple-500 rounded-full"></span> Data Validator
                          </div>
                          Off-chain validation layer ensuring data integrity before blockchain entry.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Blockchain */}
                  <div className="col-12 col-md-4">
                    <div className="h-100 p-4 rounded-4 border border-purple-500 border-opacity-30 bg-dark bg-opacity-80 position-relative hover-lift transition-all shadow-lg" style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.15)' }}>
                      <div className="position-absolute top-0 end-0 p-3 opacity-20"><Cpu size={32} className="text-purple-400" /></div>
                      <div className="badge rounded-pill bg-purple-500 bg-opacity-20 text-purple-300 mb-3 px-3 py-1 small">PHASE 02</div>
                      <h4 className="h6 fw-bold mb-4 text-uppercase tracking-widest" style={{ color: '#a855f7' }}>On-Chain Tokenization</h4>
                      <div className="text-start space-y-3">
                        <div className="p-3 rounded bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-10 small text-white-50">
                          <div className="fw-bold text-white mb-1">Smart Contract Logic</div>
                          Executing ESG-to-Asset mapping and Batch ID generation via Solidity.
                        </div>
                        <div className="p-3 rounded bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-10 small text-white-50 mt-2">
                          <div className="fw-bold text-white mb-1">Proof Hub</div>
                          Generating immutable cryptographic hashes for ESG documentation and URI links.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Frontend */}
                  <div className="col-12 col-md-4">
                    <div className="h-100 p-4 rounded-4 border border-white border-opacity-10 bg-dark bg-opacity-80 position-relative hover-lift transition-all">
                      <div className="position-absolute top-0 end-0 p-3 opacity-20"><Layout size={32} /></div>
                      <div className="badge rounded-pill  bg-opacity-10 text-white-50 mb-3 px-3 py-1 small">PHASE 03</div>
                      <h4 className="h6 fw-bold mb-4 text-white text-opacity-90 text-uppercase tracking-widest">Auditor Interface</h4>
                      <div className="text-start space-y-3">
                        <div className="p-3 rounded  bg-opacity-5 border border-white border-opacity-5 small text-white-50">
                          <div className="fw-bold text-white mb-1">Real-Time Visualization</div>
                          Institutional dashboard displaying live provenance and historical ESG performance.
                        </div>
                        <div className="p-3 rounded  bg-opacity-5 border border-white border-opacity-5 small text-white-50 mt-2">
                          <div className="fw-bold text-white mb-1">Governance Portal</div>
                          Voting interface for compliance standards and role-based participant management.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Layer */}
            <div className="row g-4 align-items-stretch">
              <div className="col-12">
                <h3 className="h4 mb-4 d-flex align-items-center gap-2">
                  <Lock size={20} className="text-info" /> 5. Security & Verification
                </h3>
              </div>
              {[
                { title: 'Digital Signatures', text: 'Every state change requires an EIP-712 signature from the custodian’s private key.' },
                { title: 'Audit Trail', text: 'Blockchain provide a time-stamped history of every AssetStatus change, unalterable and transparent.' },
                { title: 'Off-chain Storage', text: 'Sensitive documents are stored in encrypted S3 buckets, with only the hash and URI on ledger.' }
              ].map((item, i) => (
                <div className="col-12 col-md-4" key={i}>
                  <div className="h-100 p-4 rounded-4 border border-white border-opacity-10 bg-black bg-opacity-40 hover-cyan transition-all">
                    <h5 className="h6 fw-bold text-info mb-2">{item.title}</h5>
                    <p className="small text-white-50 mb-0 opacity-80">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <hr className="my-5 border-white border-opacity-10" />

          {/* R&D Focus Areas Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-5"
          >
            <div className="d-flex align-items-center gap-2 mb-4">
              <FlaskConical size={24} className="text-info" />
              <h2 className="h4 fw-bold mb-0">R&D focus areas</h2>
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
                        <div className="p-2 rounded bg-opacity-10">
                          <Icon size={22} className="text-white text-opacity-75" />
                        </div>
                        <span className="badge rounded-pill border border-white border-opacity-10 text-white text-opacity-50 px-3 py-2">
                          {item.status}
                        </span>
                      </div>

                      <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                      <p className="small text-white text-opacity-50 mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '0.08em' }}>
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
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
