import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import projects from "../Data/projects.json";
import AuditList from "./AuditList";
import { MaskedHeading, TechnicalLabel } from "./Experience";
import SecurityCTA from "./SecurityCTA";
import Testimonials from "./Testimonials";

type Project = (typeof projects)[number];

export default function ProjectsPage() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const project = projects[active];
  return (
    <div className="projects-page route-experience">
      <header className="page-hero route-hero">
        <div className="container">
          <TechnicalLabel live>Selected Work / Verified Systems</TechnicalLabel>
          <MaskedHeading as="h1">Built to ship.<br /><em>Tested to hold.</em></MaskedHeading>
          <p>Selected blockchain builds and security engagements.</p>
        </div>
      </header>

      <section className="work-showcase">
        <div className="container work-showcase__grid">
          <article className="work-preview">
            <header><span>CASE 0{active + 1}</span><b>ACTIVE PREVIEW</b></header>
            <div className="work-preview__visual" aria-hidden="true"><i /><i /><i /><i /><b /></div>
            <h2>{project.title}</h2>
            <p>{project.tagline}</p>
            <footer>{project.techStack.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</footer>
          </article>
          <div className="work-index">
            {projects.map((item, index) => (
              <button key={item.id} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setSelected(item)} data-cursor="View">
                <span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.tagline}</p></div><ArrowUpRight />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="proof-section">
        <div className="container"><TechnicalLabel>Published Security Reports</TechnicalLabel><AuditList /></div>
      </section>
      <section className="proof-section proof-section--voices"><div className="container"><TechnicalLabel>Client Signals</TechnicalLabel><Testimonials /></div></section>

      <AnimatePresence>
        {selected && (
          <motion.div className="modal-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.article className="modal-content" role="dialog" aria-modal="true" aria-labelledby="project-title" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close project details"><X /></button>
              <div className="modal-body">
                <TechnicalLabel>Case Study</TechnicalLabel><h2 id="project-title">{selected.title}</h2><p>{selected.description}</p>
                <div className="modal-tags">{selected.techStack.map((tech) => <span key={tech}>{tech}</span>)}</div>
                <div className="modal-stats">{selected.stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
                {selected.link && <a className="button button--primary" href={selected.link} target="_blank" rel="noopener noreferrer">Open project <ExternalLink size={15} /></a>}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
      <SecurityCTA />
    </div>
  );
}
