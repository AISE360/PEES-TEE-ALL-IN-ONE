import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import {
  IconMapPin,
  IconRefresh,
  IconUsers,
  IconClock,
  IconShield,
  IconActivity
} from "../components/Icons";

const MAPS_KEY = "AIzaSyD77yl0_MV4lnaax5oko7kg_ouls224cYA";

export default function FieldTracking() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState<any>(null);

  const load = () => {
    apiFetch("/api/portal/live-map").then((r) => {
      setShifts(r.data || []);
      setLastRefreshed(new Date());
    });
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/10 text-gold-600">
              <IconMapPin size={22} />
            </span>
            <h1 className="text-2xl font-bold font-display text-navy-950 tracking-tight">
              Live Field Force Tracking
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Feed (15s polling) • Updated {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <IconRefresh size={16} className="text-slate-500" />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Live Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconActivity size={16} className="text-gold-600" />
              <span className="text-sm font-bold text-navy-950 font-display">
                Bengaluru Command Map View
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-navy-950 text-gold-400 font-mono">
              HQ: HBR Layout
            </span>
          </div>

          <div className="relative w-full h-[520px] bg-slate-100">
            <iframe
              title="Field Tracking Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src="https://maps.google.com/maps?q=HBR+Layout,Bengaluru,Karnataka&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />

            {/* Float Overlay Indicator */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md text-xs font-semibold text-navy-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{shifts.length} Field Agent(s) Active in Zone</span>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-slate-200/80 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <IconMapPin size={14} className="text-slate-400" />
              High-accuracy GPS coordinates reported through the Field Mobile App
            </span>
            <span className="font-mono text-slate-400">12.9716° N, 77.5946° E</span>
          </div>
        </div>

        {/* Live Active Shifts Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconUsers size={18} className="text-navy-950" />
              <h3 className="font-bold font-display text-navy-950">Active Field Roster</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {shifts.length} Online
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
            {shifts.map((s) => {
              const isSelected = selectedShift?.shiftId === s.shiftId;
              return (
                <div
                  key={s.shiftId}
                  onClick={() => setSelectedShift(s)}
                  className={`p-4 transition-all cursor-pointer ${
                    isSelected ? "bg-gold-50/40 border-l-4 border-gold-500" : "hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 text-sm font-bold flex items-center justify-center shadow-sm">
                      {s.employee?.name?.charAt(0) || "F"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-navy-950 truncate">
                        {s.employee?.name || "Field Officer"}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        ID: {s.employee?.employeeId || s.shiftId?.slice(0, 8)}
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 flex items-center gap-1">
                        <IconMapPin size={12} />
                        Position
                      </span>
                      <span className="font-mono font-medium">
                        {s.location?.lat ? `${s.location.lat.toFixed(4)}, ${s.location.lng.toFixed(4)}` : "HBR Hub"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 flex items-center gap-1">
                        <IconClock size={12} />
                        Clocked In
                      </span>
                      <span className="font-medium">
                        {s.clockInAt ? new Date(s.clockInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {shifts.length === 0 && (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <IconUsers size={32} className="mx-auto opacity-40" />
                <p className="text-sm font-medium">No officers currently clocked in</p>
                <p className="text-xs text-slate-400">
                  Officers will appear here automatically when they clock in via the Field App
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 mt-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <IconShield size={14} className="text-gold-600 shrink-0" />
              <span>Geofencing radius: 100m from assigned client premises</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
