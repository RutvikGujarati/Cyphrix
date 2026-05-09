import React from "react";
import { motion } from "framer-motion";
import {
  Binary,
  Network,
  ShieldCheck,
  Layers,
  Lock,
  Activity,
} from "lucide-react";

const HomePage: React.FC = () => {
  const revealVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="homepage">
      {/* HERO */}
      <section
        className="hero"
        style={{
          padding: "200px 0 100px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="container"
          animate="visible"
          variants={revealVariant}
        >
          <span className="section-label">
            Enterprise Smart Contract Security
          </span>
          <h1>
            Secure the Future of{" "}
            <span className="text-gradient">Decentralized Web</span>
          </h1>
          <p
            style={{
              maxWidth: "800px",
              margin: "32px auto",
              fontSize: "20px",
              color: "var(--text-muted)",
            }}
          >
            Cyphrix builds industrial-grade blockchain infrastructure and
            rigorous security architectures — so your protocol ships without
            compromise.
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              marginTop: "48px",
            }}
          >
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/request-audit")}
            >
              Request Security Audit
            </button>
            <button
              className="btn-ghost"
              onClick={() => (window.location.href = "/projects")}
            >
              View Case Studies
            </button>
          </div>

          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "40px",
              marginTop: "100px",
              borderTop: "1px solid var(--border)",
              paddingTop: "60px",
            }}
            animate="visible"
            variants={containerVariant}
          >
            <motion.div
              className="stat"
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "var(--accent-mint)",
                }}
              >
                $400K+
              </div>
              <div
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
              >
                Assets Protected
              </div>
            </motion.div>
            <motion.div
              className="stat"
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "var(--accent-blue)",
                }}
              >
                10+
              </div>
              <div
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
              >
                Protocols Audited
              </div>
            </motion.div>
            <motion.div
              className="stat"
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{ fontSize: "40px", fontWeight: "800", color: "#fff" }}
              >
                0
              </div>
              <div
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
              >
                Post-Audit Exploits
              </div>
            </motion.div>
            <motion.div
              className="stat"
              animate="visible"
              variants={revealVariant}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "var(--accent-gold)",
                }}
              >
                5h
              </div>
              <div
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
              >
                Response Time
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ADVANCED INTEGRITY (RESTORED DETAILS) */}
      <section
        style={{
          padding: "120px 0",
          background: "rgba(0, 255, 204, 0.02)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <motion.div
            style={{ textAlign: "center", marginBottom: "80px" }}
            animate="visible"
            variants={revealVariant}
          >
            <span className="section-label">Institutional Defense</span>
            <h2>
              Advanced <span className="text-gradient">Protocol Integrity</span>
            </h2>
          </motion.div>

          <div className="services-grid">
            <motion.div
              className="service-card"
              animate="visible"
              variants={revealVariant}
            >
              <div className="s-icon">
                <Binary />
              </div>
              <h3>Bytecode Analysis</h3>
              <p>
                Securing the logical foundation of the decentralized web through
                rigorous manual inspection and formal verification.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "auto",
                  opacity: 0.6,
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "0.1em",
                }}
              >
                <span style={{ color: "var(--accent-mint)" }}>
                  [ NODE VALIDATION ]
                </span>
                <span style={{ color: "var(--accent-blue)" }}>
                  [ GAS OPTIMIZATION ]
                </span>
              </div>
            </motion.div>

            <motion.div
              className="service-card"
              animate="visible"
              variants={revealVariant}
            >
              <div className="s-icon">
                <Lock />
              </div>
              <h3>Consensus Security</h3>
              <p>
                Architecting resilient cryptographic primitives and consensus
                mechanisms to ensure zero-trust ledger immutability.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "auto",
                  opacity: 0.6,
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "0.1em",
                }}
              >
                <span style={{ color: "var(--accent-mint)" }}>
                  [ CRYPTO PROOFS ]
                </span>
                <span style={{ color: "var(--accent-gold)" }}>
                  [ BFT ANALYSIS ]
                </span>
              </div>
            </motion.div>

            <motion.div
              className="service-card"
              animate="visible"
              variants={revealVariant}
            >
              <div className="s-icon">
                <Activity />
              </div>
              <h3>Ecosystem Defense</h3>
              <p>
                A comprehensive shield merging blockchain transparency with
                enterprise-grade cybersecurity protocols.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "auto",
                  opacity: 0.6,
                  fontSize: "10px",
                  fontWeight: "800",
                  letterSpacing: "0.05em",
                }}
              >
                <span>DEFI SECURITY</span>
                <span>•</span>
                <span>FORENSICS</span>
                <span>•</span>
                <span>GOVERNANCE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "120px 0" }}>
        <div className="container">
          <motion.div
            style={{ textAlign: "center", marginBottom: "80px" }}
            animate="visible"
            variants={revealVariant}
          >
            <span className="section-label">Capabilities</span>
            <h2>
              Engineered <span className="text-gradient">Resilience</span>
            </h2>
          </motion.div>

          <motion.div
            className="services-grid"
            animate="visible"
            variants={containerVariant}
          >
            {[
              {
                icon: <Binary />,
                title: "Smart Contract Auditing",
                text: "Manual code review + deep invariant analysis to identify logic flaws.",
                tags: ["Solidity", "Rust", "Move"],
              },
              {
                icon: <Network />,
                title: "Web3 Infrastructure",
                text: "High-availability node clusters and validator operations.",
                tags: ["EVM", "Solana"],
              },
              {
                icon: <ShieldCheck />,
                title: "Penetration Testing",
                text: "Full-spectrum adversarial simulations targeting dApps and bridges.",
                tags: ["Red Team", "OWASP"],
              },
              {
                icon: <Layers />,
                title: "ZK-Proof Engineering",
                text: "Development of zero-knowledge circuits and privacy architectures.",
                tags: ["zkSNARKs", "Circom"],
              },
            ].map((s, i) => (
              <motion.div
                className="service-card"
                key={i}
                animate="visible"
                variants={revealVariant}
              >
                <div className="s-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="s-tags">
                  {s.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="cta-section"
        style={{ textAlign: "center" }}
        animate="visible"
        variants={revealVariant}
      >
        <div className="container">
          <span className="section-label">Get Started</span>
          <h2>Ready to secure your protocol?</h2>
          <p
            style={{
              maxWidth: "600px",
              margin: "24px auto 40px",
              color: "var(--text-muted)",
              fontSize: "18px",
            }}
          >
            Join the protocols that trust Cyphrix for institutional-grade
            security and high-performance infrastructure.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="nav-cta"
              style={{ padding: "16px 48px", fontSize: "14px" }}
              onClick={() => (window.location.href = "/request-audit")}
            >
              Request Free Scope Review
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
