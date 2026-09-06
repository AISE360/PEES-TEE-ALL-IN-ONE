import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../lib/api";
import {
  IconShield,
  IconCheck,
  IconX,
  IconFlag,
  IconDollarSign,
  IconRefresh,
  IconSearch,
  IconClock
} from "../components/Icons";

export default function Premium() {
  const [premiums, setPremiums] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4000);
  };

  const loadPremiums = () => {
    apiFetch("/api/premium-applications").then((r) => setPremiums(r.data || []));
  };

  useEffect(() => {
    loadPremiums();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setBusy(id + status);
    const r = await apiFetch(`/api/premium-applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    setBusy(null);
    if (r.success) {
      setPremiums((prev) => prev.map((x) => (x.id === id ? r.data : x)));
      showToast(`Application ${r.data.referenceNo} updated to ${status}`);
    } else {
      showToast("Update failed: " + (r.error || "unknown error"));
    }
  };

  const filtered = useMemo(() => {
    return premiums.filter((p) => {
      const matchSearch =
        p.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = statusFilter === "ALL" || p.status === statusFilter;
      return matchSearch && matchFilter;
    });
  }, [premiums, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      pending: premiums.filter((p) => p.status === "PENDING_REVIEW").length,
      approved: premiums.filter((p) => p.status === "APPROVED").length,
      rejected: premiums.filter((p) => p.status === "REJECTED").length,
      total: premiums.length
    };
  }, [premiums]);

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
              <IconShield size={22} />
            </span>
            <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
              Premium Applications & KYC Audit
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Conduct compliance verifications, validate payments, and authorize insurance or estate policies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPremiums}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <IconRefresh size={16} className="text-slate-500" />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Pending KYC Review
          </div>
          <div className="text-2xl font-bold font-display text-amber-600 mt-1">
            {stats.pending}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Approved Policies
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
            Total Underwritten
          </div>
          <div className="text-2xl font-bold font-display text-navy-950 mt-1">
            {stats.total}
          </div>
        </div>
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
            placeholder="Search client, ref#, or plan type..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-navy-950 text-gold-400 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600"
              }`}
            >
              {st === "ALL" ? "All" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => {
          const isPending = p.status === "PENDING_REVIEW";
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-navy-50 text-navy-900">
                      {p.referenceNo}
                    </span>
                    <h3 className="font-bold text-base text-navy-950 mt-1">
                      {p.clientName || "Direct Applicant"}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isPending
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.status === "APPROVED"
                          ? "bg-emerald-500"
                          : isPending
                          ? "bg-amber-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    />
                    {p.status.replace("_", " ")}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block font-medium">Coverage Plan</span>
                    <span className="font-semibold text-slate-700">
                      {p.insuranceType || p.serviceType || "Standard Plan"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Premium Amount</span>
                    <span className="font-bold text-navy-950">
                      ₹ {p.premium ? Number(p.premium).toLocaleString("en-IN") : "Custom"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Payment State</span>
                    <span
                      className={`font-semibold ${
                        p.paymentStatus === "SUCCESSFUL"
                          ? "text-emerald-700"
                          : "text-amber-600"
                      }`}
                    >
                      {p.paymentStatus || "PENDING"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Payment Mode</span>
                    <span className="font-medium text-slate-700">
                      {p.paymentMode || "Direct NetBanking"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isPending ? (
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    disabled={busy === p.id + "APPROVED"}
                    onClick={() => updateStatus(p.id, "APPROVED")}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 transition-all"
                  >
                    <IconCheck size={14} />
                    {busy === p.id + "APPROVED" ? "..." : "Approve & Issue"}
                  </button>
                  <button
                    disabled={busy === p.id + "REJECTED"}
                    onClick={() => updateStatus(p.id, "REJECTED")}
                    className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    <IconX size={14} />
                    {busy === p.id + "REJECTED" ? "..." : "Reject"}
                  </button>
                  <button
                    onClick={() =>
                      showToast(`Flagged ${p.referenceNo} for Senior Underwriter Audit`)
                    }
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 transition-all"
                    title="Flag for Senior Review"
                  >
                    <IconFlag size={14} />
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Underwriting decision finalized</span>
                  <span className="font-medium text-slate-600">Audit Complete</span>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <IconShield size={36} className="mx-auto opacity-40" />
            <p className="font-medium">No premium applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
