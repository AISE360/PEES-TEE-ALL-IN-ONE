import { Router } from "express";
import { mockDB } from "../mockDb.js";
import { generateReference } from "../utils/reference.js";
import { sendSmsAndEmail } from "../utils/notify.js";

export const premiumRouter = Router();

premiumRouter.get("/", (req, res) => {
  res.json({ success: true, data: mockDB.premiumApps });
});

premiumRouter.post("/", async (req, res) => {
  const { employeeId, clientName, dob, address, contact, kycDocs, paymentMode, paymentStatus } = req.body;
  if (paymentStatus !== "SUCCESSFUL") {
    return res.status(400).json({ success: false, error: "Payment must be SUCCESSFUL before submission (Submit gated)" });
  }
  const existing = new Set(mockDB.premiumApps.map(p => p.referenceNo));
  const referenceNo = generateReference(existing);
  const app = {
    id: `pa_${Date.now()}`,
    referenceNo,
    employeeId: employeeId || "u_hr",
    clientName, dob, address, contact,
    kycDocs: kycDocs || [],
    paymentMode: paymentMode || "CASH",
    paymentStatus,
    status: "PENDING_REVIEW",
    createdAt: new Date().toISOString()
  };
  mockDB.premiumApps.unshift(app);
  mockDB.notifications.unshift({ id:`n_${Date.now()}`, type:"NEW_PREMIUM", payload: app, createdAt: new Date().toISOString() });
  (global as any).io?.emit("new_premium_quote", app);
  await sendSmsAndEmail(contact, `${contact}@example.com`, `Your PEES Tee application ${referenceNo} is confirmed. Reference: ${referenceNo}`);
  res.status(201).json({ success: true, data: app });
});

premiumRouter.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  const app = mockDB.premiumApps.find(p => p.id === req.params.id);
  if (!app) return res.status(404).json({ success: false, error: "Not found" });
  app.status = status;
  res.json({ success: true, data: app });
});
