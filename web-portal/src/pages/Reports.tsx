import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import {
  IconFileText,
  IconPrinter,
  IconSend,
  IconCheck,
  IconCalendar,
  IconDollarSign,
  IconBriefcase
} from "../components/Icons";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [activities, setActivities] = useState("");
  const [collections, setCollections] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };

  const loadReports = () => {
    apiFetch("/api/eod-reports").then((r) => setReports(r.data || []));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activities.trim()) {
      showToast("Completed activities are mandatory");
      return;
    }
    setBusy(true);
    const r = await apiFetch("/api/eod-reports", {
      method: "POST",
      body: JSON.stringify({
        activities: activities.trim(),
        collections: collections.trim() || "Nil / Direct Settlement",
        notes: notes.trim() || "Routine shift completed with zero safety incidents.",
        employeeId: "u_admin"
      })
    });
    setBusy(false);
    if (r.success) {
      setReports((x) => [r.data, ...x]);
      setActivities("");
      setCollections("");
      setNotes("");
      showToast("Daily EOD report logged and audited successfully");
    } else {
      showToast("Submission failed: " + (r.error || "unknown error"));
    }
  };

  const printReport = (rep: any) => {
    const html = `<!DOCTYPE html><html><head><title>EOD Field Report — ${rep.date}</title><style>
      body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 48px; color: #0F2440; background: #FFF; }
      .header { border-bottom: 2px solid #C6A664; padding-bottom: 16px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
      .brand { font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #0F2440; }
      .gold { color: #C6A664; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #E2E8F0; padding: 12px 14px; text-align: left; }
      th { background-color: #F8FAFC; color: #475569; width: 28%; font-size: 13px; text-transform: uppercase; }
      td { font-size: 14px; }
      .tag { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #0F2440; color: #FFF; font-size: 12px; font-weight: bold; }
    </style></head>
    <body>
      <div class="header">
        <div>
          <div class="brand">PEES <span class="gold">TEE</span> GROUP</div>
          <div style="font-size:13px;color:#64748B;margin-top:4px;">Daily End-of-Day (EOD) Operations Report</div>
        </div>
        <div>
          <span class="tag">Date: ${rep.date}</span>
        </div>
      </div>
      <table>
        <tr><th>Filed By (Officer)</th><td><strong>${rep.employeeId}</strong></td></tr>
        <tr><th>Report Date</th><td>${rep.date}</td></tr>
        <tr><th>Tasks & Deployments</th><td style="white-space:pre-wrap;">${rep.activities}</td></tr>
        <tr><th>Collections & Settlements</th><td><strong>${rep.collections}</strong></td></tr>
        <tr><th>Operational Field Notes</th><td>${rep.notes}</td></tr>
        <tr><th>System Timestamp</th><td>${new Date(rep.createdAt).toLocaleString()}</td></tr>
      </table>
      <div style="margin-top:60px;display:flex;justify-content:space-between;font-size:13px;color:#475569;">
        <div>
          <div style="border-top:1px solid #CBD5E1;width:200px;padding-top:8px;">Field Officer Signature</div>
        </div>
        <div>
          <div style="border-top:1px solid #CBD5E1;width:200px;padding-top:8px;">Supervisory Attestation</div>
        </div>
      </div>
    </body></html>`;
    const w = window.open("", "_blank");
    w?.document.write(html);
    w?.document.close();
    w?.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm border border-gold-500/30 flex items-center gap-3">
          <IconCheck size={18} className="text-[#C6A664]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-600">
              <IconFileText size={22} />
            </span>
            <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
              Operational Reports & EOD Logs
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Audit daily field operations, inspect shift collections, and generate printable executive reports
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit EOD Card */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-navy-50 text-navy-900">
                <IconBriefcase size={16} />
              </span>
              <h2 className="text-base font-bold font-display text-navy-950">
                File End-of-Day (EOD) Report
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Submit daily deployment summary directly into the central records database
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Activities Completed Today *
                </label>
                <textarea
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="e.g. Conducted 6 on-site KYC verifications in Indiranagar; reconciled site assets."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Collections / Financial Receipts
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IconDollarSign size={15} />
                  </span>
                  <input
                    type="text"
                    value={collections}
                    onChange={(e) => setCollections(e.target.value)}
                    placeholder="e.g. ₹ 4,500 cash / Nil (UPI settled)"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Observations / Field Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. All clients contacted on schedule; smooth coordination."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-gold-400 font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 transition-all"
              >
                <IconSend size={15} />
                {busy ? "Submitting Report..." : "Submit EOD Report"}
              </button>
            </form>
          </div>
        </div>

        {/* History Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold font-display text-navy-950">
                Submitted Field Reports ({reports.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Permanent audit trail of daily operational submissions
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[640px]">
            {reports.map((r) => (
              <div key={r.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-navy-50 text-navy-900">
                      <IconCalendar size={16} />
                    </span>
                    <div>
                      <div className="font-bold text-sm text-navy-950">
                        Shift Date: {r.date}
                      </div>
                      <div className="text-xs text-slate-400">
                        Officer: <span className="font-mono text-slate-600">{r.employeeId}</span> • Filed {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => printReport(r)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-sm active:scale-95 transition-all self-start sm:self-auto"
                  >
                    <IconPrinter size={13} className="text-gold-600" />
                    Print PDF
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-400 block mb-1">
                      Activities Done
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {r.activities}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block mb-1">
                      Collections Logged
                    </span>
                    <p className="text-emerald-700 font-bold">
                      {r.collections || "None reported"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block mb-1">
                      Field Observations
                    </span>
                    <p className="text-slate-600 italic">
                      {r.notes || "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <IconFileText size={36} className="mx-auto opacity-40" />
                <p className="font-medium">No EOD reports registered</p>
                <p className="text-xs text-slate-400">
                  Use the form on the left to lodge the first report
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
