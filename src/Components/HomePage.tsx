import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Binary,
  Braces,
  Bug,
  Code2,
  Lock,
  Network,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import projects from "../Data/projects.json";
import research from "../Data/research.json";
import { useSecurityExperience } from "../experience/SecurityExperience";
import {
  ExperienceSection,
  MaskedHeading,
  Reveal,
  TechnicalLabel,
} from "./Experience";
import "./HomePage.css";

const institutional = [
  {
    icon: Binary,
    title: "Bytecode Analysis",
    text: "Trace bytecode, invariants, and privileged execution paths.",
    tags: ["NODE VALIDATION", "GAS OPTIMIZATION"],
  },
  {
    icon: Lock,
    title: "Consensus Security",
    text: "Validate consensus assumptions and cryptographic boundaries.",
    tags: ["CRYPTO PROOFS", "BFT ANALYSIS"],
  },
  {
    icon: Activity,
    title: "Ecosystem Defense",
    text: "Test protocols, interfaces, infrastructure, and integrations together.",
    tags: ["DEFI SECURITY", "FORENSICS", "GOVERNANCE"],
  },
];

const capabilities = [
  {
    icon: Code2,
    title: "Smart Contract Auditing",
    text: "Manual code review + deep invariant analysis to identify logic flaws.",
    tags: ["Solidity", "Rust", "Move"],
  },
  {
    icon: Terminal,
    title: "Web3 Infrastructure",
    text: "High-availability node clusters and validator operations.",
    tags: ["EVM", "Solana"],
  },
  {
    icon: Bug,
    title: "Penetration Testing",
    text: "Full-spectrum adversarial simulations targeting dApps and bridges.",
    tags: ["Red Team", "OWASP"],
  },
  {
    icon: Braces,
    title: "ZK-Proof Engineering",
    text: "Development of zero-knowledge circuits and privacy architectures.",
    tags: ["zkSNARKs", "Circom"],
  },
];

const capabilityCodes = ["AUDIT", "INFRA", "OFFENSE", "PROOF"];

const auditSteps = [
  "Specification gathering",
  "Manual review",
  "Initial audit report",
  "Delivery",
];

const researchIcons = [Code2, Braces, ShieldCheck] as const;
const projectIcons = [Code2, Braces, Terminal, ShieldCheck] as const;

export default function HomePage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;
  const { focusScene } = useSecurityExperience();
  const [activeProject, setActiveProject] = useState(0);
  const [activeAudit, setActiveAudit] = useState(0);
  const ActiveProjectIcon = projectIcons[activeProject % projectIcons.length];

  return (
    <div className="cinematic-home">
      <ExperienceSection chapter="hero" className="cinematic-hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-video-wash" aria-hidden="true" />
        <div className="site-grid hero-grid">
          <motion.aside
            className="hero-context"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : .34, duration: .7 }}
          >
            <span>Independent security engineering</span>
            <p>We inspect the paths attackers look for—and the assumptions automated tools miss.</p>
            <div><i /><i /><b>CONTINUOUS REVIEW</b><small>01</small></div>
          </motion.aside>

          <div className="hero-copy">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.6 }}
            >
              <TechnicalLabel live>Cyphrix / Security Studio</TechnicalLabel>
            </motion.div>
            <MaskedHeading as="h1">
              <span>Audit the code.</span>
              <span>Verify the system.</span>
              <em>Build with confidence.</em>
            </MaskedHeading>
            <motion.p
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.48, duration: 0.68 }}
            >Smart-contract audits, adversarial testing, and Web3 engineering for teams shipping critical systems.</motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0 : 0.62 }}
            >
              <button
                className="button button--primary"
                onMouseEnter={() => focusScene(1, 1)}
                onMouseLeave={() => focusScene(null)}
                onClick={() => navigate("/request-audit")}
                data-cursor="Audit"
              >
                Request Security Audit <ArrowUpRight size={16} />
              </button>
              <button
                className="button button--ghost"
                onClick={() => navigate("/projects")}
                data-cursor="View"
              >
                View Case Studies
              </button>
            </motion.div>
          </div>

          <motion.div
            className="hero-proof"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : .68, duration: .7 }}
          >
            <p>Manual analysis backed by focused tooling, clear remediation, and verified delivery.</p>
          </motion.div>
          <motion.button
            className="hero-process"
            onClick={() => navigate("/flowofaudit")}
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : .82, duration: .7 }}
          >
            <span>Active assurance</span><strong>Explore our audit flow</strong><ArrowUpRight />
          </motion.button>
          <motion.div
            className="hero-trust"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : .96, duration: .7 }}
          >
            <div><strong>10+</strong><span>Protocols audited</span></div>
            <div><strong>0</strong><span>Post-audit exploits</span></div>
          </motion.div>
          <div className="scroll-cue" aria-hidden="true">
            <span>Explore Cyphrix</span>
            <i />
          </div>
        </div>
      </ExperienceSection>

      <section className="metric-rail" aria-label="Cyphrix results">
        <div className="site-grid metric-grid">
          {[
            ["$400K+", "Assets Protected"],
            ["10+", "Protocols Audited"],
            ["0", "Post-Audit Exploits"],
            ["5h", "Response Time"],
          ].map(([value, label], index) => (
            <div key={label}>
              <span>0{index + 1}</span>
              <strong>{value}</strong>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <ExperienceSection chapter="services" className="inspection-chapter">
        <div className="site-grid chapter-grid">
          <div className="chapter-intro chapter-intro--sticky">
            <TechnicalLabel>01 / Institutional Defense</TechnicalLabel>
            <MaskedHeading>
              Advanced <em>Protocol Integrity</em>
            </MaskedHeading>
            <p>
              Each layer remains connected while it is separated, traced, and
              verified.
            </p>
            <button className="text-link" onClick={() => navigate("/services")}>
              Inspect every layer <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="inspection-list">
            {institutional.map(({ icon: Icon, title, text, tags }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <article
                  className="inspection-row"
                  onMouseEnter={() => focusScene(index)}
                  onMouseLeave={() => focusScene(null)}
                >
                  <span className="row-number">0{index + 1}</span>
                  <Icon />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <footer>
                      {tags.map((tag) => (
                        <span key={tag}>[{tag}]</span>
                      ))}
                    </footer>
                  </div>
                  <i className="row-signal" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </ExperienceSection>

      <ExperienceSection chapter="services" className="capability-chapter">
        <div className="site-grid">
          <header className="section-heading">
            <TechnicalLabel>02 / Capabilities</TechnicalLabel>
            <MaskedHeading>
              Four ways we <em>protect growth.</em>
            </MaskedHeading>
          </header>
          <div className="capability-mosaic">
            {capabilities.map(({ icon: Icon, title, tags }, index) => (
              <Reveal
                key={title}
                className={`capability-tile capability-tile--${index + 1}`}
                delay={index * 0.04}
              >
                <article
                  onMouseEnter={() => focusScene(index + 3)}
                  onMouseLeave={() => focusScene(null)}
                >
                  <div className="tile-head">
                    <span>0{index + 1}</span>
                    <small>{capabilityCodes[index]}</small>
                  </div>
                  <div
                    className="tile-visual tile-visual--simple coding-icon-visual"
                    aria-hidden="true"
                  >
                    <Icon className="tile-visual__glyph" />
                  </div>
                  <h3>{title}</h3>
                  <footer>
                    {tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </ExperienceSection>

      <ExperienceSection chapter="projects" className="project-chapter">
        <div className="site-grid">
          <header className="section-heading section-heading--split">
            <div>
              <TechnicalLabel>03 / Selected Projects</TechnicalLabel>
              <MaskedHeading>
                Verified <em>Modules</em>
              </MaskedHeading>
            </div>
            <p>Selected builds and security engagements.</p>
          </header>
          <div className="project-stage">
            <div className="project-preview" aria-live="polite">
              <div className="project-preview__meta">
                <span>MODULE 0{activeProject + 1}</span>
                <b>VERIFIED</b>
              </div>
              <div className="project-preview__diagram coding-icon-visual" aria-hidden="true"><ActiveProjectIcon /></div>
              <h3>{projects[activeProject].title}</h3>
              <p>{projects[activeProject].tagline}</p>
              <footer>
                {projects[activeProject].techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </footer>
            </div>
            <div className="project-index">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  className={activeProject === index ? "is-active" : ""}
                  onMouseEnter={() => {
                    setActiveProject(index);
                    focusScene(index);
                  }}
                  onFocus={() => setActiveProject(index)}
                  onMouseLeave={() => focusScene(null)}
                  onClick={() => navigate("/projects")}
                  data-cursor="View"
                >
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.tagline}</p>
                  </div>
                  <b>{project.techStack[0]}</b>
                  <ArrowUpRight />
                </button>
              ))}
            </div>
          </div>
        </div>
      </ExperienceSection>

      <ExperienceSection chapter="audit" className="audit-chapter">
        <div className="site-grid chapter-grid">
          <div className="chapter-intro chapter-intro--sticky">
            <TechnicalLabel>04 / Flow of Audit</TechnicalLabel>
            <MaskedHeading>
              From unknown state to <em>verified state.</em>
            </MaskedHeading>
            <div className="audit-readout" aria-live="polite">
              <span>ACTIVE PHASE</span>
              <strong>0{activeAudit + 1}</strong>
              <p>{auditSteps[activeAudit]}</p>
              <i
                style={{
                  width: `${((activeAudit + 1) / auditSteps.length) * 100}%`,
                }}
              />
            </div>
            <button
              className="text-link"
              onClick={() => navigate("/flowofaudit")}
            >
              Explore the full methodology <ArrowUpRight size={14} />
            </button>
          </div>
          <ol className="audit-index">
            {auditSteps.map((step, index) => (
              <li key={step}>
                <button
                  className={activeAudit === index ? "is-active" : ""}
                  onMouseEnter={() => {
                    setActiveAudit(index);
                    focusScene(index);
                  }}
                  onFocus={() => setActiveAudit(index)}
                  onMouseLeave={() => focusScene(null)}
                >
                  <span>0{index + 1}</span>
                  <h3>{step}</h3>
                  <i />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </ExperienceSection>

      <ExperienceSection chapter="research" className="research-chapter">
        <div className="site-grid">
          <header className="section-heading section-heading--split">
            <div>
              <TechnicalLabel>05 / Research &amp; Development</TechnicalLabel>
              <MaskedHeading>
                Active research <em>environment.</em>
              </MaskedHeading>
            </div>
            <button className="text-link" onClick={() => navigate("/research")}>
              Enter the research lab <ArrowUpRight size={14} />
            </button>
          </header>
          <div className="research-matrix">
            {research.slice(0, 3).map((item, index) => {
              const ResearchIcon = researchIcons[index];
              return (
                <Reveal
                  key={item.id}
                  className={
                    index === 0
                      ? "research-module research-module--lead"
                      : "research-module"
                  }
                  delay={index * 0.035}
                >
                  <article
                    onMouseEnter={() => focusScene(index)}
                    onMouseLeave={() => focusScene(null)}
                  >
                    <header>
                      <span>{item.category}</span>
                      <b>
                        <i />
                        {item.status}
                      </b>
                    </header>
                    <div
                      className={`research-card-visual research-card-visual--${index + 1} coding-icon-visual`}
                      aria-hidden="true"
                    >
                      <ResearchIcon />
                    </div>
                    <h3>{item.title}</h3>
                    <footer>
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </footer>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </ExperienceSection>

      <ExperienceSection chapter="partner" className="alliance-chapter">
        <div className="site-grid alliance-grid">
          <div>
            <TechnicalLabel>06 / Partner Alliance</TechnicalLabel>
            <MaskedHeading>
              Build a trusted <em>security network.</em>
            </MaskedHeading>
            <p>Refer a protocol. Earn 10% when the engagement starts.</p>
            <button
              className="button button--ghost"
              onClick={() => navigate("/partnerwithus")}
            >
              Explore the partnership <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="alliance-map coding-icon-visual" aria-hidden="true"><Network /><span>Partner network</span></div>
        </div>
      </ExperienceSection>

      <ExperienceSection chapter="contact" className="final-chapter">
        <div className="site-grid final-grid">
          <TechnicalLabel live>Secure channel available</TechnicalLabel>
          <MaskedHeading>
            Ready to secure
            <br />
            <em>your protocol?</em>
          </MaskedHeading>
          <p>
            Tell us what you are building. We’ll help you scope the safest path
            forward.
          </p>
          <button
            className="button button--primary"
            onClick={() => navigate("/request-audit")}
            data-cursor="Audit"
          >
            Request Free Scope Review <ArrowUpRight size={16} />
          </button>
        </div>
      </ExperienceSection>
    </div>
  );
}
