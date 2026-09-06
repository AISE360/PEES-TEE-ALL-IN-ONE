import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../lib/api";
import {
  IconUsers,
  IconPlus,
  IconCheck,
  IconSearch,
  IconShield,
  IconBriefcase
} from "../components/Icons";

const ROLES = ["FIELD_EMPLOYEE", "SUPERVISOR", "HR", "MANAGER", "ADMIN"];

const ROLE_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  FIELD_EMPLOYEE: { label: "Field Executive", bg: "bg-slate-100", text: "text-slate-700" },
  SUPERVISOR: { label: "Supervisor", bg: "bg-blue-50", text: "text-blue-700" },
  HR: { label: "HR Admin", bg: "bg-purple-50", text: "text-purple-700" },
  MANAGER: { label: "Manager", bg: "bg-amber-50", text: "text-amber-800" },
  ADMIN: { label: "Super Admin", bg: "bg-red-50", text: "text-red-700" }
};

export default function Employees() {
  const [emps, setEmps] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("FIELD_EMPLOYEE");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const load = () => apiFetch("/api/employees").then((r) => setEmps(r.data || []));

  useEffect(() => {
    load();
  }, []);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 4500);
  };

  const addEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Both full name and phone are required.");
      return;
    }
    setBusy(true);
    const r = await apiFetch("/api/employees", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        role,
        email: phone.trim() + "@peestee.com"
      })
    });
    setBusy(false);
    if (r.success) {
      setEmps((prev) => [r.data, ...prev]);
      setName("");
      setPhone("");
      showToast(
        `Provisioned ${r.data.name} (${r.data.employeeId}). Initial temporary password: password123`
      );
    } else {
      showToast("Provisioning failed: " + (r.error || "unknown error"));
    }
  };

  const toggle = async (emp: any) => {
    const r = await apiFetch("/api/employees/" + emp.id, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !emp.isActive })
    });
    if (r.success) {
      setEmps((prev) => prev.map((x) => (x.id === emp.id ? r.data : x)));
      showToast(`${emp.name} account is now ${!emp.isActive ? "ACTIVE" : "SUSPENDED"}`);
    }
  };

  const filtered = useMemo(() => {
    return emps.filter((e) => {
      const matchesSearch =
        e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.phone?.includes(searchTerm) ||
        e.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "ALL" || e.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [emps, searchTerm, filterRole]);

  const stats = useMemo(() => {
    const total = emps.length;
    const active = emps.filter((e) => e.isActive).length;
    const field = emps.filter((e) => e.role === "FIELD_EMPLOYEE").length;
    return { total, active, inactive: total - active, field };
  }, [emps]);

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm border border-gold-500/30 flex items-center gap-3">
          <IconCheck size={18} className="text-[#C6A664]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-600">
              <IconUsers size={22} />
            </span>
            <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
              Employee Management & Access
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Provision organizational personnel, assign operational roles, and manage system credentials
          </p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Staff</div>
          <div className="text-2xl font-bold font-display text-navy-950 mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active Staff</div>
          <div className="text-2xl font-bold font-display text-emerald-600 mt-1">{stats.active}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Suspended</div>
          <div className="text-2xl font-bold font-display text-slate-600 mt-1">{stats.inactive}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">Field Force</div>
          <div className="text-2xl font-bold font-display text-blue-600 mt-1">{stats.field}</div>
        </div>
      </div>

      {/* Add Employee Card */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 rounded-lg bg-navy-50 text-navy-900">
            <IconPlus size={16} />
          </span>
          <h2 className="text-base font-bold font-display text-navy-950">
            Provision New Employee
          </h2>
        </div>

        <form onSubmit={addEmp} className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">System Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 font-medium text-slate-700"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_BADGES[r]?.label || r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2 px-4 rounded-xl bg-navy-950 hover:bg-navy-800 text-gold-400 text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 transition-all h-[38px]"
            >
              <IconPlus size={16} />
              {busy ? "Provisioning..." : "Provision Staff"}
            </button>
          </div>
        </form>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <IconShield size={14} className="text-gold-600 shrink-0" />
          <span>Default initial password: <strong className="font-mono text-slate-600">password123</strong> — Employee must update credentials upon first mobile authentication.</span>
        </p>
      </div>

      {/* Roster Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IconSearch size={17} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, or phone..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          >
            <option value="ALL">All Roles ({emps.length})</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_BADGES[r]?.label || r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-500 bg-slate-50/80 border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Employee Details</th>
                <th className="py-3.5 px-4">Emp ID</th>
                <th className="py-3.5 px-4">Role Assignment</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Account State</th>
                <th className="py-3.5 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => {
                const roleBadge = ROLE_BADGES[e.role] || {
                  label: e.role,
                  bg: "bg-slate-100",
                  text: "text-slate-600"
                };
                return (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-navy-950 text-gold-400 text-xs font-bold flex items-center justify-center shadow-sm">
                          {e.name?.charAt(0) || "E"}
                        </div>
                        <div>
                          <div className="font-semibold text-navy-950">{e.name}</div>
                          <div className="text-xs text-slate-400">{e.email || `${e.phone}@peestee.com`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-600 text-xs">
                      {e.employeeId || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge.bg} ${roleBadge.text}`}
                      >
                        <IconBriefcase size={12} />
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                      {e.phone}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          e.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                            : "bg-red-50 text-red-600 border border-red-200/80"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.isActive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {e.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => toggle(e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                          e.isActive
                            ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {e.isActive ? "Suspend Access" : "Re-activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <IconUsers size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No employees found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
