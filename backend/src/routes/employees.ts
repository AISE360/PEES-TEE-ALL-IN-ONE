import { Router } from "express";
import bcrypt from "bcryptjs";
import { mockDB } from "../mockDb.js";

export const employeesRouter = Router();

employeesRouter.get("/", (req, res) => {
  res.json({ success: true, data: mockDB.users.filter(u => u.role !== "CLIENT") });
});

employeesRouter.post("/", async (req, res) => {
  const { name, phone, email, role, assignedSite } = req.body;
  if (!phone || !name) return res.status(400).json({ success: false, error: "name, phone required" });
  const id = `u_${Date.now()}`;
  const employeeId = `EMP${String(mockDB.users.length+1).padStart(5,"0")}`;
  const user = { id, phone, name, email, role: role || "FIELD_EMPLOYEE", isActive: true, employeeId, assignedSite, passwordHash: await bcrypt.hash("password123",10) };
  mockDB.users.push(user);
  // mock SMS credentials
  console.log(`[Provisioned ${role} ${name} ${phone} pwd: password123]`);
  res.status(201).json({ success: true, data: user });
});

employeesRouter.patch("/:id", (req, res) => {
  const u = mockDB.users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false, error:"Not found"});
  Object.assign(u, req.body);
  res.json({ success:true, data: u });
});

employeesRouter.post("/:id/reset-password", async (req, res) => {
  const u = mockDB.users.find(x=>x.id===req.params.id);
  if(!u) return res.status(404).json({success:false});
  u.passwordHash = await bcrypt.hash("password123",10);
  res.json({success:true, message:"Reset to password123 (mock)"});
});
