import { Router } from "express";
import { mockDB } from "../mockDb.js";
import { withinGeofence } from "../utils/geo.js";

export const shiftsRouter = Router();

shiftsRouter.get("/", (req, res) => {
  res.json({ success: true, data: mockDB.shifts });
});

shiftsRouter.get("/active", (req, res) => {
  res.json({ success: true, data: mockDB.shifts.filter(s => s.isActive) });
});

// Clock in - geo-fenced
shiftsRouter.post("/clock-in", (req, res) => {
  const { employeeId, lat, lng, selfie } = req.body;
  const user = mockDB.users.find(u => u.id === employeeId);
  if (!user) return res.status(404).json({ success: false, error: "Employee not found" });
  const allowedRoles = ["HR","SUPERVISOR","MANAGER"];
  if (!allowedRoles.includes(user.role)) return res.status(403).json({ success:false, error:"Role not allowed to clock-in" });
  if (user.assignedSite && lat && lng) {
    if (!withinGeofence({lat,lng}, user.assignedSite)) {
      return res.status(400).json({ success:false, error:"Outside geofence - cannot clock in" });
    }
  }
  if (!selfie) return res.status(400).json({ success:false, error:"Live selfie required" });
  const shift = { id:`sh_${Date.now()}`, employeeId, clockInAt: new Date().toISOString(), clockInLocation:{lat,lng}, clockInSelfie: selfie, isActive: true };
  mockDB.shifts.push(shift);
  (global as any).io?.emit("shift_clock_in", shift);
  res.status(201).json({ success:true, data: shift });
});

shiftsRouter.post("/clock-out", (req, res) => {
  const { employeeId, lat, lng } = req.body;
  const active = [...mockDB.shifts].reverse().find(s=>s.employeeId===employeeId && s.isActive);
  if(!active) return res.status(404).json({success:false, error:"No active shift"});
  active.isActive = false;
  (active as any).clockOutAt = new Date().toISOString();
  (active as any).clockOutLocation = {lat,lng};
  (global as any).io?.emit("shift_clock_out", active);
  res.json({success:true, data:active});
});

// GPS telemetry update
shiftsRouter.post("/location", (req, res) => {
  const { employeeId, lat, lng } = req.body;
  (global as any).io?.emit("location_update", { employeeId, lat, lng, at: new Date().toISOString() });
  res.json({success:true});
});
