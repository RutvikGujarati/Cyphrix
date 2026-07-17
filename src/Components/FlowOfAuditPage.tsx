import { Activity, BadgeCheck, Binary, ClipboardCheck, FileText, FlaskConical, Search, ShieldAlert } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { MaskedHeading, TechnicalLabel } from "./Experience";
import SecurityCTA from "./SecurityCTA";

const steps = [
  { id:"1", title:"Specification gathering", body:"We align scope, specifications, repositories, and test expectations before review begins.", details:["Remove dead code and stale comments","Use a consistent coding style","Document complex logic"], Icon:ClipboardCheck },
  { id:"2", title:"Manual review", body:"Auditors trace business logic, permissions, mathematical assumptions, and unexpected behavior.", details:["Security and logical issues","Specification coverage","Undefined behavior"], Icon:Search },
  { id:"3", title:"Functional testing", body:"Contracts are deployed in controlled environments and tested across conditions and parameters.", details:["Testnets and mainnet forks","Function path validation","Gas checks"], Icon:FlaskConical },
  { id:"4", title:"Latest attack vectors", body:"We reproduce relevant emerging exploits against the project’s architecture.", details:["Market manipulation","LP pricing attacks","Front-running vectors"], Icon:ShieldAlert },
  { id:"5", title:"Automated testing", body:"Purpose-built tools extend manual analysis and surface additional signals.", details:["Slither","Mythril / MythX","Coverage and graph tooling"], Icon:Binary },
  { id:"6", title:"Initial report", body:"Findings, severity, impact, and remediation guidance are delivered for your team to address.", details:["Risk classification","Recommended fixes","Remediation window"], Icon:FileText },
  { id:"7", title:"Final report", body:"Fixes are re-tested and the final security position is documented.", details:["Re-audit","Residual-risk review","Final status"], Icon:BadgeCheck },
  { id:"8", title:"Delivery", body:"The verified report is prepared as a polished, shareable audit artifact.", details:["Final PDF","Tool references","Secure delivery"], Icon:Activity },
];

const phaseSignals = [
  ["SCOPE MAP", "BOUNDARIES LOCKED"],
  ["LOGIC TRACE", "MANUAL REVIEW"],
  ["PATH TEST", "FUNCTIONS EXECUTED"],
  ["THREAT MODEL", "VECTORS SIMULATED"],
  ["TOOL SIGNAL", "ANALYSIS MERGED"],
  ["FINDINGS", "REMEDIATION OPEN"],
  ["RE-TEST", "FIXES VERIFIED"],
  ["DELIVERY", "REPORT SEALED"],
] as const;

export default function FlowOfAuditPage() {
  const [active, setActive] = useState(0);
  const current = steps[active];
  const Icon = current.Icon;
  const sceneState = active === 0 ? "mapping" : active < 6 ? "inspection" : "resolved";
  const [traceLabel, traceStatus] = phaseSignals[active];
  const scanStyle = {
    "--scan-x": `${7 + active * (86 / (steps.length - 1))}%`,
  } as CSSProperties;
  return (
    <div className="flow-page route-experience">
      <header className="page-hero route-hero"><div className="container"><TechnicalLabel live>Methodology / 8 Phases</TechnicalLabel><MaskedHeading as="h1">Unknown state.<br /><em>Verified system.</em></MaskedHeading><p>A clear, repeatable path from scope to final report.</p></div></header>
      <section className="flow-inspector"><div className="container flow-inspector__grid">
        <article className="flow-preview">
          <header><span>PHASE {current.id} / 8</span><b>ACTIVE</b></header>
          <div className="flow-preview__scan" data-state={sceneState} style={scanStyle} aria-hidden="true">
            <div className="audit-lane">
              <div className="audit-lane__steps">
                {steps.map((step, index) => <span className={index <= active ? "is-passed" : ""} key={step.id}>0{step.id}</span>)}
              </div>
              <div className="audit-lane__state"><strong>{traceLabel}</strong><span>{traceStatus}</span></div>
            </div>
            <div className="audit-scan-plane"><span>PHASE 0{current.id}</span></div>
            <div className="audit-telemetry"><span>{sceneState === "resolved" ? "VERIFIED" : "REVIEWING"}</span><em>{traceStatus}</em></div>
          </div>
          <Icon size={28}/><h2>{current.title}</h2><p>{current.body}</p>
          <ul>{current.details.map((detail)=><li key={detail}>{detail}</li>)}</ul>
          <div className="flow-progress"><i style={{width:`${((active+1)/steps.length)*100}%`}}/></div>
        </article>
        <ol className="flow-index">{steps.map((step,index)=><li key={step.id}><button className={active===index?"is-active":""} onMouseEnter={()=>setActive(index)} onFocus={()=>setActive(index)} onClick={()=>setActive(index)}><span>0{step.id}</span><strong>{step.title}</strong><i/></button></li>)}</ol>
      </div></section>
      <SecurityCTA />
    </div>
  );
}
