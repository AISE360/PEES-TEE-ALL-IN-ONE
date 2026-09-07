import { Router } from "express";
import { mockDB } from "../mockDb.js";

export const miscRouter = Router();

miscRouter.get("/directives/today", (req,res)=>{
  const today = new Date().toISOString().slice(0,10);
  const d = mockDB.directives.find(x=>x.date===today) || mockDB.directives[0];
  res.json({success:true, data:d});
});
miscRouter.post("/directives", (req,res)=>{
  const {message, date, createdBy} = req.body;
  const entry = {id:`d_${Date.now()}`, message, date: date || new Date().toISOString().slice(0,10), createdBy};
  mockDB.directives.unshift(entry);
  res.status(201).json({success:true, data:entry});
});

miscRouter.get("/salary-slips", (req,res)=>{
  const {employeeId} = req.query;
  let items = mockDB.salarySlips;
  if(employeeId) items = items.filter(s=>s.employeeId===employeeId);
  res.json({success:true, data:items});
});
miscRouter.post("/salary-slips", (req,res)=>{
  const {employeeId, month, pdfUrl} = req.body;
  const entry = {id:`s_${Date.now()}`, employeeId, month, pdfUrl};
  mockDB.salarySlips.push(entry);
  res.status(201).json({success:true, data:entry});
});

miscRouter.get("/portal/dashboard", (req,res)=>{
  res.json({success:true, data:{
    totalRequests: mockDB.clientRequests.length,
    pendingPremium: mockDB.premiumApps.filter(p=>p.status==="PENDING_REVIEW").length,
    activeField: mockDB.shifts.filter(s=>s.isActive).length,
    leavesPending: mockDB.leaves.filter(l=>l.status==="PENDING").length,
    recentRequests: mockDB.clientRequests.slice(0,5),
    perEmployee: mockDB.users.filter(u=>u.role!=="CLIENT").map(u=>({id:u.id,name:u.name,role:u.role, requestsHandled: Math.floor(Math.random()*20), punctuality: 88+Math.floor(Math.random()*12)}))
  }});
});

miscRouter.get("/portal/live-map", (req,res)=>{
  const active = mockDB.shifts.filter(s=>s.isActive).map(s=>{
    const user = mockDB.users.find(u=>u.id===s.employeeId);
    return {shiftId:s.id, employee: user, location: s.clockInLocation, clockInAt: s.clockInAt};
  });
  res.json({success:true, data:active});
});

miscRouter.get("/notifications", (req,res)=>{
  res.json({success:true, data: mockDB.notifications.slice(0,20)});
});

miscRouter.post("/upload", (req,res)=>{
  // mock – in prod uses multer + sharp + S3
  res.json({success:true, data:{url:`/uploads/mock_${Date.now()}.pdf`, sizeKb: Math.floor(80+Math.random()*160)}});
});

miscRouter.get("/support-directory", (req,res)=>{
  res.json({success:true, data:{
    name:"PEES Tee Group Pvt Ltd",
    tagline:"Building Trust. Developing Land.",
    address:"#112, 4th Cross, 1st Block, HBR Layout, Bengaluru, Karnataka - 560043",
    regdOffice:"#60, 10th Cross, Masjid Road, Devasandra, Bengaluru - 560036",
    email:"info@peesteegroup.com",
    phone:"+91 89519 37171",
    landline:"080-41289652",
    website:"www.peesteegroup.com",
    hours:"Mon–Sat, 9:30 AM – 6:30 PM IST",
    branches:[
      { name:"Head Office — HBR Layout", address:"#112, 4th Cross, 1st Block, HBR Layout, Bengaluru - 560043", phone:"+91 89519 37171" },
      { name:"KR Puram Branch", address:"3rd Cross, Haadi Masjid Road, Devasandra, KR Puram, Bengaluru - 560036", phone:"+91 99027 25132" },
      { name:"Belagavi Regional Branch", address:"Belagavi, Karnataka", phone:"+91 89519 37171" },
      { name:"KGF Site Office", address:"KGF Project Site, Karnataka", phone:"+91 89519 37171" },
    ],
  }});
});

// Public site content (mirrors peesteegroup.com) — consumed by web-portal, client & employee apps
miscRouter.get("/site-content", (req,res)=>{
  res.json({success:true, data:{
    hero:{ title:"Land Development, Documentation & Logistics — Done Right.", tagline:"Building Trust. Developing Land.",
      sub:"Trusted corporate solutions for Land Purchase, Land Improvement, Land Development, Property Documentation, Cargo Handling, Warehousing & Logistics across India." },
    verticals:[
      { id:"land-purchase", title:"Land Purchase & Due Diligence", desc:"30-year EC audit, advocate title search, escrow-safe transactions." },
      { id:"land-improvement", title:"Land Improvement & Survey", desc:"DGPS + Mojini, fencing, levelling, agri-land prep." },
      { id:"land-development", title:"Land Development & Layouts", desc:"BDA/BMRDA-approved residential, commercial & industrial layouts." },
      { id:"documentation", title:"Property Documentation", desc:"E-Khata/A/B-Khata, EC, mutation, DC conversion, Kaveri registration." },
      { id:"govt-docs", title:"Government & Essential Docs", desc:"Aadhaar/PAN, ration, caste/income, GST, MSME/Udyam, IEC, company setup." },
      { id:"logistics", title:"Cargo, Warehousing & Logistics", desc:"GPS-tracked fleet, heavy lift, containers, warehousing pan-India." },
    ],
    stages:["APPLIED","CONNECTED","IN_PROCESSING","COMPLETED"],
    contact:{ helpline:"+91 89519 37171", landline:"080-41289652", email:"info@peesteegroup.com", website:"www.peesteegroup.com",
      address:"#112, 4th Cross, 1st Block, HBR Layout, Bengaluru - 560043", hours:"Mon–Sat, 9:30 AM – 6:30 PM IST" },
  }});
});

// EOD Reports
miscRouter.get("/eod-reports", (req,res)=>{
  const {employeeId} = req.query;
  let items = (mockDB as any).eodReports || [];
  if(employeeId) items = items.filter((r:any)=>r.employeeId===employeeId);
  res.json({success:true, data:items});
});
miscRouter.post("/eod-reports", (req,res)=>{
  const {employeeId, activities, collections, notes} = req.body;
  if(!(mockDB as any).eodReports) (mockDB as any).eodReports = [];
  const entry = {id:`eod_${Date.now()}`, employeeId: employeeId||"u_hr", date: new Date().toISOString().slice(0,10), activities, collections: collections||"—", notes: notes||"—", createdAt: new Date().toISOString()};
  (mockDB as any).eodReports.unshift(entry);
  res.status(201).json({success:true, data:entry});
});
