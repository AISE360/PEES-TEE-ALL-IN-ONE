# PEES Tee Group — Full Product Suite

Monorepo delivering **Client App + Employee App + Head Office Web Portal + Backend** per AISE360 Quotation (26 Aug 2026).

## Structure
```
/shared        # types, constants, roles, stage enums, API client, brand
/backend       # Node/Express + Prisma + Socket.IO + sharp + pdf-lib
/client-app    # React Native / Expo — OTP, catalog, Request a Quote, 4-stage tracking
/employee-app  # React Native / Expo — admin-provisioned, MFA, geofence clock-in, KYC, PT ref
/web-portal    # React + Vite + Tailwind + shadcn-style — real-time portal
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev    # http://localhost:4000  health: /health
# Prisma (optional, mockDb is default for demo without DB):
# npx prisma db push
```

**Env keys (all via env vars, no hardcoding):** `DATABASE_URL`, `JWT_SECRET`, `MSG91_AUTH_KEY`/`TWILIO`, `GOOGLE_MAPS_API_KEY`, `S3_*`, `FCM_SERVER_KEY`. Mock mode is enabled by default (`OTP_PROVIDER=mock`, `MOCK_OTP_CODE=123456`, `ENABLE_MOCK_PAYMENT=true`) so every screen is demoable without gateways.

### Web Portal
```bash
cd web-portal
npm install
npm run dev  # http://localhost:5173  proxies /api -> :4000
```

### Mobile Apps (Expo)
```bash
cd client-app && npm install && npx expo start
cd employee-app && npm install && npx expo start
# Requires Expo Go or emulator. Biometrics/geofencing use expo-* modules.
```

## Key Business Rules Implemented
- Documents → PDF &lt; **300 KB** (sharp + pdf-lib, `backend/src/utils/compress.ts`)
- Photos → JPG &lt; **50 KB**
- Reference: **PT + 5 digits** e.g. `PT48213`, server-side unique (`shared/src/utils.ts` + `backend/src/utils/reference.ts`)
- **Simultaneous** SMS+Email via `Promise.allSettled` (`backend/src/utils/notify.ts`)
- Real-time: Socket.IO `new_client_request`, `new_premium_quote`, `stage_change`, `location_update` → portal toasts + live map
- Roles: `CLIENT | FIELD_EMPLOYEE | SUPERVISOR | HR | MANAGER | ADMIN` — clock-in restricted to HR/Supervisor/Manager
- Stages: `APPLIED → CONNECTED → IN_PROCESSING → COMPLETED`
- Employee **no self-registration**, admin provisioned + MFA (OTP 123456 / biometric mock)

## Demo Accounts (mockDb)
- Client: `9876543210` / OTP `123456`
- Employee HR: `8888888888` / `password123` — EMP00125 (geofenced to HBR Layout)
- Admin: `9999999999` / `password123`

## Design System
Navy `#0F2440` + Gold `#C6A664`, 12–16px radius, soft shadows, pill badges (neutral/blue/amber/green), skeleton loaders, haptics.

## Optional Add-ons (modular, feature-flagged)
SSO, RBAC, Razorpay/PhonePe, invoice engine, webhooks, analytics/Excel export, geofence alerts, WhatsApp gateway — all behind env flags without core refactor.

## Client Obligations
Play Store fee, App Store yearly fee, hosting, SMS/OTP credits — configured via env.

---
Built for PEES Tee Group Pvt Ltd. Quotation total ₹59,999 (AMC ₹1,599/mo).
