import { ArrowUpRight, Check, ExternalLink, Linkedin, Mail } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "../api/client";
import { MaskedHeading, TechnicalLabel } from "./Experience";

const team=[
  {name:"Rutvik Gujarati",role:"Lead Smart Contract Developer",linkedin:"https://www.linkedin.com/in/rutvik-gujarati/",upwork:"https://www.upwork.com/freelancers/~01344498305b18074d"},
  {name:"Vishal Baraiya",role:"Senior Smart Contract Auditor",linkedin:"https://www.linkedin.com/in/vishal-baraiya-05989a151/",upwork:"https://www.upwork.com/freelancers/~01584c56637012678c"},
];

export default function ContactPage(){
  const [data,setData]=useState({name:"",company:"",email:"",message:""});const [otp,setOtp]=useState("");const [otpSent,setOtpSent]=useState(false);const [verified,setVerified]=useState(false);const [busy,setBusy]=useState<"idle"|"otp"|"verify"|"submit"|"success">("idle");const [error,setError]=useState("");
  const change=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{setData({...data,[event.target.name]:event.target.value});if(event.target.name==="email"){setVerified(false);setOtpSent(false)}};
  const sendOtp=async()=>{if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)){setError("Enter a valid email");return}setBusy("otp");setError("");try{await api.sendOtp(data.email);setOtpSent(true);setBusy("idle")}catch(cause){setError(cause instanceof Error?cause.message:"Failed to send code");setBusy("idle")}};
  const verify=async()=>{if(!/^\d{6}$/.test(otp)){setError("Enter the 6-digit code");return}setBusy("verify");try{await api.verifyOtp(data.email,otp);setVerified(true);setOtp("");setBusy("idle")}catch(cause){setError(cause instanceof Error?cause.message:"Invalid code");setBusy("idle")}};
  const submit=async(event:FormEvent)=>{event.preventDefault();if(!verified){setError("Verify your email first");return}setBusy("submit");setError("");try{await api.sendEmail({type:"contact",subject:`Contact: ${data.name}`,name:data.name,email:data.email,company:data.company,message:data.message});setBusy("success");setData({name:"",company:"",email:"",message:""});setVerified(false);setOtpSent(false)}catch(cause){setError(cause instanceof Error?cause.message:"Could not send message");setBusy("idle")}};
  return <div className="contact-page route-experience">
    <header className="page-hero route-hero"><div className="container"><TechnicalLabel live>Direct Contact</TechnicalLabel><MaskedHeading as="h1">Let’s make it<br/><em>secure by design.</em></MaskedHeading><p>Tell us what you’re building. We’ll route it to the right specialist.</p></div></header>
    <section className="contact-section"><div className="container contact-grid">
      <aside className="contact-aside"><Mail/><TechnicalLabel>Contact</TechnicalLabel><a href="mailto:cyphrixsupport@cyphrixtech.com">cyphrixsupport@cyphrixtech.com</a><p>Smart-contract audits, architecture, testing, and security consulting.</p></aside>
      <form className="intake-form" onSubmit={submit}><header><TechnicalLabel>Send a message</TechnicalLabel><span>Secure channel</span></header>
        <div className="field-grid"><label>Full name<input name="name" value={data.name} onChange={change} required/></label><label>Company<input name="company" value={data.company} onChange={change}/></label></div>
        <label>Work email<div className="verified-field"><input type="email" name="email" value={data.email} onChange={change} required readOnly={verified}/>{verified?<span><Check/>Verified</span>:<button type="button" onClick={sendOtp}>{busy==="otp"?"Sending…":"Send code"}</button>}</div></label>
        {otpSent&&!verified&&<label>Verification code<div className="verified-field"><input value={otp} onChange={event=>setOtp(event.target.value.replace(/\D/g,""))} inputMode="numeric" maxLength={6} placeholder="000000"/><button type="button" onClick={verify}>{busy==="verify"?"Checking…":"Verify"}</button></div></label>}
        <label>Message<textarea name="message" value={data.message} onChange={change} rows={5} placeholder="A short overview is enough" required/></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button button--primary intake-submit" disabled={!verified||busy==="submit"||busy==="success"}>{busy==="submit"?"Sending…":busy==="success"?"Message sent ✓":"Send message"}</button>
      </form>
    </div></section>
    <section className="team-section"><div className="container"><header><TechnicalLabel>Technical Leadership</TechnicalLabel><h2>Talk to the people<br/>doing the work.</h2></header><div>{team.map(member=><article key={member.name}><div className="team-avatar">{member.name.split(" ").map(part=>part[0]).join("")}</div><h3>{member.name}</h3><p>{member.role}</p><footer><a href={member.linkedin} target="_blank" rel="noreferrer"><Linkedin/>LinkedIn</a><a href={member.upwork} target="_blank" rel="noreferrer"><ExternalLink/>Upwork</a></footer></article>)}</div></div></section>
    <a className="contact-final" href="/request-audit"><span>Ready for a scoped review?</span><strong>Request an audit</strong><i><ArrowUpRight/></i></a>
  </div>;
}
