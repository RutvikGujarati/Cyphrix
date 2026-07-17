import { Check, ShieldCheck } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "../api/client";
import { MaskedHeading, TechnicalLabel } from "./Experience";

export default function RequestAuditPage(){
  const [formData,setFormData]=useState({projectName:"",contactEmail:"",telegram:"",auditType:"Smart Contract Audit",blockchain:"Ethereum",additionalNotes:""});
  const [otp,setOtp]=useState("");
  const [otpSent,setOtpSent]=useState(false);
  const [verified,setVerified]=useState(false);
  const [busy,setBusy]=useState<"idle"|"otp"|"verify"|"submit"|"success">("idle");
  const [error,setError]=useState("");
  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const change=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{setFormData({...formData,[event.target.name]:event.target.value});if(event.target.name==="contactEmail"){setVerified(false);setOtpSent(false)}};
  const sendOtp=async()=>{if(!emailRegex.test(formData.contactEmail)){setError("Enter a valid work email");return}setBusy("otp");setError("");try{await api.sendOtp(formData.contactEmail);setOtpSent(true);setBusy("idle")}catch(cause){setError(cause instanceof Error?cause.message:"Failed to send code");setBusy("idle")}};
  const verifyOtp=async()=>{if(!/^\d{6}$/.test(otp)){setError("Enter the 6-digit code");return}setBusy("verify");setError("");try{await api.verifyOtp(formData.contactEmail,otp);setVerified(true);setOtp("");setBusy("idle")}catch(cause){setError(cause instanceof Error?cause.message:"Invalid code");setBusy("idle")}};
  const submit=async(event:FormEvent)=>{event.preventDefault();if(!verified){setError("Verify your email first");return}setBusy("submit");setError("");try{await api.sendEmail({type:"audit",subject:`Audit Request: ${formData.auditType} — ${formData.projectName}`,name:formData.projectName,email:formData.contactEmail,audit:{auditType:formData.auditType,telegram:formData.telegram,details:{blockchain:formData.blockchain},notes:formData.additionalNotes}});setBusy("success")}catch(cause){setError(cause instanceof Error?cause.message:"Could not send request");setBusy("idle")}};
  return <div className="audit-request-page route-experience">
    <header className="page-hero route-hero"><div className="container"><TechnicalLabel live>Secure Intake</TechnicalLabel><MaskedHeading as="h1">Start with<br/><em>a clear scope.</em></MaskedHeading><p>Share the essentials. We’ll respond with the next step.</p></div></header>
    <section className="intake-section"><div className="container intake-grid">
      <aside className="intake-aside"><ShieldCheck/><TechnicalLabel>What happens next</TechnicalLabel><ol><li><span>01</span>Scope review</li><li><span>02</span>Timeline and estimate</li><li><span>03</span>Secure kickoff</li></ol><p>Typical response within 24 hours.</p></aside>
      <form className="intake-form" onSubmit={submit}>
        <header><TechnicalLabel>Audit Request</TechnicalLabel><span>All fields are confidential</span></header>
        <div className="field-grid"><label>Project name<input name="projectName" value={formData.projectName} onChange={change} placeholder="Protocol name" required/></label><label>Audit type<select name="auditType" value={formData.auditType} onChange={change}><option>Smart Contract Audit</option><option>Infrastructure Review</option><option>Formal Verification</option></select></label></div>
        <label>Work email<div className="verified-field"><input type="email" name="contactEmail" value={formData.contactEmail} onChange={change} placeholder="security@project.io" required readOnly={verified}/>{verified?<span><Check/>Verified</span>:<button type="button" onClick={sendOtp} disabled={busy==="otp"}>{busy==="otp"?"Sending…":"Send code"}</button>}</div></label>
        {otpSent&&!verified&&<label>Verification code<div className="verified-field"><input value={otp} onChange={(event)=>setOtp(event.target.value.replace(/\D/g,""))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000"/><button type="button" onClick={verifyOtp} disabled={busy==="verify"||otp.length!==6}>{busy==="verify"?"Checking…":"Verify"}</button></div></label>}
        <div className="field-grid"><label>Primary chain<select name="blockchain" value={formData.blockchain} onChange={change}><option>Ethereum</option><option>Solana</option><option>Base / L2</option></select></label><label>Telegram<input name="telegram" value={formData.telegram} onChange={change} placeholder="@identifier"/></label></div>
        <label>Project details<textarea name="additionalNotes" value={formData.additionalNotes} onChange={change} placeholder="Repository, scope, or architecture notes" rows={5}/></label>
        {error&&<p className="form-error" role="alert" aria-live="polite">{error}</p>}
        <button className="button button--primary intake-submit" type="submit" disabled={!verified||busy==="submit"||busy==="success"}>{busy==="submit"?"Sending…":busy==="success"?"Request sent ✓":"Submit scope"}</button>
      </form>
    </div></section>
  </div>;
}
