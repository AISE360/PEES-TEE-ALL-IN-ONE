export default function Settings(){
  const SUPPORT={name:"PEES Tee Group Pvt Ltd",address:"HBR Layout, Bengaluru, Karnataka – 560043",email:"admin@peesteegroup.com",phone:"+91 (080) 41289652"};
  const rows=[
    ["App Version","1.0.0 (Demo Build)"],
    ["Backend Mode","In-Memory Mock DB (no Prisma dependency)"],
    ["Demo OTP Code","123456 (for employee MFA + client login)"],
    ["Mock Payment","ENABLED — all payments succeed automatically"],
    ["Socket.IO","ws://localhost:4000 (real-time events)"],
    ["Google Maps Key","AIzaSyD77yl...224cYA (Embed API)"],
    ["CORS Origin","* (demo mode — restrict in production)"],
  ];
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-extrabold text-[#0F2440]">Settings & System Info</h2><p className="text-sm text-slate-500">Demo configuration reference</p></div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-bold text-[#0F2440] mb-4">Demo Configuration</h3>
          <div className="space-y-3">
            {rows.map(([k,v])=>(
              <div key={k} className="flex justify-between border-b pb-2 last:border-0 text-sm">
                <span className="text-slate-500 font-medium">{k}</span>
                <span className="font-semibold text-[#0F2440] max-w-[200px] text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-bold text-[#0F2440] mb-4">Support & Contact</h3>
          <div className="space-y-4">
            {[["\ud83c\udfe2",SUPPORT.name],["\ud83d\udccd",SUPPORT.address],["\ud83d\udcde",SUPPORT.phone],["\u2709\ufe0f",SUPPORT.email]].map(([icon,val])=>(
              <div key={val} className="flex gap-3 text-sm">
                <span className="text-lg w-6">{icon}</span><span className="text-slate-700">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-[#F8FAFC] rounded-xl text-xs text-slate-500">
            <p className="font-bold text-slate-700 mb-1">Demo Accounts</p>
            <p>Admin: EMP00001 / password123</p>
            <p>HR: EMP00125 / password123</p>
            <p>Supervisor: EMP00126 / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
