import { ExternalLink, FileText } from "lucide-react";
import audits from "../Data/audits.json";

export default function AuditList(){return <div className="audit-report-list">{audits.map((audit)=><a key={audit.id} href={audit.link} target="_blank" rel="noreferrer"><i><FileText/></i><span><strong>{audit.protocol}</strong><small>{audit.client} · {audit.date}</small></span><ExternalLink/></a>)}</div>}
