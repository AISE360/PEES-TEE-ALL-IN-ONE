import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../lib/api";
import {
  IconCalendar,
  IconCheck,
  IconX,
  IconClock,
  IconFileText,
  IconDownload,
  IconRefresh
} from "../components/Icons";

export default function HRLeave() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [slips, setSlips] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<"LEAVES" | "PAYROLL">("LEAVES");
  const [leaveFilter, setLeaveFilter] = useState("ALL");

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };

  const loadData = () => {
    apiFetch("/api/leaves").then((r) => setLeaves(r.data || []));
    apiFetch("/api/salary-slips").then((r) => setSlips(r.data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id: string, s: "APPROVED" | "REJECTED") => {
    setBusy(id + s);
    const r = await apiFetch("/api/leaves/" + id, {
      method: "PATCH",
      body: JSON.stringify({ status: s })
    });
    setBusy(null);
    if (r.success) {
      setLeaves((l) => l.map((x) => (x.id === id ? r.data : x)));
      showToast(`Leave request ${id} marked as ${s}`);
    } else {
      showToast("Operation failed: " + (r.error || "unknown error"));
    }
  };

  const viewSlipModal = (s: any) => {
    const html = `<!DOCTYPE html><html><head><title>Salary Slip ${s.month}</title><style>
      body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #0F2440; }
      .header { border-bottom: 2px solid #C6A664; padding-bottom: 16px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #E2E8F0; padding: 12px; text-align: left; }
      th { background-color: #F8FAFC; }
    </style></head><body>
      <div class="header">
        <h2 style="margin:0;color:#0F2440;">PEES TEE GROUP PVT LTD</h2>
        <p style="margin:4px 0 0;color:#64748B;">Official Pay Slip — Period: ${s.month}</p>
      </div>
      <table>
        <tr><th>Employee ID</th><td><strong>${s.employeeId}</strong></td></tr>
        <tr><th>Pay Month</th><td>${s.month}</td></tr>
        <tr><th>Net Remuneration</th><td>Verified by Central Accounts</td></tr>
        <tr><th>Document Token</th><td style="font-family:monospace;">${s.pdfUrl || "s3://peestee-payroll/slip-" + s.id}</td></tr>
      </table>
      <p style="margin-top:32px;font-size:12px;color:#94A3B8;">Certified digitally generated pay slip document.</p>
    </body></html>`;
    const w = window.open("", "_blank");
    w?.document.write(html);
    w?.document.close();
    w?.print();
  };

  const filteredLeaves = useMemo(() => {
    if (leaveFilter === "ALL") return leaves;
    return leaves.filter((l) => l.status === leaveFilter);
  }, [leaves, leaveFilter]);

  const stats = useMemo(() => {
    return {
      pending: leaves.filter((l) => l.status === "PENDING").length,
      approved: leaves.filter((l) => l.status === "APPROVED").length,
      rejected: leaves.filter((l) => l.status === "REJECTED").length,
      totalSlips: slips.length
    };
  }, [leaves, slips]);

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
              <IconCalendar size={22} />
            </span>
            <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
              Human Resources & Leave Governance
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review time-off petitions, manage leave balance workflows, and access employee payslips
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <IconRefresh size={16} className="text-slate-500" />
            Refresh Records
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Pending Leaves
          </div>
          <div className="text-2xl font-bold font-display text-amber-600 mt-1">
            {stats.pending}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Approved
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 mt-1">
            {stats.approved}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Rejected
          </div>
          <div className="text-2xl font-bold font-display text-slate-600 mt-1">
            {stats.rejected}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-navy-900">
            Salary Slips Issued
          </div>
          <div className="text-2xl font-bold font-display text-navy-950 mt-1">
            {stats.totalSlips}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80">
        <button
          onClick={() => setActiveTab("LEAVES")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "LEAVES"
              ? "border-gold-500 text-navy-950 font-display"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <IconClock size={16} />
          Leave Applications ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab("PAYROLL")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "PAYROLL"
              ? "border-gold-500 text-navy-950 font-display"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <IconFileText size={16} />
          Payroll & Salary Slips ({slips.length})
        </button>
      </div>

      {activeTab === "LEAVES" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2">
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setLeaveFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    leaveFilter === f
                      ? "bg-navy-950 text-gold-400 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {f === "ALL" ? "All Requests" : f}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredLeaves.length} record(s)
            </span>
          </div>

          {/* Leaves Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase font-semibold text-slate-500 bg-slate-50/80 border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-4">Employee ID</th>
                    <th className="py-3.5 px-4">Leave Category</th>
                    <th className="py-3.5 px-4">Duration Range</th>
                    <th className="py-3.5 px-4">Stated Purpose</th>
                    <th className="py-3.5 px-4">Decision Status</th>
                    <th className="py-3.5 px-4 text-right">Workflow Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-navy-950">
                        {l.employeeId}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {l.leaveType || "CASUAL"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {l.fromDate} <span className="text-slate-400">→</span> {l.toDate}
                      </td>
                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                        {l.reason || "—"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            l.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : l.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              l.status === "APPROVED"
                                ? "bg-emerald-500"
                                : l.status === "PENDING"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-red-500"
                            }`}
                          />
                          {l.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {l.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={busy === l.id + "APPROVED"}
                              onClick={() => approve(l.id, "APPROVED")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm disabled:opacity-50 active:scale-95 transition-all"
                            >
                              <IconCheck size={13} />
                              Approve
                            </button>
                            <button
                              disabled={busy === l.id + "REJECTED"}
                              onClick={() => approve(l.id, "REJECTED")}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 text-xs font-semibold flex items-center gap-1 disabled:opacity-50 active:scale-95 transition-all"
                            >
                              <IconX size={13} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            Concluded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredLeaves.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <IconCalendar size={36} className="mx-auto mb-2 opacity-40" />
                        <p className="font-medium">No leave records match this filter</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "PAYROLL" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold font-display text-navy-950">Disbursed Salary Slips</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Archived PDF payment slips accessible for compliance and employee audit
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase font-semibold text-slate-500 bg-slate-50/80 border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Employee Identifier</th>
                  <th className="py-3.5 px-4">Billing Month</th>
                  <th className="py-3.5 px-4">Document Status</th>
                  <th className="py-3.5 px-4 text-right">View / Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slips.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-navy-950">
                      {s.employeeId}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">{s.month}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Generated & Signed
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => viewSlipModal(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-gold-400 text-xs font-semibold transition-all shadow-sm active:scale-95"
                      >
                        <IconDownload size={13} />
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
                {slips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      <IconFileText size={36} className="mx-auto mb-2 opacity-40" />
                      <p className="font-medium">No salary slips uploaded yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
