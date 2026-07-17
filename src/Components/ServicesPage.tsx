import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, CheckCircle, ClipboardList, CloudCog, Coins, Component,
  FileCode, Globe, Infinity as InfinityIcon, Layout, Link, MonitorSmartphone,
  Network, Shield, ShieldCheck, Sparkles, UserCheck, Webhook, Zap,
} from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import servicesData from "../Data/services.json";
import { useSecurityExperience } from "../experience/SecurityExperience";
import { MaskedHeading, Reveal, TechnicalLabel } from "./Experience";
import SecurityCTA from "./SecurityCTA";

type Category = "Development" | "Security" | "QA";
type Service = (typeof servicesData.services)[number];

const categories: Array<{ id: Category; label: string; range: string }> = [
  { id: "Development", label: "Development", range: "01—06" },
  { id: "Security", label: "Security", range: "07—09" },
  { id: "QA", label: "Quality Assurance", range: "10—17" },
];

const iconMap: Record<string, ComponentType<{ size?: number }>> = {
  Sparkles, FileCode, ShieldCheck, Globe, Network, Coins, MonitorSmartphone,
  CloudCog, CheckCircle, Zap, Shield, Layout, UserCheck, Webhook,
  Infinity: InfinityIcon, Component, ClipboardList,
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion() ?? false;
  const { focusScene } = useSecurityExperience();
  const [category, setCategory] = useState<Category>("Development");
  const grouped = useMemo(() => ({
    Development: servicesData.services.filter((service) => [1, 2, 4, 5, 6, 7].includes(service.id)),
    Security: servicesData.services.filter((service) => [3, 8, 11].includes(service.id)),
    QA: servicesData.services.filter((service) => [9, 10, 12, 13, 14, 15, 16, 17].includes(service.id)),
  }), []);
  const services = grouped[category];
  const [activeId, setActiveId] = useState(servicesData.services[0].id);
  const activeService = services.find((service) => service.id === activeId) ?? services[0];

  const selectCategory = (next: Category) => {
    setCategory(next);
    setActiveId(grouped[next][0].id);
  };

  const selectService = (service: Service, index: number) => {
    setActiveId(service.id);
    focusScene(index, 0.9);
  };

  const ActiveIcon = iconMap[activeService.icon] ?? ShieldCheck;
  const detailLists = [
    ...("platforms" in activeService && activeService.platforms ? activeService.platforms : []),
    ...("bullets" in activeService && activeService.bullets ? activeService.bullets : []),
    ...("methodology" in activeService && activeService.methodology ? activeService.methodology : []),
  ];
  const pdfLink = "pdfLink" in activeService && typeof activeService.pdfLink === "string" ? activeService.pdfLink : null;

  return (
    <div className="services-page route-experience">
      <header className="page-hero route-hero">
        <div className="container">
          <TechnicalLabel live>Engineering Hub / System Decomposition</TechnicalLabel>
          <MaskedHeading as="h1">Inspect <em>every layer.</em></MaskedHeading>
          <p>Blockchain engineering, security audits, and QA under one roof.</p>
          <div className="route-hero__status" aria-hidden="true"><span>17 CAPABILITIES</span><i /><b>LIVE INDEX</b></div>
        </div>
      </header>

      <nav className="service-category-nav" aria-label="Service categories">
        <div className="container">
          {categories.map((item) => (
            <button key={item.id} className={category === item.id ? "is-active" : ""} onClick={() => selectCategory(item.id)}>
              <span>{item.range}</span>{item.label}<i />
            </button>
          ))}
        </div>
      </nav>

      <section className="service-inspector">
        <div className="container service-inspector__grid">
          <div className="service-index">
            <TechnicalLabel>{category} / Capability Index</TechnicalLabel>
            {services.map((service, index) => (
              <button key={service.id} className={activeService.id === service.id ? "is-active" : ""} onMouseEnter={() => selectService(service, index)} onFocus={() => selectService(service, index)} onMouseLeave={() => focusScene(null)} onClick={() => selectService(service, index)}>
                <span>{String(service.id).padStart(2, "0")}</span><strong>{service.title}</strong><i />
              </button>
            ))}
          </div>

          <div className="service-detail-wrap">
            <AnimatePresence mode="wait">
              <motion.article key={activeService.id} className="service-detail" initial={{ opacity: 0, y: reduced ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -12 }} transition={{ duration: reduced ? 0 : .42, ease: [0.22, 1, 0.36, 1] }}>
                <header><span>LAYER {String(activeService.id).padStart(2, "0")}</span><ActiveIcon size={26} /></header>
                <h2>{activeService.title}</h2>
                <p className="service-detail__tagline">{activeService.tagline}</p>
                <p>{activeService.detail}</p>
                {activeService.summary !== activeService.detail && <p>{activeService.summary}</p>}
                {detailLists.length > 0 && <ul>{detailLists.map((item) => <li key={item}>{item}</li>)}</ul>}
                {"deliverables" in activeService && activeService.deliverables && <aside><span>Deliverables</span><p>{activeService.deliverables}</p></aside>}
                <footer>
                  {pdfLink && <a href={pdfLink} target="_blank" rel="noopener noreferrer"><Link size={14} /> View Brochure</a>}
                  <button onClick={() => navigate("/inquiry")}>Initiate service <ArrowRight size={15} /></button>
                </footer>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="service-catalog">
        <div className="container">
          <header><TechnicalLabel>Complete Capability Catalog</TechnicalLabel><h2>{servicesData.tagline}</h2></header>
          <div>
            {servicesData.services.map((service, index) => {
              const Icon = iconMap[service.icon] ?? ShieldCheck;
              return <Reveal key={service.id} delay={(index % 4) * .025}><article onMouseEnter={() => focusScene(index)} onMouseLeave={() => focusScene(null)}><span>{String(service.id).padStart(2, "0")}</span><Icon size={19} /><h3>{service.title}</h3><p>{service.summary}</p></article></Reveal>;
            })}
          </div>
          <p className="service-catalog__closing">{servicesData.closing}</p>
        </div>
      </section>
      <SecurityCTA />
    </div>
  );
}
