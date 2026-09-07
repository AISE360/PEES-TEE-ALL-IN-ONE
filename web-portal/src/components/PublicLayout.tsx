import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { SITE } from "../data/site";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/track", label: "Track" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const isHome = loc.pathname === "/";

  return (
    <div className="min-h-screen bg-white text-[#0F172A] antialiased flex flex-col">
      {/* Top utility bar */}
      <div className="bg-[#0F2440] text-white/80 text-[12px]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <a href={`tel:${SITE.helpline.replace(/\s/g, "")}`} className="hover:text-white truncate">📞 {SITE.helpline}</a>
            <a href={`mailto:${SITE.email}`} className="hover:text-white hidden sm:inline">✉️ {SITE.email}</a>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-white/60">{SITE.hours}</span>
            <Link to="/track" className="text-[#E8D9B8] hover:text-white font-semibold">Track PT Request →</Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="PEES Tee Group" className="w-11 h-11 rounded-xl object-contain ring-1 ring-slate-200 bg-white p-1" />
            <div className="leading-tight">
              <div className="font-display font-bold text-[#0F2440] text-[16px]">PEES Tee Group</div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#A88A4A] font-semibold">Pvt. Ltd. · Est. Trust</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"}
                className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#0F2440] text-white" : "text-slate-600 hover:text-[#0F2440] hover:bg-slate-100"}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Link to="/contact" className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#0F2440] border border-[#0F2440]/20 hover:bg-slate-50">Request a Quote</Link>
            <Link to="/dashboard" className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#0F2440] bg-gradient-to-br from-[#C6A664] to-[#E0C88A] hover:shadow-glow">Staff Login</Link>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
            <span className="text-xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-slide-down">
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-[#0F2440] text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/contact" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold border border-[#0F2440]/20">Request a Quote</Link>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-br from-[#C6A664] to-[#E0C88A] text-[#0F2440]">Staff Login</Link>
            </div>
          </div>
        )}
      </header>

      <main className={isHome ? "flex-1" : "flex-1"}>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0F2440] text-white mt-0">
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="w-10 h-10 rounded-lg bg-white p-1 object-contain" />
              <div className="font-display font-bold">PEES Tee Group Pvt. Ltd.</div>
            </div>
            <p className="text-sm text-white/60 mt-3 leading-relaxed">{SITE.tagline} {SITE.heroSub}</p>
            <div className="text-sm text-white/60 mt-4 space-y-1">
              <div>📞 {SITE.helpline} · ☎️ {SITE.landline}</div>
              <div>✉️ {SITE.email}</div>
              <div>🌐 {SITE.website}</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-[#E8D9B8] text-sm tracking-wider uppercase mb-4">Services</div>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/services" className="hover:text-white">Land Purchase & Due Diligence</Link></li>
              <li><Link to="/services" className="hover:text-white">Survey, Fencing & Site Prep</Link></li>
              <li><Link to="/services" className="hover:text-white">Layouts & Development</Link></li>
              <li><Link to="/services" className="hover:text-white">Khata · EC · Mutation · DC Conversion</Link></li>
              <li><Link to="/services" className="hover:text-white">GST · MSME · Company Setup</Link></li>
              <li><Link to="/services" className="hover:text-white">Cargo · Warehousing · Fleet</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#E8D9B8] text-sm tracking-wider uppercase mb-4">Company</div>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/track" className="hover:text-white">Track Application (PT Ref)</Link></li>
              <li><Link to="/contact" className="hover:text-white">Request a Quote</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Staff / Operations Login</Link></li>
              <li><Link to="/services" className="hover:text-white">Documents Checklist</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#E8D9B8] text-sm tracking-wider uppercase mb-4">Head Office</div>
            <p className="text-sm text-white/70 leading-relaxed">{SITE.address}<br />Regd: #60, 10th Cross, Masjid Road, Devasandra, Bengaluru - 560036</p>
            <p className="text-sm text-white/60 mt-2">{SITE.hours}</p>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`} target="_blank" rel="noreferrer"
              className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20">📍 Get Directions</a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
            <span>© 2026 PEES Tee Group Pvt Ltd. All rights reserved.</span>
            <span>APPLIED → CONNECTED → IN_PROCESSING → COMPLETED · PT-tracked · Audit-ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
