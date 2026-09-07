import { useState } from "react";
import { Link } from "react-router-dom";
import { CATALOG, VERTICALS } from "../../data/site";

export default function Services() {
  const [q, setQ] = useState("");
  const all = CATALOG.flatMap(c => c.items.map(it => ({ ...it, vertical: c.vertical })));
  const list = all.filter(it =>
    (it.name + " " + it.vertical + " " + it.docs).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">Services</div>
      <h1 className="font-display font-bold text-[#0F2440] text-3xl sm:text-4xl tracking-tight mt-1">Everything, with its document checklist.</h1>
      <p className="text-slate-500 mt-2 max-w-2xl text-[15px]">Browse the same catalogue our branches use — mandatory documents, realistic timelines, PT-tracked execution.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {VERTICALS.map(v => (
          <div key={v.id} className="rounded-2xl border border-slate-200 p-5 hover:border-[#C6A664]/60 hover:shadow-glow transition-all">
            <div className="text-2xl">{v.icon}</div>
            <div className="font-bold text-[#0F2440] mt-2">{v.title}</div>
            <div className="text-[13px] text-slate-500 mt-1">{v.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h2 className="font-display font-bold text-[#0F2440] text-xl">Full catalogue ({all.length} services)</h2>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search — e.g. khata, GST, fleet…"
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#C6A664]/60" />
      </div>

      <div className="mt-4 space-y-6">
        {(q ? [{ vertical: `Results for “${q}” (${list.length})`, items: list }] : CATALOG.map(c => ({ ...c, items: c.items }))).map(group => (
          <div key={group.vertical}>
            <div className="font-bold text-[#0F2440] text-sm tracking-wide uppercase">{group.vertical}</div>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              {(group.items as typeof all).map(it => (
                <div key={it.name} className="rounded-2xl border border-slate-200 p-4 flex justify-between gap-3 hover:border-[#C6A664]/60 transition-colors">
                  <div>
                    <div className="font-bold text-[#0F2440] text-sm">{it.name}</div>
                    <div className="text-[12px] text-slate-500 mt-1">📄 {it.docs}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg whitespace-nowrap">{it.time}</div>
                    <Link to="/contact" className="text-[12px] font-bold text-[#A88A4A] hover:text-[#0F2440] mt-2 inline-block">Get quote →</Link>
                  </div>
                </div>
              ))}
              {(group.items as typeof all).length === 0 && (
                <div className="text-sm text-slate-400">No matches — call +91 89519 37171, we likely still do it.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-[#0F2440] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-display font-bold text-xl">Not sure which service you need?</div>
          <div className="text-sm text-white/60 mt-1">Describe your situation — a domain expert maps it to the right filing in one call.</div>
        </div>
        <Link to="/contact" className="px-6 py-3 rounded-xl font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] text-sm shrink-0">Talk to an Expert</Link>
      </div>
    </div>
  );
}
