import { Link } from "react-router-dom";
import { SITE, PROCESS } from "../../data/site";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">About</div>
      <h1 className="font-display font-bold text-[#0F2440] text-3xl sm:text-4xl tracking-tight mt-1">Building Trust. Developing Land.</h1>
      <p className="text-slate-500 mt-3 max-w-3xl text-[15px] leading-relaxed">
        PEES Tee Group Pvt. Ltd. is a Bengaluru-headquartered corporate services group spanning verified land
        acquisition, land improvement & development, end-to-end property documentation, government & business
        registrations, and GPS-tracked cargo, warehousing & logistics. Every engagement is PT-tracked
        (APPLIED → CONNECTED → IN_PROCESSING → COMPLETED), advocate-vetted and handover-ready with stamped
        acknowledgments and GST invoices.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          { t: "Legal-first", d: "All land titles and statutory clearances are vetted by senior legal experts and government advocates — including 30-year EC audits before you pay a rupee." },
          { t: "Licensed field execution", d: "Boundary & DGPS surveys run via licensed surveyors with Mojini integration, GPS coordinates and AutoCAD handover — not approximations." },
          { t: "Logistics-grade reliability", d: "The same discipline runs our freight desk: 24/7 GPS fleet tracking, e-way bill compliance, insured transit and live dispatch updates." },
        ].map(c => (
          <div key={c.t} className="glass-card rounded-2xl p-6">
            <div className="font-display font-bold text-[#0F2440] text-lg">{c.t}</div>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 p-6 sm:p-8">
        <h2 className="font-display font-bold text-[#0F2440] text-xl">How every file moves</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {PROCESS.map((p, i) => (
            <div key={p.stage}>
              <div className="font-mono text-[11px] font-bold text-white bg-[#0F2440] inline-block px-2.5 py-1 rounded-lg">{i + 1} · {p.stage.replace("_", " ")}</div>
              <div className="font-bold text-[#0F2440] text-sm mt-2">{p.title}</div>
              <div className="text-[13px] text-slate-500 mt-1">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-[#0F2440] text-white p-6 sm:p-8">
          <div className="font-display font-bold text-xl">Compliance you can audit</div>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li>✔ 30-year EC + advocate title opinion on every purchase file</li>
            <li>✔ Aadhaar / PAN / EC / title-deed verification before acknowledgment</li>
            <li>✔ Stamped application acknowledgments + GST invoice on every payment</li>
            <li>✔ PT reference + government acknowledgment numbers saved per file</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 p-6 sm:p-8">
          <div className="font-display font-bold text-[#0F2440] text-xl">Work with us</div>
          <p className="text-sm text-slate-500 mt-2">Head office: {SITE.address}. Call <b>{SITE.helpline}</b> or write to <b>{SITE.email}</b>.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link to="/contact" className="px-6 py-3 rounded-xl font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] text-sm">Request a Quote</Link>
            <Link to="/services" className="px-6 py-3 rounded-xl font-bold text-[#0F2440] border border-[#0F2440]/20 text-sm">Browse Services</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
