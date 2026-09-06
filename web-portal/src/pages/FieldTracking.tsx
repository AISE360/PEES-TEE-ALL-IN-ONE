import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const MAPS_KEY = "AIzaSyD77yl0_MV4lnaax5oko7kg_ouls224cYA";

export default function FieldTracking(){
  const [shifts,setShifts]=useState<any[]>([]);
  const load=()=>apiFetch("/api/portal/live-map").then(r=>setShifts(r.data||[]));
  useEffect(()=>{load(); const t=setInterval(load,15000); return()=>clearInterval(t);},[]);

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-extrabold text-[#0F2440]">Field Tracking — Live Map</h2><p className="text-sm text-slate-500">Auto-refreshes every 15 seconds • {shifts.length} active employee(s)</p></div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <iframe
            title="Field Tracking Map"
            width="100%" height="460"
            style={{border:0}}
            loading="lazy"
            src={"https://www.google.com/maps/embed/v1/place?key=" + MAPS_KEY + "&q=HBR+Layout,Bengaluru,Karnataka&zoom=14&maptype=roadmap"}
          />
          <div className="px-5 py-3 border-t text-xs text-slate-500">📍 Centered on HBR Layout HQ • Live GPS coordinates pushed via WebSocket in production</div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold text-[#0F2440]">Active Shifts</h3><button onClick={load} className="text-xs px-3 py-1 rounded-lg border hover:bg-slate-50">↺ Refresh</button></div>
          <div className="divide-y max-h-[400px] overflow-auto">
            {shifts.map(s=>(
              <div key={s.shiftId} className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0F2440] text-white text-xs flex items-center justify-center font-bold">{s.employee?.name?.charAt(0)||"?"}</div>
                  <div><div className="font-semibold text-sm">{s.employee?.name||"Unknown"}</div><div className="text-xs text-slate-500">{s.employee?.role}</div></div>
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                </div>
                <div className="mt-2 text-xs text-slate-600">📍 {s.location?.lat?.toFixed(4)||"—"}, {s.location?.lng?.toFixed(4)||"—"}</div>
                <div className="text-xs text-slate-400">Clock-in: {s.clockInAt ? new Date(s.clockInAt).toLocaleString() : "—"}</div>
              </div>
            ))}
            {shifts.length===0&&<div className="p-6 text-center text-slate-400 text-sm">No active shifts right now</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
