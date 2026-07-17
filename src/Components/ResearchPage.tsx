import { ArrowUpRight, Binary, Cpu, FlaskConical, Globe, Lock, Shield, Zap } from "lucide-react";
import { useState } from "react";
import research from "../Data/research.json";
import { MaskedHeading, TechnicalLabel } from "./Experience";
import SecurityCTA from "./SecurityCTA";

const definitions = [
  ["Digital Twin", "Immutable representation of a physical copper batch.", Globe],
  ["ESG Hash", "On-chain fingerprint for verified environmental data.", Shield],
  ["State Machine", "Controlled status progression from source to delivery.", Zap],
  ["Permissioned Node", "Authorized access for enterprise participants.", Lock],
] as const;

const phases = [
  ["01", "Collect", "IoT and operational ESG data"],
  ["02", "Tokenize", "Signed on-chain asset records"],
  ["03", "Verify", "Auditor and governance interfaces"],
] as const;

const researchIcons = [FlaskConical, Binary, Shield, Cpu] as const;

export default function ResearchPage() {
  const [active, setActive] = useState(0);
  const ResearchIcon = researchIcons[active % researchIcons.length];
  return (
    <div className="research-page route-experience">
      <header className="page-hero route-hero"><div className="container"><TechnicalLabel live>Research Lab / Active</TechnicalLabel><MaskedHeading as="h1">Study failure.<br /><em>Design resilience.</em></MaskedHeading><p>Applied research across protocols, cryptography, automation, and threat intelligence.</p></div></header>

      <section className="lab-index"><div className="container lab-index__grid">
        <div className="lab-topics">
          <TechnicalLabel>Current Research</TechnicalLabel>
          {research.map((item, index) => <button key={item.id} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>0{index + 1}</span><strong>{item.title}</strong><i /></button>)}
        </div>
        <article className="lab-preview">
          <header><span>{research[active].category}</span><b>{research[active].status}</b></header>
          <div className={`lab-preview__object lab-preview__object--${(active % researchIcons.length) + 1}`} aria-hidden="true">
            <span className="lab-preview__material"><ResearchIcon /></span>
            <i />
          </div>
          <h2>{research[active].title}</h2><p>{research[active].description}</p>
          <footer>{research[active].tags.map((tag) => <span key={tag}>{tag}</span>)}</footer>
        </article>
      </div></section>

      <section className="rwa-brief"><div className="container">
        <header><div><TechnicalLabel>RWA Case Study</TechnicalLabel><h2>Physical assets.<br />Verifiable state.</h2></div><p>Institutional proof-of-concept architecture for Real World Assets.</p></header>
        <div className="rwa-phases">{phases.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight /></article>)}</div>
        <div className="rwa-definitions">{definitions.map(([title,text,Icon]) => <article key={title}><Icon size={20}/><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="rwa-security"><Binary/><div><span>SECURITY MODEL</span><h3>Signatures, immutable audit trails, encrypted off-chain storage.</h3></div><Cpu/></div>
      </div></section>
      <SecurityCTA />
    </div>
  );
}
