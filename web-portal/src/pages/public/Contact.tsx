import { useState } from "react";
import { SITE, BRANCHES } from "../../data/site";
import { apiFetch } from "../../lib/api";

export default function Contact() {
  const [f, setF] = useState({ name: "", phone: "", service: "Property Documentation", msg: "" });
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim()) { setOut("Please add your name and phone number."); return; }
    setBusy(true);
    try {
      const r = await apiFetch("/api/client-requests", {
        method: "POST",
        body: JSON.stringify({ serviceType: f.service, description: `${f.name} · ${f.phone} — ${f.msg || "Website contact form"}`, preferredContactTime: "ASAP", clientName: f.name, clientPhone: f.phone }),
      });
      setOut(r.success ? `Thank you, ${f.name}! Reference ${r.data.reference} created — we'll call ${f.phone} shortly.` : "Noted! Call " + SITE.helpline + " for instant confirmation.");
    } catch {
      setOut("You're offline — please call " + SITE.helpline + " and we'll help immediately.");
    }
    setBusy(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8">
      <div>
        <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">Contact</div>
        <h1 className="font-display font-bold text-[#0F2440] text-3xl sm:text-4xl tracking-tight mt-1">Talk to the right desk, first time.</h1>
        <p className="text-slate-500 mt-2 text-[15px]">Land, legal or logistics — your message lands with a domain expert, not a generic inbox.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <a href={`tel:${SITE.helpline.replace(/\s/g, "")}`} className="rounded-2xl border border-slate-200 p-5 hover:border-[#C6A664]/60">
            <div className="text-2xl">📞</div><div className="font-bold text-[#0F2440] text-sm mt-2">Helpline</div><div className="text-sm text-slate-500">{SITE.helpline}</div>
          </a>
          <a href={`mailto:${SITE.email}`} className="rounded-2xl border border-slate-200 p-5 hover:border-[#C6A664]/60">
            <div className="text-2xl">✉️</div><div className="font-bold text-[#0F2440] text-sm mt-2">Email</div><div className="text-sm text-slate-500">{SITE.email}</div>
          </a>
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-2xl">🕘</div><div className="font-bold text-[#0F2440] text-sm mt-2">Hours</div><div className="text-sm text-slate-500">{SITE.hours}</div>
          </div>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 p-5 hover:border-[#C6A664]/60">
            <div className="text-2xl">📍</div><div className="font-bold text-[#0F2440] text-sm mt-2">Head Office</div><div className="text-[13px] text-slate-500">{SITE.address}</div>
          </a>
        </div>
        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200" style={{ height: 260 }}>
          <iframe title="PEES Tee map" width="100%" height="260" style={{ border: 0 }} loading="lazy"
            src="https://maps.google.com/maps?q=HBR+Layout,Bengaluru,Karnataka+560043&t=&z=14&ie=UTF8&iwloc=&output=embed" />
        </div>
        <div className="mt-4 space-y-2">
          {BRANCHES.map(b => (
            <div key={b.name} className="text-[13px] text-slate-500"><b className="text-[#0F2440]">{b.name}:</b> {b.addr} · {b.phone}</div>
          ))}
        </div>
      </div>
      <div>
        <form onSubmit={send} className="bg-[#0F2440] text-white rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
          <div className="font-display font-bold text-2xl">Request a quote</div>
          <p className="text-sm text-white/60 mt-1">Creates a PT-tracked request instantly.</p>
          <div className="mt-5 space-y-3">
            <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Full name"
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]" />
            <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="Phone / WhatsApp"
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]" />
            <select value={f.service} onChange={e => setF({ ...f, service: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]">
              {["Property Documentation", "Land Purchase & Due Diligence", "Land Survey & DGPS", "Layout / Development", "GST / MSME / Company Setup", "Cargo / Warehousing / Fleet", "Other"].map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} rows={4}
              placeholder="Plot / survey no., address, cargo route, timeline…"
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]" />
            <button disabled={busy} className="w-full py-3 rounded-xl font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] text-sm disabled:opacity-60 btn-press">
              {busy ? "Sending…" : "Send Request"}
            </button>
            {out && <div className="text-[13px] bg-white/10 border border-white/15 rounded-xl px-4 py-3">{out}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
