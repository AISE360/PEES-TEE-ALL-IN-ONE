import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Dashboard(){
  const [data,setData]=useState<any>(null);
  const [reqs,setReqs]=useState<any[]>([]);
  const [premiums,setPremiums]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [stage,setStage]=useState("");

  useEffect(()=>{
    apiFetch("/api/portal/dashboard").then(r=> setData(r.data));
    apiFetch("/api/client-requests").then(r=> setReqs(r.data||[]));
    apiFetch("/api/premium-applications").then(r=> setPremiums(r.data||[]));
  },[]);

  const updateStage = async()=>{
    if(!selected || !stage) return;
    const r = await apiFetch(`/api/client-requests/${selected.id}/stage`, {method:"PATCH", body: JSON.stringify({stage})});
    if(r.success) { setReqs(reqs.map(x=> x.id===selected.id? r.data : x)); setSelected(r.data); }
  };

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Total Requests", data?.totalRequests ?? "—"],
          ["Pending KYC", data?.pendingPremium ?? "—"],
          ["Active Field Staff", data?.activeField ?? "—"],
          ["Leaves Pending", data?.leavesPending ?? "—"],
        ].map(([k,v])=>(
          <div key={k} className="bg-white rounded-2xl p-5 shadow-sm border">
            <div className="text-sm text-slate-500">{k}</div><div className="text-2xl font-extrabold text-[#0F2440] mt-1">{String(v)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Client Requests */}
        <div className="col-span-2 bg-white rounded-2xl border shadow-sm">
          <div className="p-5 border-b flex justify-between items-center"><h3 className="font-bold text-[#0F2440]">Client Requests — Stage Board</h3><span className="text-xs bg-[#F1F5F9] px-3 py-1 rounded-full">Live timeline synced with client app</span></div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500"><tr><th className="text-left p-3">Ref</th><th className="text-left">Service</th><th>Stage</th><th>Updated</th><th></th></tr></thead>
              <tbody>
                {reqs.map(r=>(
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-[#0F2440] font-bold">{r.reference}</td>
                    <td>{r.serviceType}</td>
                    <td><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.stage==="APPLIED"?"bg-slate-100 text-slate-600": r.stage==="CONNECTED"?"bg-blue-50 text-blue-600": r.stage==="IN_PROCESSING"?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700"}`}>{r.stage.replace("_"," ")}</span></td>
                    <td className="text-xs text-slate-500">{new Date(r.updatedAt).toLocaleString()}</td>
                    <td><button onClick={()=> setSelected(r)} className="px-3 py-1.5 rounded-xl bg-[#0F2440] text-white text-xs">Preview</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium / KYC */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-5 border-b"><h3 className="font-bold text-[#0F2440]">Premium Applications</h3><p className="text-xs text-slate-500">Approve / Reject / Flag for review</p></div>
          <div className="p-3 space-y-3 max-h-[420px] overflow-auto">
            {premiums.map(p=>(
              <div key={p.id} className="border rounded-xl p-3">
                <div className="flex justify-between"><span className="font-mono font-bold text-[#0F2440]">{p.referenceNo}</span><span className={`text-xs px-2 py-1 rounded-full ${p.status==="PENDING_REVIEW"?"bg-amber-100 text-amber-700": p.status==="APPROVED"?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-600"}`}>{p.status}</span></div>
                <div className="text-sm mt-1">{p.clientName} • {p.paymentMode} • <span className={p.paymentStatus==="SUCCESSFUL"?"text-emerald-600 font-bold":"text-amber-600"}>{p.paymentStatus}</span></div>
                <div className="flex gap-2 mt-2">
                  <button onClick={async()=>{ const r=await apiFetch(`/api/premium-applications/${p.id}/status`,{method:"PATCH", body:JSON.stringify({status:"APPROVED"})}); if(r.success) setPremiums(prev=> prev.map(x=>x.id===p.id?r.data:x));}} className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs">Approve</button>
                  <button onClick={async()=>{ const r=await apiFetch(`/api/premium-applications/${p.id}/status`,{method:"PATCH", body:JSON.stringify({status:"REJECTED"})}); if(r.success) setPremiums(prev=> prev.map(x=>x.id===p.id?r.data:x));}} className="flex-1 py-1.5 rounded-lg border text-xs">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HR & Ops row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h4 className="font-bold text-[#0F2440]">Daily Performance Audit</h4>
          <div className="mt-3 space-y-2 text-sm">
            {(data?.perEmployee||[]).slice(0,5).map((e:any)=>(
              <div key={e.id} className="flex justify-between border-b py-2"><span>{e.name} <span className="text-xs text-slate-500">({e.role})</span></span><span className="font-bold">{e.requestsHandled} handled • {e.punctuality}%</span></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h4 className="font-bold text-[#0F2440]">Live Map — Active Field Staff</h4>
          <div className="h-[220px] bg-[#E0E7FF] rounded-xl mt-3 flex items-center justify-center text-slate-600">🗺️ Real-time markers + geofence overlays{"\n"}<span className="text-xs">Google Maps + react-native-maps parity</span></div>
          <div className="text-xs text-slate-500 mt-2">Click marker → employee detail (portal pop-up). Updates via WebSocket location_update.</div>
        </div>
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h4 className="font-bold text-[#0F2440]">Shift-Start Directives</h4>
          <textarea id="dir" placeholder="Message for first login of the day..." className="w-full border rounded-xl p-3 mt-3 text-sm h-[120px]"></textarea>
          <button onClick={async()=>{ const el=document.getElementById("dir") as HTMLTextAreaElement; const r=await apiFetch("/api/directives",{method:"POST", body: JSON.stringify({message: el.value, createdBy:"admin"})}); if(r.success) alert("Directive scheduled — field app will show on next first login");}} className="w-full mt-3 py-2.5 rounded-xl bg-[#C6A664] font-bold text-[#0F2440]">Publish Directive</button>
          <p className="text-xs text-slate-500 mt-2">Shown as modal popup on employee first login of the day.</p>
        </div>
      </div>

      {/* Preview modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-40" onClick={()=> setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between"><h3 className="font-bold text-[#0F2440]">Client Preview — {selected.reference}</h3><button onClick={()=> setSelected(null)}>✕</button></div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-500">Service:</span> <b>{selected.serviceType}</b></div>
                <div><span className="text-slate-500">Description:</span> {selected.description}</div>
                <div><span className="text-slate-500">Contact time:</span> {selected.preferredContactTime}</div>
                <div className="flex gap-2 mt-3">
                  <select value={stage} onChange={e=>setStage(e.target.value)} className="border rounded-xl px-3 py-2 text-sm flex-1">
                    <option value="">Move stage...</option><option>APPLIED</option><option>CONNECTED</option><option>IN_PROCESSING</option><option>COMPLETED</option>
                  </select>
                  <button onClick={updateStage} className="px-4 py-2 rounded-xl bg-[#0F2440] text-white text-sm">Update (push to client)</button>
                </div>
                <button onClick={()=> alert("PDF dossier generated (pdf-lib): client info + docs + timeline → download")} className="w-full mt-3 py-2 rounded-xl border font-semibold text-sm">⬇ Export PDF Dossier</button>
              </div>
              <div>
                <div className="bg-[#F8FAFC] rounded-xl p-4">
                  <div className="font-semibold text-sm mb-2">Embedded Document Previews (inline, no download needed)</div>
                  <div className="h-[140px] border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400 text-sm">PDF / Image preview</div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold text-sm">Milestone Timeline (synced with client app)</div>
                  <div className="mt-2 space-y-2">
                    {selected.stageHistory.map((h:any,i:number)=>(
                      <div key={i} className="flex gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-[#C6A664] mt-2"/><div><div className="font-semibold">{h.stage}</div><div className="text-xs text-slate-500">{new Date(h.at).toLocaleString()}</div></div></div>
                    ))}
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
