import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  mockOtp: process.env.MOCK_OTP_CODE || "123456",
  otpProvider: process.env.OTP_PROVIDER || "mock",
  enableMockPayment: process.env.ENABLE_MOCK_PAYMENT !== "false",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
