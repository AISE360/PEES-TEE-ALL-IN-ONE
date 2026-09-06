import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { clientRequestsRouter } from "./routes/clientRequests.js";
import { premiumRouter } from "./routes/premium.js";
import { employeesRouter } from "./routes/employees.js";
import { shiftsRouter } from "./routes/shifts.js";
import { leavesRouter } from "./routes/leaves.js";
import { miscRouter } from "./routes/misc.js";

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req,res)=> res.json({ok:true, service:"PEES Tee Backend", version:"1.0.0"}));
app.use("/api/auth", authRouter);
app.use("/api/client-requests", clientRequestsRouter);
app.use("/api/premium-applications", premiumRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/shifts", shiftsRouter);
app.use("/api/leaves", leavesRouter);
app.use("/api", miscRouter);

// fallback
app.use((req,res)=> res.status(404).json({success:false, error:"Not found"}));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*"}});
(global as any).io = io;

io.on("connection", socket=>{
  console.log("socket connected", socket.id);
  socket.on("disconnect", ()=> console.log("socket disconnect", socket.id));
});

httpServer.listen(config.port, ()=> console.log(`✅ PEES Tee Backend running http://localhost:${config.port} | health /health`));
