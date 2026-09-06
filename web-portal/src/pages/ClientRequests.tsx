import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const STAGES=["APPLIED","CONNECTED","IN_PROCESSING","COMPLETED"];
const STAGE_COLORS: Record<string,string> = {APPLIED:"bg-slate-100 text-slate-600",CONNECTED:"bg-blue-50 text-blue-600",IN_PROCESSING:"bg-amber-100 text-amber-700",COMPLETED:"bg-emerald-100 text-emerald-700"};

export default function ClientRequests(){
  const [reqs,setReqs]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [stage,setStage]=useState("");
  const [busy,setBusy]=useState(false);
  const [toast,setToast]=useState("");
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),4000);};

  useEffect(()=>{apiFetch("/api/client-requests").then(r=>setReqs(r.data||[]));},[]);

  const updateStage=async()=>{
    if(!selected||!stage)return;
    setBusy(true);
    const r=await apiFetch(`/api/client-requests/${selected.id}/stage`,{method:"PATCH",body:JSON.stringify({stage})});
    setBusy(false);
    if(r.success){setReqs(x=>x.map(q=>q.id===selected.id?r.data:q));setSelected(r.data);setStage("");showToast(`${r.data.reference} moved to ${stage}`);}
    else showToast("Failed: "+(r.error||"unknown"));
  };

  const exportDossier=()=>{
    if(!selected)return;
    const timeline = selected.stageHistory.map((h: any) => `<p>Stage: ${h.stage} at ${new Date(h.at).toLocaleString()}</p>`).join("");
    const html=`<!DOCTYPE html><html><head><title>Dossier ${selected.reference}</title><style>body{font-family:Arial;padding:32px;color:#0F2440}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}</style></head><body><h2>PEES Tee Group Pvt Ltd</h2><h3>Client Request Dossier - ${selected.reference}</h3><table><tr><th>Field</th><th>Value</th></tr><tr><td>Service</td><td>${selected.serviceType}</td></tr><tr><td>Description</td><td>${selected.description}</td></tr><tr><td>Stage</td><td>${selected.stage}</td></tr><tr><td>Contact Time</td><td>${selected.preferredContactTime||"-"}</td></tr><tr><td>Created</td><td>${new Date(selected.createdAt).toLocaleString()}</td></tr></table><h4>Timeline</h4>${timeline}</body></html>`;
    const w=window.open("","_blank");w?.document.write(html);w?.document.close();w?.print();
  };

  return (
    <div className="space-y-6">
      {toast&&<div className="fixed top-[72px] right-6 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-xl text-sm">{toast}</div>}
      <div><h2 className="text-xl font-extrabold text-[#0F2440]">Client Requests</h2><p className="text-sm text-slate-500">{reqs.length} total</p></div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 bg-slate-50"><tr><th className="text-left p-3">Ref</th><th className="text-left">Service</th><th>Stage</th><th>Created</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {reqs.map(r=>(
              <tr key={r.id} className="border-t hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono font-bold text-[#0F2440]">{r.reference}</td>
                <td className="text-slate-600">{r.serviceType}</td>
                <td className="text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-bold ${STAGE_COLORS[r.stage]||"bg-slate-100 text-slate-500"}`}>{r.stage.replace("_"," ")}</span></td>
                <td className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="text-xs text-slate-500">{new Date(r.updatedAt).toLocaleString()}</td>
                <td className="p-2"><button onClick={()=>{setSelected(r);setStage("");}} className="px-3 py-1.5 rounded-xl bg-[#0F2440] text-white text-xs hover:bg-[#1a3a6b]">Preview</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected&&(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-40" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <div><h3 className="font-bold text-[#0F2440]">{selected.reference}</h3><p className="text-xs text-slate-500">{selected.serviceType}</p></div>
              <button onClick={()=>setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100">x</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div><span className="text-slate-500">Description:</span> {selected.description}</div>
              <div><span className="text-slate-500">Contact time:</span> {selected.preferredContactTime||"-"}</div>
              <div className="flex gap-2">
                <select value={stage} onChange={e=>setStage(e.target.value)} className="border rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none">
                  <option value="">Move to stage...</option>
                  {STAGES.map(s=><option key={s}>{s}</option>)}
                </select>
                <button disabled={!stage||busy} onClick={updateStage} className="px-4 py-2 rounded-xl bg-[#0F2440] text-white text-sm disabled:opacity-50">{busy?"...":"Update"}</button>
              </div>
              <button onClick={exportDossier} className="w-full py-2 rounded-xl border text-sm font-semibold hover:bg-slate-50">Download PDF Dossier</button>
              <div>
                <div className="font-semibold mb-2">Timeline</div>
                {selected.stageHistory.map((h:any,i:number)=>(
                  <div key={i} className="flex gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-[#C6A664] mt-2 shrink-0"/><div><div className="font-semibold">{h.stage.replace("_"," ")}</div><div className="text-xs text-slate-500">{new Date(h.at).toLocaleString()}</div></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
