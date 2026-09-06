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
    perEmployee: mockDB.users.filter(u=>u.role!=="CLIENT").map(u=>({id:u.id,name:u.name,role:u.role, requestsHandled: Math.floor(Math.random()*20), punctuality: 92}))
  }});
});

miscRouter.get("/portal/live-map", (req,res)=>{
  const active = mockDB.shifts.filter(s=>s.isActive).map(s=>{
    const user = mockDB.users.find(u=>u.id===s.employeeId);
    return {shiftId:s.id, employee: user, location: s.clockInLocation};
  });
  res.json({success:true, data:active});
});

miscRouter.get("/notifications", (req,res)=>{
  res.json({success:true, data: mockDB.notifications.slice(0,20)});
});

miscRouter.post("/upload", (req,res)=>{
  // mock – in prod uses multer + sharp + S3
  res.json({success:true, data:{url:`/uploads/mock_${Date.now()}.pdf`, sizeKb: 240}});
});

miscRouter.get("/support-directory", (req,res)=>{
  res.json({success:true, data:{ name:"PEES Tee Group Pvt Ltd", address:"HBR Layout, Bengaluru, Karnataka - 560043", email:"info@peesteegroup.com", phone:"+91 (080) 41289652", website:"www.peesteegroup.com"}});
});
