# PEES Tee Group — Complete System Architecture & Project Blueprint

Comprehensive architecture documentation for the **PEES Tee All-In-One Enterprise Platform**, covering the **Client Mobile App**, **Field Employee Mobile App**, **Head Office Web Portal**, and **Backend API Server**.

---

## 1. System Overview & Core Purpose

**PEES Tee Group Pvt Ltd** provides property registration, land documentation, legal assistance, and premium financial KYC services. The software ecosystem digitizes the end-to-end operational pipeline across 4 integrated components:

```
┌─────────────────────────┐               ┌─────────────────────────┐
│       Client App        │               │      Employee App       │
│  (React Native / Expo)  │               │  (React Native / Expo)  │
│  - Browse services      │               │  - Geofenced Clock-In   │
│  - Request quotes       │               │  - On-site KYC + Docs   │
│  - Live stage tracking  │               │  - Payment Collection   │
│  - Corporate Support    │               │  - Salary & EOD Reports │
└────────────┬────────────┘               └────────────┬────────────┘
             │                                         │
             │           ┌──────────────────┐          │
             └──────────►│   Backend API    │◄─────────┘
                         │ (Express/Socket) │
                         │ - REST Endpoints │
                         │ - Socket.IO Pub  │
                         │ - Mock / Prisma  │
                         └────────▲─────────┘
                                  │
                       ┌──────────┴──────────┐
                       │     Web Portal      │
                       │    (React / Vite)   │
                       │ - Executive KPIs    │
                       │ - Live Google Maps  │
                       │ - Stage Board & KYC │
                       │ - HR, Leave, EODs   │
                       └─────────────────────┘
```

---

## 2. Complete Repository Directory Tree

```
c:\app
├── apks/                               # Pre-compiled production Android APK binaries
│   ├── pees-tee-client-final.apk       # Client mobile application package (~66 MB)
│   └── pees-tee-employee-final.apk     # Employee mobile application package (~67 MB)
│
├── backend/                            # Express + Socket.IO REST & Realtime Server
│   ├── prisma/
│   │   └── schema.prisma               # Relational data schema (PostgreSQL / SQLite)
│   ├── src/
│   │   ├── middleware/                 # JWT Auth, validation, rate-limiting
│   │   ├── routes/
│   │   │   ├── auth.ts                 # /api/auth (login, register, session)
│   │   │   ├── clientRequests.ts       # /api/client-requests (quotes, stages)
│   │   │   ├── employees.ts            # /api/employees (roster, active status)
│   │   │   ├── leaves.ts               # /api/leaves (apply, approve, reject)
│   │   │   ├── misc.ts                 # /api/directives, /api/eod-reports, /api/portal/*
│   │   │   ├── premium.ts              # /api/premium-applications (KYC review)
│   │   │   └── shifts.ts               # /api/shifts (clock-in, telemetry, clock-out)
│   │   ├── config.ts                   # Environment variables & constants
│   │   ├── index.ts                    # Server bootstrap + Socket.IO setup (Port 4000)
│   │   ├── mockDb.ts                   # In-memory database with pre-populated demo seed
│   │   └── seed.ts                     # Database seeder utility
│   ├── package.json
│   └── tsconfig.json
│
├── client-app/                         # Client-Facing Mobile App (Expo SDK 51)
│   ├── android/                        # Native Android build project (Gradle)
│   ├── assets/                         # Brand logos, splash screens, app icons
│   └── src/
│       ├── components/                 # Card, PrimaryButton, StatusBadge, UI widgets
│       ├── screens/
│       │   ├── Splash.tsx              # Animated branded splash screen
│       │   ├── Login.tsx               # Dual OTP (123456) & Password (demo123) login
│       │   ├── Home.tsx                # Service catalog, search, support modal, bottom nav
│       │   ├── ServiceDetail.tsx       # Per-service breakdown, features & CTA
│       │   ├── RequestQuote.tsx        # Camera capture, document picker & quote submit
│       │   ├── Track.tsx               # 4-stage visual timeline & copyable PT reference
│       │   └── Profile.tsx             # Client profile, dark mode preview & corporate contacts
│       ├── storage/
│       │   └── demoStore.ts            # Local persistence via AsyncStorage + seed data
│       ├── theme.ts                    # Brand palette (Navy #0F2440, Gold #C6A664)
│       └── App.tsx                     # Native Stack Navigator routing
│
├── employee-app/                       # Field Executive & HR Mobile App (Expo SDK 51)
│   ├── android/                        # Native Android build project (Gradle)
│   ├── assets/                         # App icons, splash screens, assets
│   └── src/
│       ├── components/                 # Custom UI components & cards
│       ├── screens/
│       │   ├── Login.tsx               # Credential validation + MFA modal (OTP: 123456)
│       │   ├── DirectiveModal.tsx      # Shift-start morning operational directives
│       │   ├── Dashboard.tsx           # Quick-action grid & Active Duty shift status
│       │   ├── ClockIn.tsx             # GPS geofencing (500m) + front-camera selfie
│       │   ├── KYC.tsx                 # 3-step client enrolment, camera docs & payment gate
│       │   ├── PaymentSuccess.tsx      # Application confirmation & PT reference generator
│       │   ├── Clients.tsx             # Enrolled client list & quick details
│       │   ├── Leave.tsx               # Leave balance check & leave application
│       │   ├── SalarySlips.tsx         # On-device HTML-to-PDF generation & sharing
│       │   ├── Reports.tsx             # Daily End-of-Day field logging & collection summary
│       │   └── SelfService.tsx         # Executive profile & telemetry session termination
│       ├── storage/
│       │   ├── auth.ts                 # Session user state (Admin, HR, Supervisor, Field)
│       │   └── demoStore.ts            # Local shift state, KYC submissions, leaves, slips
│       ├── theme.ts                    # Navy, Gold, Muted gray color constants
│       └── App.tsx                     # Native Stack Navigator
│
├── web-portal/                         # Head Office Management Web Console (React 18 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx              # Sidebar navigation, live WebSocket toasts, bell alerts
│   │   ├── lib/
│   │   │   └── api.ts                  # Fetch wrapper pointing to backend API (Port 4000)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx           # Executive KPIs, stage board, Google Maps embed, PDF export
│   │   │   ├── ClientRequests.tsx      # Filterable request table & interactive stage updates
│   │   │   ├── Premium.tsx             # KYC applications list with Approve / Reject actions
│   │   │   ├── Employees.tsx           # Staff roster with role badges & Add Employee modal
│   │   │   ├── HRLeave.tsx             # Leave approval queue & salary slip record view
│   │   │   ├── FieldTracking.tsx       # Full Google Maps Embed API + live 15s shift auto-refresh
│   │   │   ├── Reports.tsx             # EOD reports log, printable HTML slips & submission
│   │   │   └── Settings.tsx            # Test credentials roster & environment config
│   │   ├── index.css                   # TailwindCSS directives & custom design system
│   │   └── main.tsx                    # React Router DOM (all 8 route definitions)
│   ├── package.json
│   └── vite.config.ts
│
└── shared/                             # Shared TypeScript definitions & contracts
    └── src/
        ├── types.ts                    # User, ClientRequest, Shift, PremiumApp, Leave types
        ├── constants.ts                # Stages: APPLIED, CONNECTED, IN_PROCESSING, COMPLETED
        └── api.ts                      # Common API schemas & helper functions
```

---

## 3. Component Deep Dive: What Each Part Does

### A. Client Mobile App (`/client-app`)
* **Target Audience**: Individuals and property owners seeking land records, legal advice, property verification, and financial assistance.
* **Authentication**: Login with Indian mobile number using OTP (`123456`) or demo password (`demo123`).
* **Service Browsing**: Searchable service cards covering Land Documentation, Premium Quotes, Legal Scrutiny, Property Verification, and Corporate KYC.
* **Quote Submission Flow**: 
  - Allows entering requirement details and preferred contact timing.
  - **Live Camera Capture**: Opens phone camera to photograph documents directly.
  - **Document Picker**: Allows selecting PDF/JPEG files directly from device storage.
  - **Delete/Replace**: Individual attachment removal chips (`✕`).
* **Live Milestone Tracking**:
  - Displays instant reference code (e.g. `PT24153`).
  - Progresses across 4 stages: `APPLIED` → `CONNECTED` → `IN_PROCESSING` → `COMPLETED`.
  - One-tap clipboard copy button.
* **Corporate Support**: Modal popup with direct tel-links (`tel:08041289652`), email launcher (`mailto:info@peesteegroup.com`), and Google Maps directions to the HBR Layout HQ.

### B. Field Employee Mobile App (`/employee-app`)
* **Target Audience**: Field executives, inspectors, supervisors, and HR managers.
* **Authentication & MFA**: 
  - Login with Employee ID (`EMP00125`) and Password (`password123`).
  - **Mandatory MFA Step**: 6-digit OTP verification modal (`123456`) before granting access.
* **Morning Operational Directive**: On initial login, prompts with the day's instructions published by Head Office.
* **Geofenced Clock-In**:
  - Validates user position against the assigned site geofence (e.g., HBR Layout HQ, 500m radius).
  - Front-camera selfie requirement to prevent proxy attendance.
  - Demo override allows clocking in outside the site for testing purposes.
* **3-Step KYC Application Enrolment**:
  - **Step 1 (Personal)**: Client name, DOB, address, phone number.
  - **Step 2 (Documents)**: Aadhaar Front, Aadhaar Back, PAN card, and optional voter ID. Supports both camera capture and local file picking.
  - **Step 3 (Payment)**: Modes include Cash, UPI, and Digital Link. **Payment confirmation is strictly gated** — user cannot submit until payment is marked successful.
  - Returns a unique Reference Number (e.g. `PT48213`) with clipboard copy.
* **Self-Service & HR Tools**:
  - **Salary Slips**: Generates real formatted HTML salary slips on-device; renders PDF using `expo-print` and shares via `expo-sharing`.
  - **Leave Management**: View available leave balance and submit from/to dates with reason.
  - **End-of-Day Reporting**: Submits visited locations, collections gathered, and progress notes.

### C. Head Office Web Portal (`/web-portal`)
* **Target Audience**: Executives, Operations Heads, HR, and Super Admins.
* **Executive Dashboard**:
  - 4 real-time KPI counter widgets (Total Requests, Pending KYC, Active Staff, Pending Leaves).
  - Real-time Stage Board showing recent client submissions with stage status badges.
  - Interactive "Preview Modal": inspect attachments, update stages (`APPLIED` → `COMPLETED`), and export a formatted printable PDF Dossier.
  - Embeds Google Maps centered on Bangalore HO using Google Maps Embed API.
  - Shift Directive publisher that broadcasts instructions to mobile apps.
* **Client Requests Page**: Search, filter by stage, and manage quote requests.
* **Premium Applications**: Approve or Reject KYC enrolments; track payment mode and verification status.
* **Employee Directory**: Roster with role chips (`ADMIN`, `HR`, `SUPERVISOR`, `FIELD_EMPLOYEE`) and quick-add form.
* **Field Tracking Page**: Dedicated live map view and auto-refreshing list of active shifts with lat/lng telemetry.
* **HR & Leave Page**: Review pending leave applications and approve or reject with one click.
* **Reports Page**: Daily EOD reports feed with search and formatted printable printouts.

### D. Backend API Server (`/backend`)
* **Technology**: Node.js, Express, TypeScript, Socket.IO.
* **REST Routes**:
  - `POST /api/auth/login`, `GET /api/auth/me`
  - `GET`, `POST`, `PATCH /api/client-requests` (with `/stage` sub-route)
  - `GET`, `POST`, `PATCH /api/premium-applications` (with `/status` sub-route)
  - `GET`, `POST /api/shifts` (clock-in/clock-out telemetry)
  - `GET`, `POST`, `PATCH /api/leaves`
  - `GET`, `POST /api/directives`, `GET /api/directives/today`
  - `GET`, `POST /api/eod-reports`
  - `GET /api/portal/dashboard`, `GET /api/portal/live-map`
* **Realtime Socket Events**:
  - `new_client_request` → Emitted when client submits quote; pops toast on web portal.
  - `new_premium_quote` → Emitted when field executive completes KYC.
  - `stage_change` → Emitted when admin updates stage; reflects in client track view.

---

## 4. End-to-End Interaction Diagrams

### Diagram 1: System Topology & Interconnections

```mermaid
graph TB
    subgraph "Clients"
        CA["Client Mobile App (Android APK)"]
    end

    subgraph "Field Staff & HR"
        EA["Employee Mobile App (Android APK)"]
    end

    subgraph "Head Office"
        WP["Web Management Portal (Browser)"]
    end

    subgraph "Backend Infrastructure (Node / Express)"
        API["REST API Server (:4000)"]
        SIO["Socket.IO Event Hub"]
        MOCK["MockDB / PostgreSQL"]
    end

    subgraph "Third-Party Services"
        GMAP["Google Maps Embed API"]
    end

    CA -- "REST: Submit Quotes, Track Stages" --> API
    EA -- "REST: ClockIn, KYC Enrol, Leave, EOD" --> API
    WP -- "REST: Manage, Approve, Directives" --> API
    WP -- "WebSocket: Live Toast Alerts" --> SIO
    API -- "Broadcasts Events" --> SIO
    API -- "CRUD Queries" --> MOCK
    WP -- "Embeds Live Map" --> GMAP
    EA -- "Local Offline Store (AsyncStorage)" --> EA
```

---

### Diagram 2: Client Quote Request to Head Office Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App
    participant Backend as Backend Server
    participant Portal as Web Portal (Head Office)

    Client->>Client: Browse Services (e.g. Land Documentation)
    Client->>Client: Attach Camera Photo / File Picker
    Client->>Backend: POST /api/client-requests (Details, Files)
    Backend->>Backend: Generate PT Reference (e.g. PT24153)
    Backend-->>Portal: Socket.IO: 'new_client_request'
    Portal->>Portal: Display Toast & Increment Bell Counter
    Backend-->>Client: 201 Created (Reference: PT24153)
    Client->>Client: Navigate to Track Screen (Stage: APPLIED)

    Note over Portal: Admin reviews request on Stage Board
    Portal->>Backend: PATCH /api/client-requests/:id/stage (IN_PROCESSING)
    Backend-->>Portal: 200 OK & Updated Stage History
    Portal-->>Client: Socket.IO / Refresh: 'stage_change'
    Client->>Client: Milestone Timeline updates to IN_PROCESSING
```

---

### Diagram 3: Employee Clock-In, Geofence & Shift Directives

```mermaid
sequenceDiagram
    autonumber
    actor Emp as Field Employee
    participant App as Employee App
    participant Backend as Backend Server
    participant Portal as Web Portal

    Emp->>App: Enter Credentials (EMP00125 / password123)
    App->>App: Validate Credentials -> Trigger MFA Modal
    Emp->>App: Input 6-Digit OTP (123456)
    App->>Backend: GET /api/directives/today
    Backend-->>App: Return Today's Shift Directives
    App->>Emp: Display Directive Modal ("Visit assigned sites...")
    Emp->>App: Tap "Got it — Start Shift"

    App->>App: Fetch GPS Location & Compute Distance to Site
    App->>App: Launch Camera -> Take Live Selfie
    Emp->>App: Tap "Clock In"
    App->>Backend: POST /api/shifts (Selfie, Lat/Lng, Timestamp)
    Backend-->>App: 201 Created (Shift Active)
    App->>App: Activate "Active Duty" status card

    Note over Portal: Field Tracking map auto-refreshes every 15s
    Portal->>Backend: GET /api/portal/live-map
    Backend-->>Portal: Return active shifts & GPS coordinates
    Portal->>Portal: Render active badge on Google Maps embed
```

---

### Diagram 4: 3-Step Field KYC Enrolment & Approval Flow

```mermaid
sequenceDiagram
    autonumber
    actor Emp as Field Employee
    actor Client as Walk-in Customer
    participant App as Employee App
    participant Backend as Backend Server
    participant Portal as Web Portal

    Emp->>App: Step 1: Input Client Name, DOB, Address, Phone
    Emp->>App: Step 2: Capture Aadhaar Front, Back & PAN (Camera/Files)
    Emp->>Client: Collect Fee (₹15,000 via Cash / UPI)
    Emp->>App: Step 3: Select UPI & Tap "Confirm Payment Received"
    Note over App: "Submit Application" button unlocks
    Emp->>App: Tap "Submit Application"
    App->>Backend: POST /api/premium-applications (Client, Docs, Payment: SUCCESSFUL)
    Backend-->>Portal: Socket.IO: 'new_premium_quote'
    Backend-->>App: 201 Created (Ref: PT48213)
    App->>Emp: Display PaymentSuccess Screen with Reference Number

    Note over Portal: Admin checks Premium Applications list
    Portal->>Backend: PATCH /api/premium-applications/:id/status (APPROVED)
    Backend-->>Portal: 200 OK (Status: APPROVED)
    Portal->>Portal: Badge turns green (Approved)
```

---

## 5. Security, Validation & State Design

| Layer | Implementation Details |
|---|---|
| **Mobile Auth Store** | In-memory session store ([auth.ts](file:///c:/app/employee-app/src/storage/auth.ts)) prevents unauthorized state persistence; resets cleanly on logout. |
| **MFA Verification** | Dual-factor enforcement requiring valid credential lookup followed by a 6-digit OTP barrier before launching shift tools. |
| **Geofencing & Anti-Proxy** | Calculates spherical distance via Haversine formula against HQ coordinates (`lat: 13.0358, lng: 77.6200`). Enforces front-camera only for live selfies. |
| **Payment Gating** | Prevents submission of KYC dossiers until the field executive actively verifies and flags payment as `SUCCESSFUL`. |
| **Offline Resilience** | Both mobile apps utilize fallback local mock stores (`AsyncStorage` + seed data) to allow uninterrupted operation in low-connectivity areas. |
| **Google Maps Embed API** | Hardened iframe integration without requiring heavy native SDK downloads, operating via key `AIzaSyD77yl0_MV4lnaax5oko7kg_ouls224cYA`. |

---

## 6. How to Run & Verify the Ecosystem

### A. Backend API Server
```powershell
cd c:\app\backend
npm run dev
# Server listens at http://localhost:4000
# Health check: curl http://localhost:4000/health
```

### B. Head Office Web Portal
```powershell
cd c:\app\web-portal
npm run dev
# Vite runs at http://localhost:5173
# Production build test: npm run build
```

### C. Android Mobile Apps
The compiled binaries are pre-packaged in `c:\app\apks`:
```powershell
# Install Client App on connected phone/emulator:
& "C:\Android\platform-tools\adb.exe" install -r "C:\app\apks\pees-tee-client-final.apk"

# Install Employee App on connected phone/emulator:
& "C:\Android\platform-tools\adb.exe" install -r "C:\app\apks\pees-tee-employee-final.apk"

# Launch Employee App via ADB:
& "C:\Android\platform-tools\adb.exe" shell am start -n com.peestee.employee/.MainActivity

# Launch Client App via ADB:
& "C:\Android\platform-tools\adb.exe" shell am start -n com.peestee.client/.MainActivity
```

---

## 7. Demo Credential Cheatsheet

| Application | Role / Persona | Identifier / Username | Password / OTP |
|---|---|---|---|
| **Employee App** | Field Executive | `EMP00125` | Password: `password123` • MFA OTP: `123456` |
| **Employee App** | Supervisor | `EMP00126` | Password: `password123` • MFA OTP: `123456` |
| **Employee App** | Admin | `EMP00001` | Password: `password123` • MFA OTP: `123456` |
| **Client App** | Consumer (OTP) | `9876543210` | OTP: `123456` |
| **Client App** | Consumer (Password) | `9876543210` | Password: `demo123` |
| **Web Portal** | Head Office Admin | Direct Access (`/`) | Pre-authenticated demo session |
