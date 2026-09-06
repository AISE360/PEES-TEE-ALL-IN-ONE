import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../lib/api";
import {
  IconSearch,
  IconFilter,
  IconDownload,
  IconEye,
  IconClock,
  IconCheck,
  IconFileText,
  IconBriefcase,
  IconRefresh
} from "../components/Icons";

const STAGES = ["APPLIED", "CONNECTED", "IN_PROCESSING", "COMPLETED"];

const STAGE_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  APPLIED: {
    label: "Applied",
    badge: "bg-slate-100/90 text-slate-700 border-slate-200",
    dot: "bg-slate-400"
  },
  CONNECTED: {
    label: "Connected",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500"
  },
  IN_PROCESSING: {
    label: "In Processing",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500 animate-pulse"
  },
  COMPLETED: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500"
  }
};

export default function ClientRequests() {
  const [reqs, setReqs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [stage, setStage] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("ALL");

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };

  const loadRequests = () => {
    apiFetch("/api/client-requests").then((r) => setReqs(r.data || []));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStage = async () => {
    if (!selected || !stage) return;
    setBusy(true);
    const r = await apiFetch(`/api/client-requests/${selected.id}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ stage })
    });
    setBusy(false);
    if (r.success) {
      setReqs((x) => x.map((q) => (q.id === selected.id ? r.data : q)));
      setSelected(r.data);
      setStage("");
      showToast(`${r.data.reference} stage updated to ${stage}`);
    } else {
      showToast("Failed: " + (r.error || "unknown error"));
    }
  };

  const exportDossier = () => {
    if (!selected) return;
    const timeline = selected.stageHistory
      .map(
        (h: any) =>
          `<div style="display:flex;margin-bottom:12px;"><div style="width:12px;height:12px;border-radius:50%;background:#C6A664;margin-top:4px;margin-right:12px;"></div><div><strong>${h.stage.replace(
            "_",
            " "
          )}</strong><div style="font-size:12px;color:#64748B">${new Date(
            h.at
          ).toLocaleString()}</div></div></div>`
      )
      .join("");

    const html = `<!DOCTYPE html><html><head><title>Dossier ${selected.reference}</title><style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #0F2440; background: #FFF; }
      .header { border-bottom: 2px solid #C6A664; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
      .logo { font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #0F2440; }
      .gold { color: #C6A664; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #E2E8F0; padding: 12px; text-align: left; }
      th { background-color: #F8FAFC; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
      .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #0F2440; color: #FFF; font-size: 12px; font-weight: bold; }
    </style></head>
    <body>
      <div class="header">
        <div>
          <div class="logo">PEES <span class="gold">TEE</span> GROUP</div>
          <div style="font-size:13px;color:#64748B;">Client Request Dossier — Reference #${selected.reference}</div>
        </div>
        <div style="text-align:right;">
          <span class="badge">${selected.stage}</span>
        </div>
      </div>
      <table>
        <tr><th style="width:25%">Field</th><th>Details</th></tr>
        <tr><td>Reference ID</td><td><strong>${selected.reference}</strong></td></tr>
        <tr><td>Service Requested</td><td>${selected.serviceType}</td></tr>
        <tr><td>Current Stage</td><td>${selected.stage}</td></tr>
        <tr><td>Description</td><td>${selected.description}</td></tr>
        <tr><td>Preferred Contact Time</td><td>${selected.preferredContactTime || "Anytime"}</td></tr>
        <tr><td>Date Submitted</td><td>${new Date(selected.createdAt).toLocaleString()}</td></tr>
        <tr><td>Last Updated</td><td>${new Date(selected.updatedAt).toLocaleString()}</td></tr>
      </table>
      <h3 style="margin-top:32px;color:#0F2440;border-bottom:1px solid #E2E8F0;padding-bottom:8px;">Lifecycle Stage Audit Trail</h3>
      <div style="margin-top:16px;">${timeline}</div>
      <div style="margin-top:48px;border-top:1px solid #E2E8F0;padding-top:12px;font-size:11px;color:#94A3B8;display:flex;justify-content:space-between;">
        <span>Generated by PEES Tee Enterprise Portal</span>
        <span>${new Date().toLocaleString()}</span>
      </div>
    </body></html>`;
    const w = window.open("", "_blank");
    w?.document.write(html);
    w?.document.close();
    w?.print();
  };

  const filtered = useMemo(() => {
    return reqs.filter((r) => {
      const matchText =
        r.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStage = filterStage === "ALL" || r.stage === filterStage;
      return matchText && matchStage;
    });
  }, [reqs, searchTerm, filterStage]);

  const counts = useMemo(() => {
    return {
      total: reqs.length,
      applied: reqs.filter((r) => r.stage === "APPLIED").length,
      connected: reqs.filter((r) => r.stage === "CONNECTED").length,
      processing: reqs.filter((r) => r.stage === "IN_PROCESSING").length,
      completed: reqs.filter((r) => r.stage === "COMPLETED").length
    };
  }, [reqs]);

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm border border-gold-500/30 flex items-center gap-3">
          <IconCheck size={18} className="text-[#C6A664]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-600">
              <IconBriefcase size={22} />
            </span>
            <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
              Client Service Requests
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track, audit, and progress all customer service and onboarding tickets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadRequests}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <IconRefresh size={16} className="text-slate-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metric Quick-Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setFilterStage("ALL")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterStage === "ALL"
              ? "bg-navy-900 text-white border-navy-800 shadow-md ring-2 ring-gold-500/40"
              : "bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/80 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider opacity-75">All Requests</div>
          <div className="text-2xl font-bold font-display mt-1">{counts.total}</div>
        </button>
        <button
          onClick={() => setFilterStage("APPLIED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterStage === "APPLIED"
              ? "bg-navy-900 text-white border-navy-800 shadow-md ring-2 ring-gold-500/40"
              : "bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/80 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">New Applied</div>
          <div className="text-2xl font-bold font-display mt-1 text-slate-700">{counts.applied}</div>
        </button>
        <button
          onClick={() => setFilterStage("IN_PROCESSING")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterStage === "IN_PROCESSING"
              ? "bg-navy-900 text-white border-navy-800 shadow-md ring-2 ring-gold-500/40"
              : "bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/80 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">In Processing</div>
          <div className="text-2xl font-bold font-display mt-1 text-amber-600">{counts.processing}</div>
        </button>
        <button
          onClick={() => setFilterStage("COMPLETED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterStage === "COMPLETED"
              ? "bg-navy-900 text-white border-navy-800 shadow-md ring-2 ring-gold-500/40"
              : "bg-white hover:bg-slate-50/80 text-slate-700 border-slate-200/80 shadow-sm"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Completed</div>
          <div className="text-2xl font-bold font-display mt-1 text-emerald-600">{counts.completed}</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IconSearch size={17} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference, service, or notes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs text-slate-500 mr-1">
            <IconFilter size={15} />
            <span>Stage:</span>
          </div>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          >
            <option value="ALL">All Stages ({reqs.length})</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-500 bg-slate-50/80 border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Ticket Ref</th>
                <th className="py-3.5 px-4">Service Type</th>
                <th className="py-3.5 px-4">Stage Status</th>
                <th className="py-3.5 px-4">Received On</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => {
                const conf = STAGE_CONFIG[r.stage] || {
                  label: r.stage,
                  badge: "bg-slate-100 text-slate-600 border-slate-200",
                  dot: "bg-slate-400"
                };
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelected(r);
                      setStage("");
                    }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-mono font-bold text-xs group-hover:bg-gold-500/20 group-hover:text-gold-700 transition-colors">
                          #
                        </div>
                        <span className="font-mono font-bold text-navy-950">
                          {r.reference}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">
                      {r.serviceType}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${conf.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                        {conf.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      {new Date(r.updatedAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelected(r);
                          setStage("");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                      >
                        <IconEye size={14} />
                        View & Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <IconFileText size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No matching client requests found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search or stage filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Lifecycle Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-navy-950 text-white p-6 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-gold-500 text-navy-950">
                      {selected.reference}
                    </span>
                    <span className="text-xs text-slate-300">
                      Submitted on {new Date(selected.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display mt-2 text-white">
                    {selected.serviceType}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Summary Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Service Type</div>
                  <div className="font-semibold text-navy-950 mt-0.5">
                    {selected.serviceType}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Preferred Contact</div>
                  <div className="font-semibold text-navy-950 mt-0.5">
                    {selected.preferredContactTime || "Flexible / Not specified"}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-slate-500 font-medium">Customer Notes / Scope</div>
                  <div className="text-slate-700 mt-1 text-xs leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                    {selected.description || "No specific instructions provided."}
                  </div>
                </div>
              </div>

              {/* Stage Progression Action Box */}
              <div className="p-4 rounded-2xl border border-gold-500/30 bg-gold-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-navy-950">
                    Move Lifecycle Stage
                  </div>
                  <span className="text-xs text-slate-500">
                    Current: <strong>{selected.stage.replace("_", " ")}</strong>
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-gold-500/40 text-slate-700 font-medium"
                  >
                    <option value="">Select target stage...</option>
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={!stage || busy}
                    onClick={updateStage}
                    className="px-5 py-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-gold-400 font-bold text-sm disabled:opacity-50 transition-all shadow-sm shrink-0"
                  >
                    {busy ? "Updating..." : "Update Stage"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={exportDossier}
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <IconDownload size={16} className="text-gold-600" />
                Generate & Print Official PDF Dossier
              </button>

              {/* Timeline Audit */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  <IconClock size={14} />
                  <span>Lifecycle Stage History</span>
                </div>
                <div className="space-y-3 relative pl-4 border-l-2 border-gold-500/40 ml-2">
                  {selected.stageHistory?.map((h: any, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gold-500 ring-4 ring-white" />
                      <div className="font-semibold text-sm text-navy-950">
                        {h.stage.replace("_", " ")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(h.at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
