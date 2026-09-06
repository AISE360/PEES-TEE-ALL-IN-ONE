import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

function Badge({s}:{s:string}){
  const cls = "text-xs px-2 py-1 rounded-full font-bold " + (s==="PENDING"?"bg-amber-100 text-amber-700":s==="APPROVED"?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-500");
  return <span className={cls}>{s}</span>;
}

export default function HRLeave(){
  const [leaves,setLeaves]=useState<any[]>([]);
  const [slips,setSlips]=useState<any[]>([]);
  const [busy,setBusy]=useState<string|null>(null);
  const [toast,setToast]=useState("");
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),4000);};

  useEffect(()=>{
    apiFetch("/api/leaves").then(r=>setLeaves(r.data||[]));
    apiFetch("/api/salary-slips").then(r=>setSlips(r.data||[]));
  },[]);

  const approve=async(id:string,s:"APPROVED"|"REJECTED")=>{
    setBusy(id+s);
    const r=await apiFetch("/api/leaves/"+id,{method:"PATCH",body:JSON.stringify({status:s})});
    setBusy(null);
    if(r.success){setLeaves(l=>l.map(x=>x.id===id?r.data:x));showToast("Leave "+id+" updated to "+s);}
    else showToast("Failed");
  };

  return (
    <div className="space-y-6">
      {toast&&<div className="fixed top-[72px] right-6 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-xl text-sm">{toast}</div>}
      <div><h2 className="text-xl font-extrabold text-[#0F2440]">HR & Leave Management</h2><p className="text-sm text-slate-500">Approve or reject employee leave requests</p></div>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-5 border-b flex justify-between"><h3 className="font-bold text-[#0F2440]">Leave Requests</h3><span className="text-xs text-slate-500">{leaves.filter(l=>l.status==="PENDING").length} pending</span></div>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 bg-slate-50"><tr><th className="text-left p-3">Employee</th><th>Type</th><th>Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {leaves.map(l=>(
              <tr key={l.id} className="border-t hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold">{l.employeeId}</td>
                <td className="text-center"><span className="text-xs px-2 py-1 rounded-full bg-slate-100">{l.leaveType||"—"}</span></td>
                <td className="text-slate-600">{l.fromDate} → {l.toDate}</td>
                <td className="text-slate-600 max-w-[200px] truncate">{l.reason||"—"}</td>
                <td className="text-center"><Badge s={l.status}/></td>
                <td className="p-3 flex gap-2">
                  {l.status==="PENDING"&&<>
                    <button disabled={busy===l.id+"APPROVED"} onClick={()=>approve(l.id,"APPROVED")} className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs disabled:opacity-50">Approve</button>
                    <button disabled={busy===l.id+"REJECTED"} onClick={()=>approve(l.id,"REJECTED")} className="px-3 py-1 rounded-lg border text-xs disabled:opacity-50">Reject</button>
                  </>}
                </td>
              </tr>
            ))}
            {leaves.length===0&&<tr><td colSpan={6} className="p-6 text-center text-slate-400">No leave requests</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-5 border-b"><h3 className="font-bold text-[#0F2440]">Salary Slips</h3></div>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 bg-slate-50"><tr><th className="text-left p-3">Employee ID</th><th>Month</th><th>PDF</th></tr></thead>
          <tbody>
            {slips.map(s=>(
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{s.employeeId}</td>
                <td>{s.month}</td>
                <td><button onClick={()=>alert("Salary slip PDF: "+s.pdfUrl+" (Opens securely-signed S3 URL in production)")} className="px-3 py-1 rounded-lg bg-[#0F2440] text-white text-xs">View Slip</button></td>
              </tr>
            ))}
            {slips.length===0&&<tr><td colSpan={3} className="p-6 text-center text-slate-400">No salary slips uploaded</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
