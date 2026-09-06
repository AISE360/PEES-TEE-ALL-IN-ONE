import { Router } from "express";
import { mockDB } from "../mockDb.js";
import { AuthRequest } from "../middleware/auth.js";
import { sendSmsAndEmail } from "../utils/notify.js";

export const clientRequestsRouter = Router();

// GET /api/client-requests (list - portal + client history)
clientRequestsRouter.get("/", (req: AuthRequest, res) => {
  const { clientId, stage } = req.query;
  let items = mockDB.clientRequests;
  if (clientId) items = items.filter(i => i.clientId === clientId);
  if (stage) items = items.filter(i => i.stage === stage);
  res.json({ success: true, data: items });
});

// POST /api/client-requests
clientRequestsRouter.post("/", async (req: AuthRequest, res) => {
  const { serviceType, description, preferredContactTime, attachments, clientId } = req.body;
  if (!serviceType) return res.status(400).json({ success: false, error: "serviceType required" });
  const id = `cr_${Date.now()}`;
  const entry = {
    id,
    clientId: clientId || req.body.phone || "u_client",
    serviceType, description, preferredContactTime, attachments: attachments || [],
    stage: "APPLIED",
    stageHistory: [{ stage: "APPLIED", at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reference: `PT${String(Math.floor(10000+Math.random()*90000))}`
  };
  mockDB.clientRequests.unshift(entry);
  mockDB.notifications.unshift({ id:`n_${Date.now()}`, type:"NEW_CLIENT_REQUEST", payload: entry, createdAt: new Date().toISOString() });
  // realtime
  (global as any).io?.emit("new_client_request", entry);
  // simultaneous SMS + Email
  sendSmsAndEmail(entry.clientId, "client@example.com", `Your quote request ${entry.reference} for ${serviceType} has been received. - PEES Tee`);
  res.status(201).json({ success: true, data: entry });
});

// PATCH /api/client-requests/:id/stage
clientRequestsRouter.patch("/:id/stage", (req, res) => {
  const { stage } = req.body;
  const item = mockDB.clientRequests.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: "Not found" });
  const allowed = ["APPLIED","CONNECTED","IN_PROCESSING","COMPLETED"];
  if (!allowed.includes(stage)) return res.status(400).json({ success: false, error: "Invalid stage" });
  item.stage = stage;
  item.stageHistory.push({ stage, at: new Date().toISOString() });
  item.updatedAt = new Date().toISOString();
  (global as any).io?.emit("stage_change", item);
  sendSmsAndEmail(item.clientId, "client@example.com", `Your request ${item.reference} moved to ${stage}`);
  res.json({ success: true, data: item });
});

// GET /api/client-requests/:id/dossier -> mock PDF
clientRequestsRouter.get("/:id/dossier", (req, res) => {
  const item = mockDB.clientRequests.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true, data: { dossierUrl: `/api/client-requests/${item.id}/dossier.pdf`, item } });
});
