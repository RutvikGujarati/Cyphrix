import { ArrowUpRight, BadgeDollarSign, CircleCheckBig, Handshake } from "lucide-react";
import { MaskedHeading, TechnicalLabel } from "./Experience";

const eligibility=["New protocol or entity","Referral shared before scoping","Active after first milestone"];
const payments=["Paid within 72h of settlement","USDC, USDT, or bank transfer","Milestone payouts for larger audits"];

export default function PartnerWithUsPage(){
  return <div className="partner-page route-experience">
    <header className="page-hero route-hero"><div className="container"><TechnicalLabel live>Partner Alliance</TechnicalLabel><MaskedHeading as="h1">Trusted introductions.<br/><em>Shared growth.</em></MaskedHeading><p>Refer a protocol and earn 10% when the engagement starts.</p></div></header>
    <section className="partner-overview"><div className="container">
      <div className="partner-metrics"><article><strong>10%</strong><span>Commission</span></article><article><strong>72h</strong><span>Payout window</span></article><article><strong>01</strong><span>Secure introduction</span></article></div>
      <div className="partner-path"><header><TechnicalLabel>How it works</TechnicalLabel><h2>Connect once.<br/>Stay in the loop.</h2></header><div>{[[Handshake,"Introduce","Share the protocol and context."],[CircleCheckBig,"Confirm","We scope and close the engagement."],[BadgeDollarSign,"Earn","Commission is released after settlement."]].map(([Icon,title,text],index)=><article key={String(title)}><span>0{index+1}</span><Icon size={21}/><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div></div>
      <div className="partner-terms"><article><TechnicalLabel>Eligibility</TechnicalLabel><ul>{eligibility.map(item=><li key={item}>{item}</li>)}</ul></article><article><TechnicalLabel>Payment</TechnicalLabel><ul>{payments.map(item=><li key={item}>{item}</li>)}</ul></article></div>
      <a className="partner-mail" href="mailto:cyphrixsupport@cyphrixtech.com"><span>Start a partnership</span><strong>cyphrixsupport@cyphrixtech.com</strong><i><ArrowUpRight/></i></a>
    </div></section>
  </div>;
}
