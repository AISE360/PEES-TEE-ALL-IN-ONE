import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SITE, STATS, VERTICALS, CATALOG, PROCESS, BRANCHES, TESTIMONIALS, FAQS } from "../../data/site";
import { apiFetch } from "../../lib/api";

export default function Home() {
  const nav = useNavigate();
  const [ref, setRef] = useState("");
  const [q, setQ] = useState({ name: "", phone: "", service: "E-Khata / New Khata Registration", msg: "" });
  const [qsent, setQsent] = useState("");
  const [qbusy, setQbusy] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.name.trim() || !q.phone.trim()) { setQsent("Please add your name and phone number."); return; }
    setQbusy(true);
    try {
      const r = await apiFetch("/api/client-requests", {
        method: "POST",
        body: JSON.stringify({ serviceType: q.service, description: `${q.name} · ${q.phone} — ${q.msg || "Website quote request"}`, preferredContactTime: "ASAP", clientName: q.name, clientPhone: q.phone }),
      });
      if (r.success) setQsent(`Request received! Your reference is ${r.data.reference}. Our team will call ${q.phone} shortly.`);
      else setQsent("Request noted! Call " + SITE.helpline + " for instant confirmation. (" + (r.error || "offline") + ")");
    } catch {
      setQsent("You're offline — call " + SITE.helpline + " and we'll raise the request for you.");
    }
    setQbusy(false);
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0F2440]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#C6A664]/15 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full bg-[#1C64F2]/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "26px 26px" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-12 lg:pt-20 lg:pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12px] text-[#E8D9B8] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" /> {SITE.tagline} · Pan-India Service
            </div>
            <h1 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] mt-5 tracking-tight">
              Land Development,<br />Documentation & <span className="text-gradient">Logistics</span> — Done Right.
            </h1>
            <p className="text-white/70 text-[15px] lg:text-base mt-4 leading-relaxed max-w-xl">{SITE.heroSub}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/contact" className="px-6 py-3 rounded-xl font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] hover:shadow-glow-lg btn-press text-sm">Request a Quote</Link>
              <button onClick={() => nav("/track")} className="px-6 py-3 rounded-xl font-bold text-white border border-white/25 hover:bg-white/10 btn-press text-sm">Track PT Reference</button>
              <a href={`tel:${SITE.helpline.replace(/\s/g, "")}`} className="px-6 py-3 rounded-xl font-bold text-white/90 hover:text-white text-sm">📞 {SITE.helpline}</a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-[12px] text-white/60">
              <span>✔ 30-yr EC & advocate-verified titles</span>
              <span>✔ DGPS + Mojini licensed surveyors</span>
              <span>✔ 24/7 GPS-tracked insured fleet</span>
            </div>
          </div>

          {/* Tracker + stats card */}
          <div className="animate-slide-left">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-modal">
              <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#A88A4A]">Live Application Tracker</div>
              <h3 className="font-display font-bold text-[#0F2440] text-xl mt-1">Where is my file?</h3>
              <p className="text-sm text-slate-500 mt-1">Enter your PT reference — e.g. <span className="font-mono font-bold text-[#0F2440]">PT48213</span></p>
              <form onSubmit={e => { e.preventDefault(); if (ref.trim()) nav(`/track?ref=${encodeURIComponent(ref.trim().toUpperCase())}`); }} className="flex gap-2 mt-4">
                <input value={ref} onChange={e => setRef(e.target.value)} placeholder="PT + 5 digits"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#C6A664]/60 focus:border-[#C6A664]" />
                <button className="px-5 py-3 rounded-xl bg-[#0F2440] text-white text-sm font-bold hover:bg-[#1D3050] btn-press">Track</button>
              </form>
              <div className="grid grid-cols-4 gap-2 mt-5">
                {["APPLIED", "CONNECTED", "IN_PROCESSING", "COMPLETED"].map((s, i) => (
                  <div key={s} className="text-center">
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${i === 0 ? "bg-[#0F2440] text-white" : "bg-slate-100 text-slate-400"}`}>{i + 1}</div>
                    <div className="text-[9px] font-bold text-slate-500 mt-1 leading-tight">{s.replace("_", " ")}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
                {STATS.map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-display font-bold text-[#0F2440] text-xl">{s.value}</div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-[#F7F8FA] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] font-semibold text-slate-500">
          <span>BBMP · BDA · BMRDA</span><span className="text-slate-300">|</span>
          <span>Bhoomi · Mojini · Kaveri</span><span className="text-slate-300">|</span>
          <span>GST · MSME/Udyam · IEC</span><span className="text-slate-300">|</span>
          <span>RERA Guidance</span><span className="text-slate-300">|</span>
          <span>GPS Fleet · E-Way Bills</span>
        </div>
      </section>

      {/* ── VERTICALS ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">What we do</div>
            <h2 className="font-display font-bold text-[#0F2440] text-2xl sm:text-3xl mt-1 tracking-tight">Six verticals. One accountable partner.</h2>
          </div>
          <Link to="/services" className="text-sm font-bold text-[#0F2440] hover:underline shrink-0">Full service catalogue →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {VERTICALS.map((v, i) => (
            <div key={v.id} className={`glass-card rounded-2xl p-6 stagger-${(i % 6) + 1} animate-slide-up`}>
              <div className="w-12 h-12 rounded-2xl bg-[#0F2440] text-2xl flex items-center justify-center">{v.icon}</div>
              <h3 className="font-display font-bold text-[#0F2440] mt-4">{v.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{v.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {v.points.map(p => <li key={p} className="text-[13px] text-slate-600 flex gap-2"><span className="text-emerald-600 font-bold">✓</span>{p}</li>)}
              </ul>
              <Link to="/services" className="inline-block mt-4 text-[13px] font-bold text-[#A88A4A] hover:text-[#0F2440]">View services →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATALOG PREVIEW ── */}
      <section className="bg-[#0F2440] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#E8D9B8]">Popular right now</div>
          <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mt-1 tracking-tight">Fixed-scope services with clear documents & timelines</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {CATALOG.slice(0, 2).map(c => (
              <div key={c.vertical} className="bg-white/[0.06] border border-white/10 rounded-2xl p-5">
                <div className="font-bold text-[#E8D9B8] text-sm">{c.vertical}</div>
                <div className="mt-3 space-y-2.5">
                  {c.items.slice(0, 4).map(it => (
                    <div key={it.name} className="flex items-start justify-between gap-3 bg-white rounded-xl px-4 py-3">
                      <div>
                        <div className="text-sm font-bold text-[#0F2440]">{it.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">📄 {it.docs}</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg whitespace-nowrap">{it.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link to="/services" className="inline-block mt-6 px-6 py-3 rounded-xl font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] text-sm">Browse all 18+ services</Link>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">How it works</div>
        <h2 className="font-display font-bold text-[#0F2440] text-2xl sm:text-3xl mt-1 tracking-tight">Tracked on a PT reference, from first call to handover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {PROCESS.map((p, i) => (
            <div key={p.stage} className="relative rounded-2xl border border-slate-200 p-5 hover:border-[#C6A664]/60 hover:shadow-glow transition-all">
              <div className="font-mono font-bold text-[11px] text-white bg-[#0F2440] inline-block px-2.5 py-1 rounded-lg">{i + 1} · {p.stage.replace("_", " ")}</div>
              <h3 className="font-bold text-[#0F2440] mt-3">{p.title}</h3>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRANCHES ── */}
      <section className="bg-[#F7F8FA] border-y border-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">Visit us</div>
          <h2 className="font-display font-bold text-[#0F2440] text-2xl sm:text-3xl mt-1 tracking-tight">Branches & site offices</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {BRANCHES.map(b => (
              <div key={b.name} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="font-bold text-[#0F2440] text-sm">{b.name}</div>
                <div className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{b.addr}</div>
                <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="text-[13px] font-bold text-[#0F2440] mt-2 block">{b.phone}</a>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(b.maps)}`} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-[#A88A4A] hover:text-[#0F2440] mt-1 inline-block">Get directions →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS + QUOTE ── */}
      <section className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">Client endorsements</div>
          <h2 className="font-display font-bold text-[#0F2440] text-2xl sm:text-3xl mt-1 tracking-tight">Why Bengaluru trusts PEES Tee</h2>
          <div className="space-y-4 mt-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-card rounded-2xl p-5">
                <div className="text-[#C6A664] tracking-widest">★★★★★</div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">“{t.text}”</p>
                <div className="mt-3 text-[13px]"><span className="font-bold text-[#0F2440]">{t.name}</span><span className="text-slate-400"> · {t.role}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-[#0F2440] rounded-3xl p-6 sm:p-8 text-white lg:sticky lg:top-24">
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#E8D9B8]">Request a quote</div>
            <h3 className="font-display font-bold text-2xl mt-1">Get a callback in 30 minutes*</h3>
            <p className="text-sm text-white/60 mt-1">Working hours · {SITE.hours}</p>
            <form onSubmit={submitQuote} className="mt-5 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={q.name} onChange={e => setQ({ ...q, name: e.target.value })} placeholder="Full name"
                  className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]" />
                <input value={q.phone} onChange={e => setQ({ ...q, phone: e.target.value })} placeholder="Phone / WhatsApp"
                  className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]" />
              </div>
              <select value={q.service} onChange={e => setQ({ ...q, service: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]">
                {CATALOG.flatMap(c => c.items).map(it => <option key={it.name}>{it.name}</option>)}
              </select>
              <textarea value={q.msg} onChange={e => setQ({ ...q, msg: e.target.value })} placeholder="Tell us briefly — survey no., address, cargo route…"
                rows={3} className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A664]" />
              <button disabled={qbusy} className="w-full py-3 rounded-xl font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] text-sm disabled:opacity-60 btn-press">
                {qbusy ? "Sending…" : "Request Callback"}
              </button>
              {qsent && <div className="text-[13px] bg-white/10 border border-white/15 rounded-xl px-4 py-3">{qsent}</div>}
            </form>
            <div className="text-[12px] text-white/50 mt-4">Prefer to talk? <a className="text-[#E8D9B8] font-bold" href={`tel:${SITE.helpline.replace(/\s/g, "")}`}>{SITE.helpline}</a> · <a className="text-[#E8D9B8] font-bold" href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="font-display font-bold text-[#0F2440] text-2xl sm:text-3xl tracking-tight text-center">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`rounded-2xl border transition-colors ${faq === i ? "border-[#C6A664]/60 shadow-glow" : "border-slate-200"}`}>
              <button onClick={() => setFaq(faq === i ? null : i)} className="w-full text-left px-5 py-4 flex justify-between gap-3 items-center">
                <span className="font-bold text-[#0F2440] text-sm">{f.q}</span>
                <span className="text-[#A88A4A] font-bold">{faq === i ? "−" : "+"}</span>
              </button>
              {faq === i && <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
