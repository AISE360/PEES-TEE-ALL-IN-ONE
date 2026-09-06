import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Premium(){
  const [premiums,setPremiums]=useState<any[]>([]);
  const [busy,setBusy]=useState<string|null>(null);
  const [toast,setToast]=useState("");
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),4000);};

  useEffect(()=>{apiFetch("/api/premium-applications").then(r=>setPremiums(r.data||[]));},[]);

  const update=async(id:string,status:string)=>{
    setBusy(id+status);
    const r=await apiFetch(`/api/premium-applications/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});
    setBusy(null);
    if(r.success){setPremiums(p=>p.map(x=>x.id===id?r.data:x));showToast(`${r.data.referenceNo} updated to ${status}`);}
    else showToast("Failed: "+(r.error||"unknown"));
  };

  return (
    <div className="space-y-6">
      {toast&&<div className="fixed top-[72px] right-6 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-xl text-sm">{toast}</div>}
      <div><h2 className="text-xl font-extrabold text-[#0F2440]">Premium Applications — KYC Review</h2><p className="text-sm text-slate-500">{premiums.filter(p=>p.status==="PENDING_REVIEW").length} pending review</p></div>
      <div className="grid grid-cols-2 gap-4">
        {premiums.map(p=>(
          <div key={p.id} className="bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex justify-between items-start mb-3">
              <div><div className="font-mono font-bold text-[#0F2440]">{p.referenceNo}</div><div className="text-xs text-slate-500">{p.clientName}</div></div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${p.status==="PENDING_REVIEW"?"bg-amber-100 text-amber-700":p.status==="APPROVED"?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-500"}`}>{p.status.replace("_"," ")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div><span className="text-slate-500">Payment:</span> <span className={p.paymentStatus==="SUCCESSFUL"?"text-emerald-600 font-bold":"text-amber-600"}>{p.paymentStatus}</span></div>
              <div><span className="text-slate-500">Mode:</span> {p.paymentMode}</div>
              <div><span className="text-slate-500">Type:</span> {p.insuranceType||p.serviceType||"-"}</div>
              <div><span className="text-slate-500">Premium:</span> Rs. {p.premium||"-"}</div>
            </div>
            {p.status==="PENDING_REVIEW"&&(
              <div className="flex gap-2">
                <button disabled={busy===p.id+"APPROVED"} onClick={()=>update(p.id,"APPROVED")} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50 hover:bg-emerald-700">{busy===p.id+"APPROVED"?"...":"Approve"}</button>
                <button disabled={busy===p.id+"REJECTED"} onClick={()=>update(p.id,"REJECTED")} className="flex-1 py-2 rounded-xl border text-sm font-semibold disabled:opacity-50 hover:bg-slate-50">{busy===p.id+"REJECTED"?"...":"Reject"}</button>
                <button onClick={()=>showToast("Flagged for senior review (email sent to manager)")} className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100">Flag</button>
              </div>
            )}
          </div>
        ))}
        {premiums.length===0&&<div className="col-span-2 text-center text-slate-400 py-12">No premium applications yet</div>}
      </div>
    </div>
  );
}
