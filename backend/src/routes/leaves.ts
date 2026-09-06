import { Router } from "express";
import { mockDB } from "../mockDb.js";
export const leavesRouter = Router();
leavesRouter.get("/", (req,res)=>{
  const {employeeId} = req.query;
  let items = mockDB.leaves;
  if(employeeId) items = items.filter(l=>l.employeeId===employeeId);
  res.json({success:true, data: items});
});
leavesRouter.post("/", (req,res)=>{
  const {employeeId, from, to, reason} = req.body;
  const entry = {id:`l_${Date.now()}`, employeeId, from, to, reason, status:"PENDING", createdAt:new Date().toISOString()};
  mockDB.leaves.unshift(entry);
  res.status(201).json({success:true, data:entry});
});
leavesRouter.patch("/:id", (req,res)=>{
  const item = mockDB.leaves.find(l=>l.id===req.params.id);
  if(!item) return res.status(404).json({success:false});
  Object.assign(item, req.body);
  res.json({success:true, data:item});
});
