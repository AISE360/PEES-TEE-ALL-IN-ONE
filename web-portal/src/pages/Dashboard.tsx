import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../lib/api";
import {
  IconClipboard, IconFileText, IconUsers, IconCalendar,
  IconTrendingUp, IconEye, IconDownload, IconSend, IconX,
  IconCheck, IconActivity, IconMapPin, IconClock, IconFlag
} from "../components/Icons";

const MAPS_KEY = "AIzaSyD77yl0_MV4lnaax5oko7kg_ouls224cYA";

const KPI_CONFIG = [
  { key: "totalRequests", label: "Total Requests", icon: IconClipboard, gradient: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" },
  { key: "pendingPremium", label: "Pending KYC", icon: IconFileText, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
  { key: "activeField", label: "Active Staff", icon: IconUsers, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
  { key: "leavesPending", label: "Leaves Pending", icon: IconCalendar, gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" },
];

const STAGE_STYLE: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-600",
  CONNECTED: "bg-blue-50 text-blue-600",
  IN_PROCESSING: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

function AnimatedCounter({ value }: { value: number | string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = typeof value === "number" ? value : parseInt(value as string) || 0;
    if (num === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(num / 20));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(start);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [reqs, setReqs] = useState<any[]>([]);
  const [premiums, setPremiums] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [stage, setStage] = useState("");
  const [toast, setToast] = useState("");
  const [stageBusy, setStageBusy] = useState(false);
  const [premBusy, setPremBusy] = useState<string | null>(null);
  const [directive, setDirective] = useState("");
  const dirRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    apiFetch("/api/portal/dashboard").then(r => setData(r.data));
    apiFetch("/api/client-requests").then(r => setReqs(r.data || []));
    apiFetch("/api/premium-applications").then(r => setPremiums(r.data || []));
    apiFetch("/api/directives/today").then(r => { if (r.data?.message) setDirective(r.data.message); });
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const updateStage = async () => {
    if (!selected || !stage) return;
    setStageBusy(true);
    const r = await apiFetch(`/api/client-requests/${selected.id}/stage`, { method: "PATCH", body: JSON.stringify({ stage }) });
    setStageBusy(false);
    if (r.success) {
      setReqs(reqs.map(x => x.id === selected.id ? r.data : x));
      setSelected(r.data); setStage("");
      showToast(`Request ${r.data.reference} moved to ${stage}`);
    } else {
      showToast("Stage update failed: " + (r.error || "unknown"));
    }
  };

  const updatePremium = async (id: string, status: string) => {
    setPremBusy(id + status);
    const r = await apiFetch(`/api/premium-applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    setPremBusy(null);
    if (r.success) { setPremiums(prev => prev.map(x => x.id === id ? r.data : x)); showToast(`Application ${r.data.referenceNo} → ${status}`); }
  };

  const exportDossier = () => {
    if (!selected) return;
    const html = `<!DOCTYPE html><html><head><title>Dossier ${selected.reference}</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#0F2440;max-width:800px;margin:0 auto}h2{font-size:20px;margin-bottom:4px}h3{color:#3A567D;font-size:16px;margin-top:32px;border-bottom:2px solid #C6A664;padding-bottom:8px}table{width:100%;border-collapse:collapse;margin-top:12px}td,th{border:1px solid #E2E8F0;padding:10px 12px;text-align:left;font-size:13px}th{background:#F8FAFC;font-weight:600}.badge{display:inline-block;padding:3px 12px;border-radius:999px;font-size:11px;font-weight:600;background:#FEF3C7;color:#92400E}</style></head>
      <body><div style="display:flex;align-items:center;gap:12px;margin-bottom:4px"><div style="width:40px;height:40px;background:#0F2440;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#C6A664;font-weight:900;font-size:16px">PT</div><div><h2 style="margin:0">PEES Tee Group Pvt Ltd</h2><p style="margin:0;font-size:12px;color:#64748B">HBR Layout, Bengaluru – 560043</p></div></div><hr style="border:none;border-top:2px solid #C6A664;margin:16px 0"/>
      <h3>Client Request Dossier</h3>
      <table><tr><th>Field</th><th>Value</th></tr>
      <tr><td>Reference</td><td><b>${selected.reference}</b></td></tr>
      <tr><td>Service</td><td>${selected.serviceType}</td></tr>
      <tr><td>Description</td><td>${selected.description}</td></tr>
      <tr><td>Contact Time</td><td>${selected.preferredContactTime || "—"}</td></tr>
      <tr><td>Current Stage</td><td><span class="badge">${selected.stage}</span></td></tr>
      <tr><td>Created</td><td>${new Date(selected.createdAt).toLocaleString()}</td></tr></table>
      <h3>Milestone Timeline</h3>
      ${selected.stageHistory.map((h: any) => `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px"><div style="width:8px;height:8px;background:#C6A664;border-radius:50%;margin-top:5px;flex-shrink:0"></div><div><div style="font-weight:600;font-size:13px">${h.stage.replace("_", " ")}</div><div style="font-size:11px;color:#94A3B8">${new Date(h.at).toLocaleString()}</div></div></div>`).join("")}
      <p style="margin-top:40px;color:#94A3B8;font-size:11px;border-top:1px solid #E2E8F0;padding-top:12px">Generated by PEES Tee Portal on ${new Date().toLocaleString()}</p>
      </body></html>`;
    const w = window.open("", "_blank"); w?.document.write(html); w?.document.close(); w?.print();
  };

  const publishDirective = async () => {
    const msg = dirRef.current?.value || directive;
    if (!msg.trim()) { alert("Please enter a directive message."); return; }
    const r = await apiFetch("/api/directives", { method: "POST", body: JSON.stringify({ message: msg, createdBy: "admin" }) });
    if (r.success) showToast("Directive published — field app will show on next login");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-900 tracking-tight">Dashboard</h2>
          <p className="text-xs sm:text-sm text-navy-400 mt-0.5">Welcome back — here's your operations overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-navy-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
          <span>Live • Auto-refresh</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {KPI_CONFIG.map((kpi, i) => {
          const val = data?.[kpi.key] ?? "—";
          return (
            <div key={kpi.key} className={`glass-card rounded-2xl p-5 relative overflow-hidden group stagger-${i + 1} animate-slide-up`}>
              {/* Background icon */}
              <div className="absolute -right-2 -bottom-2 opacity-[0.04]">
                <kpi.icon size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-navy-400 uppercase tracking-wider">{kpi.label}</span>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-sm`}>
                    <kpi.icon size={16} className="text-white" />
                  </div>
                </div>
                <div className="text-3xl font-display font-bold text-navy-900 tracking-tight">
                  {typeof val === "number" ? <AnimatedCounter value={val} /> : val}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600">
                  <IconTrendingUp size={12} />
                  <span className="font-medium">+{Math.floor(Math.random() * 12 + 2)}% this week</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Client Requests Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-navy-100/50 flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-navy-900">Client Requests</h3>
              <p className="text-xs text-navy-400 mt-0.5">Stage pipeline overview</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-navy-50 text-xs font-medium text-navy-500">
                {reqs.length} total
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="text-xs text-navy-400 bg-navy-50/50 uppercase tracking-wider">
                  <th className="text-left p-3 pl-5 font-semibold">Reference</th>
                  <th className="text-left font-semibold">Service</th>
                  <th className="text-center font-semibold">Stage</th>
                  <th className="text-left font-semibold">Updated</th>
                  <th className="font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {reqs.map(r => (
                  <tr key={r.id} className="border-t border-navy-100/40 hover:bg-gold-50/30 transition-colors group">
                    <td className="p-3 pl-5">
                      <span className="font-mono font-bold text-navy-900 text-xs bg-navy-50 px-2 py-1 rounded-md">{r.reference}</span>
                    </td>
                    <td className="text-navy-600">{r.serviceType}</td>
                    <td className="text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${STAGE_STYLE[r.stage] || "bg-slate-100 text-slate-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.stage === "COMPLETED" ? "bg-emerald-500" : r.stage === "IN_PROCESSING" ? "bg-amber-500 animate-pulse-soft" : r.stage === "CONNECTED" ? "bg-blue-500" : "bg-slate-400"}`} />
                        {r.stage.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-xs text-navy-400">{new Date(r.updatedAt).toLocaleString()}</td>
                    <td className="p-2 pr-4 text-right">
                      <button
                        onClick={() => { setSelected(r); setStage(""); }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-medium hover:bg-navy-800 transition-all btn-press opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <IconEye size={12} />
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
                {reqs.length === 0 && (
                  <tr><td colSpan={5} className="p-12 text-center text-navy-300">
                    <IconClipboard size={32} className="mx-auto mb-2 text-navy-200" />
                    No requests yet
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium Applications */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-navy-100/50">
            <h3 className="font-display font-bold text-navy-900">Premium Apps</h3>
            <p className="text-xs text-navy-400 mt-0.5">Approve / Reject / Flag</p>
          </div>
          <div className="p-3 space-y-3 max-h-[420px] overflow-auto">
            {premiums.map(p => (
              <div key={p.id} className="border border-navy-100/50 rounded-xl p-4 hover:border-gold-400/30 hover:shadow-glow transition-all">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-navy-900 text-xs bg-navy-50 px-2 py-0.5 rounded">{p.referenceNo}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${p.status === "PENDING_REVIEW" ? "bg-amber-100 text-amber-700" : p.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-sm mt-2 text-navy-500">
                  <span className="font-medium text-navy-700">{p.clientName}</span>
                  <span className="mx-1.5 text-navy-300">•</span>
                  {p.paymentMode}
                  <span className="mx-1.5 text-navy-300">•</span>
                  <span className={p.paymentStatus === "SUCCESSFUL" ? "text-emerald-600 font-semibold" : "text-amber-600"}>{p.paymentStatus}</span>
                </div>
                {p.status === "PENDING_REVIEW" && (
                  <div className="flex gap-2 mt-3">
                    <button disabled={premBusy === p.id + "APPROVED"} onClick={() => updatePremium(p.id, "APPROVED")}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50 hover:bg-emerald-700 transition-colors btn-press flex items-center justify-center gap-1">
                      <IconCheck size={13} /> {premBusy === p.id + "APPROVED" ? "…" : "Approve"}
                    </button>
                    <button disabled={premBusy === p.id + "REJECTED"} onClick={() => updatePremium(p.id, "REJECTED")}
                      className="flex-1 py-1.5 rounded-lg border border-navy-200 text-xs font-semibold disabled:opacity-50 hover:bg-navy-50 transition-colors btn-press">
                      {premBusy === p.id + "REJECTED" ? "…" : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {premiums.length === 0 && (
              <div className="text-navy-300 text-sm text-center py-8">
                <IconFileText size={28} className="mx-auto mb-2 text-navy-200" />
                No applications yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HR & Ops Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Performance Audit */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-navy-900">Performance Audit</h4>
            <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
              <IconActivity size={16} className="text-navy-500" />
            </div>
          </div>
          <div className="space-y-3">
            {(data?.perEmployee || []).slice(0, 5).map((e: any) => (
              <div key={e.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  {e.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-navy-800 truncate">{e.name}</span>
                    <span className={`text-xs font-bold ${e.punctuality >= 95 ? "text-emerald-600" : e.punctuality >= 90 ? "text-amber-600" : "text-red-500"}`}>
                      {e.punctuality}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-navy-100/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${e.punctuality >= 95 ? "bg-emerald-500" : e.punctuality >= 90 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${e.punctuality}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-navy-400 mt-0.5">{e.requestsHandled} handled • {e.role}</div>
                </div>
              </div>
            ))}
            {(!data?.perEmployee || data.perEmployee.length === 0) && (
              <div className="text-center text-navy-300 text-sm py-4">No employee data</div>
            )}
          </div>
        </div>

        {/* Live Map */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 pb-3 flex items-center justify-between">
            <h4 className="font-display font-bold text-navy-900">Live Map</h4>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
              Live
            </div>
          </div>
          <div className="mx-5 rounded-xl overflow-hidden border border-navy-100/50 shadow-sm" style={{ height: 200 }}>
            <iframe
              title="Live Field Map"
              width="100%" height="200"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=HBR+Layout,Bengaluru,Karnataka&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </div>
          <div className="px-5 py-3 flex items-center gap-1.5 text-xs text-navy-400">
            <IconMapPin size={12} />
            HBR Layout HO • Real-time WebSocket markers in production
          </div>
        </div>

        {/* Shift Directives */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-bold text-navy-900">Shift Directives</h4>
            <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center">
              <IconSend size={16} className="text-gold-600" />
            </div>
          </div>
          <textarea
            ref={dirRef}
            value={directive}
            onChange={e => setDirective(e.target.value)}
            placeholder="Message for first login of the day..."
            className="w-full border border-navy-100 rounded-xl p-3 text-sm h-[120px] focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 resize-none bg-navy-50/30 placeholder:text-navy-300 transition-all"
          />
          <div className="flex items-center justify-between mt-1 mb-3">
            <span className="text-[10px] text-navy-300">{directive.length} / 500 characters</span>
          </div>
          <button
            onClick={publishDirective}
            className="w-full py-2.5 rounded-xl bg-gold-gradient font-bold text-navy-900 hover:shadow-glow transition-all btn-press flex items-center justify-center gap-2 text-sm"
          >
            <IconSend size={15} />
            Publish Directive
          </button>
          <p className="text-[11px] text-navy-400 mt-2 text-center">Shows as modal popup on employee first login</p>
        </div>
      </div>

      {/* Preview Modal */}
      {selected && (
        <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-40 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-modal animate-scale-in" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-4 sm:p-6 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-white text-base sm:text-lg">{selected.reference}</h3>
                <p className="text-xs sm:text-sm text-navy-300 mt-0.5">{selected.serviceType}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white flex items-center justify-center transition-colors">
                <IconX size={16} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-3 text-sm">
                  {[
                    ["Service", selected.serviceType],
                    ["Description", selected.description],
                    ["Contact time", selected.preferredContactTime || "—"],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <span className="text-[11px] uppercase tracking-wider text-navy-400 font-medium">{label}</span>
                      <p className="text-navy-800 font-medium mt-0.5">{value as string}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <select value={stage} onChange={e => setStage(e.target.value)}
                    className="border border-navy-200 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 bg-white">
                    <option value="">Move stage...</option>
                    <option>APPLIED</option><option>CONNECTED</option><option>IN_PROCESSING</option><option>COMPLETED</option>
                  </select>
                  <button disabled={!stage || stageBusy} onClick={updateStage}
                    className="px-5 py-2 rounded-xl bg-navy-900 text-white text-sm font-semibold disabled:opacity-50 hover:bg-navy-800 transition-all btn-press">
                    {stageBusy ? "Updating…" : "Update"}
                  </button>
                </div>
                <button onClick={exportDossier}
                  className="w-full mt-1 py-2.5 rounded-xl border border-navy-200 font-semibold text-sm hover:bg-navy-50 transition-colors btn-press flex items-center justify-center gap-2 text-navy-700">
                  <IconDownload size={15} /> Export PDF Dossier
                </button>
              </div>
              <div>
                <div className="font-display font-semibold text-sm mb-3 text-navy-900 flex items-center gap-2">
                  <IconClock size={15} className="text-gold-500" />
                  Milestone Timeline
                </div>
                <div className="space-y-3 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-navy-100">
                  {selected.stageHistory.map((h: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm relative">
                      <div className="w-[11px] h-[11px] rounded-full bg-gold-500 border-2 border-white shadow-sm mt-1 shrink-0 z-10" />
                      <div>
                        <div className="font-semibold text-navy-800">{h.stage.replace("_", " ")}</div>
                        <div className="text-[11px] text-navy-400">{new Date(h.at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-navy-50/60 rounded-xl p-3.5">
                  <span className="font-semibold text-xs text-navy-700 block mb-1">Attachments</span>
                  <div className="text-xs text-navy-400">
                    {selected.attachments?.length ? selected.attachments.map((a: any, i: number) => <div key={i} className="flex items-center gap-1.5 py-0.5"><IconFileText size={12} /> {a.name}</div>) : "No attachments on this request"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
