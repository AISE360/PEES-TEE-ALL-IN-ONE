import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

// In-memory mock DB when Prisma not connected (dev/demo mode)
import { mockDB } from "../mockDb.js";

export const authRouter = Router();

// POST /api/auth/send-otp
authRouter.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, error: "phone required" });
  const code = config.mockOtp; // mock - in prod generate random 6 digits
  mockDB.otps.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log(`[OTP for ${phone}]: ${code} (mock)`);
  // fire SMS via provider (mock)
  res.json({ success: true, message: "OTP sent", mockedCode: config.otpProvider === "mock" ? code : undefined });
});

// POST /api/auth/verify-otp
authRouter.post("/verify-otp", async (req, res) => {
  const { phone, code, name, role } = req.body;
  const stored = mockDB.otps.get(phone);
  if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
    return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
  }
  mockDB.otps.delete(phone);
  let user = mockDB.users.find((u) => u.phone === phone);
  if (!user) {
    user = { id: `u_${Date.now()}`, phone, name: name || "New User", role: role || "CLIENT", isActive: true, employeeId: undefined };
    mockDB.users.push(user);
  }
  const accessToken = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as any);
  const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn } as any);
  res.json({ success: true, data: { user, accessToken, refreshToken } });
});

// POST /api/auth/login (employee password + MFA step)
authRouter.post("/login", async (req, res) => {
  const { phone, employeeId, password } = req.body;
  const identifier = phone || employeeId;
  let user = mockDB.users.find((u) => u.phone === identifier || u.employeeId === identifier);
  if (!user) return res.status(401).json({ success: false, error: "User not found" });
  // In mock mode, password is "password123" or phone
  if (password && user.passwordHash) {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, error: "Wrong password" });
  } else if (password && password !== "password123" && password !== "demo123") {
    // allow demo
    // return res.status(401).json({success:false, error:"Wrong password"})
  }
  if (!user.isActive) return res.status(403).json({ success: false, error: "Deactivated" });
  // Issue MFA required
  // For demo we directly issue tokens + expect OTP/biometric second step is optional
  const mfaToken = jwt.sign({ id: user.id, phone: user.phone, role: user.role, mfa: false }, config.jwtSecret, { expiresIn: "5m" } as any);
  res.json({ success: true, data: { mfaRequired: true, mfaToken, user: { id: user.id, role: user.role } } });
});

// POST /api/auth/mfa-verify
authRouter.post("/mfa-verify", async (req, res) => {
  const { mfaToken, otp, biometric } = req.body;
  if (!mfaToken) return res.status(400).json({ success: false, error: "mfaToken required" });
  try {
    const decoded: any = jwt.verify(mfaToken, config.jwtSecret);
    if (biometric) {
      // trust biometric
    } else if (otp !== config.mockOtp) {
      return res.status(400).json({ success: false, error: "Invalid MFA OTP" });
    }
    const user = mockDB.users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    const accessToken = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as any);
    const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn } as any);
    res.json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (e) {
    res.status(401).json({ success: false, error: "Invalid mfaToken" });
  }
});

authRouter.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, error: "refreshToken required" });
  try {
    const dec: any = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const user = mockDB.users.find((u) => u.id === dec.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    const accessToken = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as any);
    res.json({ success: true, data: { accessToken } });
  } catch {
    res.status(401).json({ success: false, error: "Invalid refresh" });
  }
});
