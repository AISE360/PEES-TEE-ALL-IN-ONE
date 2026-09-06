import { useState } from "react";
import {
  IconSettings,
  IconCheck,
  IconShield,
  IconGlobe,
  IconBriefcase
} from "../components/Icons";

export default function Settings() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (k: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(k);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const CONFIG_ITEMS = [
    { label: "Environment Mode", value: "Enterprise Demo (Live API)", badge: "LIVE" },
    { label: "Database Layer", value: "High-Performance In-Memory Store", badge: "ACTIVE" },
    { label: "Master OTP Bypass", value: "123456", badge: "DEV OTP" },
    { label: "Payment Gateway", value: "Mock Gateway (Auto-Capture Enabled)", badge: "MOCK" },
    { label: "WebSocket Gateway", value: "ws://localhost:4000 (Socket.IO)", badge: "READY" },
    { label: "Google Maps API", value: "AIzaSyD77yl0...224cYA", badge: "KEY SET" },
    { label: "CORS Allowed Origins", value: "* (Configured for multi-device test)", badge: "OPEN" }
  ];

  const CREDENTIALS = [
    { role: "Central Super Admin", id: "EMP00001", pwd: "password123", desc: "Full permissions over all portals and staff" },
    { role: "HR Operations Lead", id: "EMP00125", pwd: "password123", desc: "Leave approvals, staff provisioning, payroll" },
    { role: "Field Territory Supervisor", id: "EMP00126", pwd: "password123", desc: "Shift scheduling, GPS audits, directives" },
    { role: "Field Service Executive", id: "EMP00127", pwd: "password123", desc: "Mobile field app tasks, location telemetry" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-gold-500/10 text-gold-600">
            <IconSettings size={22} />
          </span>
          <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
            System Settings & Environment Telemetry
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Review core deployment configuration, live service tokens, and quick authentication credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-navy-50 text-navy-900">
                <IconGlobe size={16} />
              </span>
              <h2 className="text-base font-bold font-display text-navy-950">
                Deployment Parameters
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {CONFIG_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="py-3 flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <div className="font-medium text-slate-600">{item.label}</div>
                    <div className="font-mono text-xs font-semibold text-navy-950 mt-0.5">
                      {item.value}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                      {item.badge}
                    </span>
                    <button
                      onClick={() => copyText(item.label, item.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-all active:scale-95"
                    >
                      {copiedKey === item.label ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <IconCheck size={12} /> Copied
                        </span>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-navy-950 text-white flex items-center justify-between">
            <div>
              <div className="text-xs text-gold-400 font-bold uppercase tracking-wider">
                Enterprise Core
              </div>
              <div className="text-sm font-semibold mt-0.5">
                PEES Tee Multi-App Ecosystem v1.0.0
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Corporate Identity & Demo Access Card */}
        <div className="space-y-6">
          {/* Corporate Entity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-gold-500/10 text-gold-600">
                <IconBriefcase size={16} />
              </span>
              <h2 className="text-base font-bold font-display text-navy-950">
                Headquarters & Corporate Entity
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2 text-sm text-slate-700">
              <div className="font-bold text-navy-950 text-base">
                PEES Tee Group Private Limited
              </div>
              <div className="text-xs text-slate-500">
                Registered Office: 2nd Floor, Corporate Hub, HBR Layout 2nd Block, Bengaluru, Karnataka – 560043
              </div>
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                <span>Direct: +91 (080) 4128-9652</span>
                <span>Contact: admin@peesteegroup.com</span>
              </div>
            </div>
          </div>

          {/* Demo Testing Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-navy-50 text-navy-900">
                <IconShield size={16} />
              </span>
              <h2 className="text-base font-bold font-display text-navy-950">
                Demonstration Testing Roster
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              One-click access credentials for client presentation and walkthroughs
            </p>

            <div className="space-y-2.5">
              {CREDENTIALS.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-navy-950">{c.role}</div>
                    <div className="text-slate-500 mt-0.5">{c.desc}</div>
                    <div className="font-mono text-slate-700 mt-1">
                      ID: <strong>{c.id}</strong> • Pwd: <strong>{c.pwd}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => copyText(c.id, `${c.id} / ${c.pwd}`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-slate-700 transition-all active:scale-95 shrink-0"
                  >
                    {copiedKey === c.id ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <IconCheck size={12} /> Copied
                      </span>
                    ) : (
                      "Copy Logins"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
