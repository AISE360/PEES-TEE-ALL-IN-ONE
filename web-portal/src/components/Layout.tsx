import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import {
  IconDashboard, IconClipboard, IconShield, IconUsers,
  IconCalendar, IconMapPin, IconBarChart, IconSettings,
  IconBell, IconX, IconCheck, IconMenu
} from "./Icons";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: IconDashboard },
  { label: "Client Requests", to: "/client-requests", icon: IconClipboard },
  { label: "Premium Apps", to: "/premium", icon: IconShield },
  { label: "Employees", to: "/employees", icon: IconUsers },
  { label: "HR & Leave", to: "/hr-leave", icon: IconCalendar },
  { label: "Field Tracking", to: "/field-tracking", icon: IconMapPin },
  { label: "Reports", to: "/reports", icon: IconBarChart },
  { label: "Settings", to: "/settings", icon: IconSettings },
  { label: "← View Website", to: "/", icon: IconMapPin },
];

function ToastNotification({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div className="animate-toast-in flex items-start gap-3 bg-navy-900 text-white px-5 py-4 rounded-2xl shadow-elevated max-w-sm">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
        <IconCheck size={14} className="text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{msg}</p>
        <div className="mt-2 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gold-500 rounded-full animate-progress-bar" />
        </div>
      </div>
      <button onClick={onClose} className="text-white/40 hover:text-white transition-colors shrink-0 mt-0.5">
        <IconX size={14} />
      </button>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<string[]>([]);
  const [bell, setBell] = useState(2);
  const [showNotifs, setShowNotifs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const s = io((import.meta as any).env?.VITE_API_URL || "http://localhost:4000");
    s.on("new_client_request", (p: any) => {
      setToasts(t => [...t, `New quote request: ${p.serviceType} — #${p.reference}`]);
      setBell(b => b + 1);
      setTimeout(() => setToasts(t => t.slice(1)), 4500);
    });
    s.on("new_premium_quote", (p: any) => {
      setToasts(t => [...t, `New KYC application: ${p.referenceNo}`]);
      setBell(b => b + 1);
    });
    s.on("stage_change", (p: any) =>
      setToasts(t => [...t.slice(-2), `Stage update: ${p.reference} → ${p.stage}`])
    );
    return () => { s.disconnect(); };
  }, []);

  // Close notification panel and mobile sidebar on page change
  useEffect(() => {
    setShowNotifs(false);
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex bg-[#F4F6FA] relative overflow-x-hidden">
      {/* ── Mobile Sidebar Backdrop Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`w-[260px] bg-sidebar flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 lg:static transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } relative overflow-hidden`}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors z-20"
          aria-label="Close Sidebar"
        >
          <IconX size={18} />
        </button>

        {/* Logo Section */}
        <div className="p-5 pb-4 flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-white/20 shrink-0 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="PEES Tee" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-white text-[15px] leading-tight tracking-tight">PEES Tee</div>
            <div className="text-[10px] text-gold-400 font-semibold tracking-wider uppercase">Head Office Portal</div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Navigation */}
        <nav className="p-3 flex-1 space-y-0.5 relative z-10 mt-1 overflow-y-auto">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-gold-500/15 text-gold-400 shadow-glow"
                    : "text-white/55 hover:text-white/90 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold-500 rounded-r-full" />
                  )}
                  <n.icon size={18} className={`shrink-0 transition-colors ${isActive ? "text-gold-400" : "text-white/40 group-hover:text-white/70"}`} />
                  <span>{n.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 relative z-10">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
          <div className="flex items-center gap-2 text-[11px] text-white/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            <span>System Online</span>
          </div>
          <div className="text-[10px] text-white/20 mt-1.5">© 2026 PEES Tee Group Pvt Ltd</div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[64px] glass border-b border-navy-100/30 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-800 transition-colors flex items-center justify-center active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <IconMenu size={20} />
            </button>

            <div>
              <h1 className="font-display font-semibold text-navy-900 text-[14px] sm:text-[15px] leading-tight">Operations Console</h1>
              <p className="text-[10px] sm:text-[11px] text-navy-400">Head Office — Real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search hint */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-400 text-xs cursor-pointer hover:bg-navy-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-navy-400 shadow-sm border">⌘K</kbd>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) setBell(0); }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-50 hover:bg-navy-100 flex items-center justify-center transition-colors relative"
              >
                <IconBell size={18} className="text-navy-600" />
                {bell > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold animate-scale-in ring-2 ring-white">
                    {bell > 9 ? "9+" : bell}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl shadow-modal border border-navy-100/50 animate-slide-down overflow-hidden z-50">
                  <div className="p-4 border-b border-navy-100/50 flex items-center justify-between">
                    <span className="font-display font-semibold text-navy-900 text-sm">Notifications</span>
                    <button onClick={() => setShowNotifs(false)} className="text-navy-400 hover:text-navy-600"><IconX size={16} /></button>
                  </div>
                  <div className="p-4 text-sm text-navy-500 text-center py-8">
                    <IconBell size={24} className="mx-auto mb-2 text-navy-300" />
                    All caught up!
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-navy-100" />

            {/* User Avatar */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 text-white flex items-center justify-center font-display font-bold text-xs ring-2 ring-navy-100 group-hover:ring-gold-400/40 transition-all">
                AD
              </div>
              <div className="hidden sm:block">
                <div className="text-[13px] font-semibold text-navy-900 leading-tight">Admin</div>
                <div className="text-[11px] text-navy-400">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Toast Layer */}
        <div className="fixed top-[72px] right-4 sm:right-6 space-y-2 z-50">
          {toasts.map((t, i) => (
            <ToastNotification key={i + t} msg={t} onClose={() => setToasts(ts => ts.filter((_, j) => j !== i))} />
          ))}
        </div>

        {/* Page Content with animation */}
        <main key={location.pathname} className="p-4 sm:p-6 lg:p-8 flex-1 overflow-auto animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
