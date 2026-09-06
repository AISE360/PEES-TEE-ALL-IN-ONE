import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const nav = ["Dashboard","Client Requests","Premium Applications","Employees","HR & Leave","Field Tracking","Reports","Settings"];

export default function Layout({children}:{children:React.ReactNode}){
  const [toasts,setToasts]=useState<string[]>([]);
  const [bell,setBell]=useState(2);
  useEffect(()=>{
    const s = io((import.meta as any).env?.VITE_API_URL || "http://localhost:4000");
    s.on("new_client_request", (p:any)=> { setToasts(t=>[...t, `New client quote: ${p.serviceType} #${p.reference}`]); setBell(b=>b+1); setTimeout(()=> setToasts(t=>t.slice(1)), 4000); });
    s.on("new_premium_quote", (p:any)=> { setToasts(t=>[...t, `New premium KYC: ${p.referenceNo}`]); setBell(b=>b+1); });
    s.on("stage_change", (p:any)=> setToasts(t=>[...t.slice(-2), `Stage: ${p.reference} -> ${p.stage}`]));
    return ()=>{ s.disconnect(); };
  },[]);
  return (
    <div className="min-h-screen flex">
      <aside className="w-[240px] bg-[#0F2440] text-white flex flex-col">
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C6A664] flex items-center justify-center text-[#0F2440] font-black">P</div>
          <div><div className="font-extrabold leading-none">PEES Tee</div><div className="text-[11px] text-white/60">Head Office Portal</div></div>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {nav.map(n=>(
            <a key={n} href="#" className={`block px-3 py-2.5 rounded-xl text-sm ${n==="Dashboard"?"bg-white text-[#0F2440] font-bold":"text-white/70 hover:bg-white/10 hover:text-white"}`}>{n}</a>
          ))}
        </nav>
        <div className="p-4 text-xs text-white/40">© PEES Tee Group Pvt Ltd</div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-[64px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="font-semibold text-[#0F2440]">Head Office — Operations Console</div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">🔔</button>
              {bell>0 && <span className="absolute -top-1 -right-1 bg-[#E02424] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center">{bell}</span>}
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0F2440] text-white flex items-center justify-center font-bold">AD</div>
          </div>
        </header>
        {/* toasts */}
        <div className="fixed top-[72px] right-6 space-y-2 z-50">
          {toasts.map((t,i)=>(<div key={i} className="bg-[#0F2440] text-white px-4 py-3 rounded-xl shadow-xl text-sm animate-pulse">{t}</div>))}
        </div>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
