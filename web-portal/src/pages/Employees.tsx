import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const ROLES = ["FIELD_EMPLOYEE","SUPERVISOR","HR","MANAGER","ADMIN"];
const ROLE_COLORS: Record<string,string> = {
  FIELD_EMPLOYEE:"bg-slate-100 text-slate-600",
  SUPERVISOR:"bg-blue-50 text-blue-600",
  HR:"bg-violet-50 text-violet-600",
  MANAGER:"bg-amber-50 text-amber-700",
  ADMIN:"bg-red-50 text-red-600",
};

export default function Employees(){
  const [emps,setEmps]=useState<any[]>([]);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [role,setRole]=useState("FIELD_EMPLOYEE");
  const [busy,setBusy]=useState(false);
  const [toast,setToast]=useState("");

  const load=()=>apiFetch("/api/employees").then(r=>setEmps(r.data||[]));
  useEffect(()=>{load();},[]);
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),4000);};

  const addEmp=async()=>{
    if(!name.trim()||!phone.trim()){showToast("Name and phone required.");return;}
    setBusy(true);
    const r=await apiFetch("/api/employees",{method:"POST",body:JSON.stringify({name:name.trim(),phone:phone.trim(),role,email:phone.trim()+"@peestee.com"})});
    setBusy(false);
    if(r.success){setEmps(e=>[r.data,...e]);setName("");setPhone("");showToast("Employee "+r.data.name+" ("+r.data.employeeId+") added. Default password: password123");}
    else showToast("Failed: "+(r.error||"unknown"));
  };

  const toggle=async(emp:any)=>{
    const r=await apiFetch("/api/employees/"+emp.id,{method:"PATCH",body:JSON.stringify({isActive:!emp.isActive})});
    if(r.success) setEmps(e=>e.map(x=>x.id===emp.id?r.data:x));
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-[72px] right-6 z-50 bg-[#0F2440] text-white px-5 py-3 rounded-2xl shadow-xl text-sm">{toast}</div>}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F2440]">Employees</h2>
        <p className="text-sm text-slate-500">{emps.length} registered • admin provisioned only</p>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h3 className="font-bold text-[#0F2440] mb-4">Add New Employee</h3>
        <div className="grid grid-cols-4 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name *" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A664]"/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (10 digits) *" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A664]"/>
          <select value={role} onChange={e=>setRole(e.target.value)} className="border rounded-xl px-3 py-2 text-sm">
            {ROLES.map(r=><option key={r}>{r}</option>)}
          </select>
          <button disabled={busy} onClick={addEmp} className="bg-[#0F2440] text-white rounded-xl text-sm font-bold hover:bg-[#1a3a6b] disabled:opacity-50 transition-colors">
            {busy ? "Adding…" : "+ Add Employee"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Default password: password123 — employee must change on first login.</p>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-5 border-b"><h3 className="font-bold text-[#0F2440]">Employee Roster</h3></div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 bg-slate-50">
              <tr><th className="text-left p-3">Employee</th><th className="text-left">ID</th><th>Role</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {emps.map(e=>(
                <tr key={e.id} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0F2440] text-white text-xs flex items-center justify-center font-bold">{e.name.charAt(0)}</div>
                      <span className="font-semibold">{e.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-slate-600">{e.employeeId||"—"}</td>
                  <td className="text-center">
                    <span className={"text-xs px-2 py-1 rounded-full font-bold "+(ROLE_COLORS[e.role]||"bg-slate-100 text-slate-600")}>{e.role}</span>
                  </td>
                  <td className="text-slate-600">{e.phone}</td>
                  <td className="text-center">
                    <span className={"text-xs px-2 py-1 rounded-full font-bold "+(e.isActive?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-500")}>{e.isActive?"Active":"Inactive"}</span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={()=>toggle(e)} className={"px-3 py-1 rounded-lg text-xs font-semibold transition-colors "+(e.isActive?"bg-red-50 text-red-600 hover:bg-red-100":"bg-emerald-50 text-emerald-600 hover:bg-emerald-100")}>
                      {e.isActive?"Deactivate":"Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {emps.length===0 && <tr><td colSpan={6} className="p-6 text-center text-slate-400">No employees found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
