# PEES Tee Group — Complete Project & System Guide
### *How the Entire Multi-App Ecosystem Works (Step-by-Step)*

---

## 🏢 1. What is the PEES Tee Platform?

**PEES Tee Group Private Limited** is a corporate enterprise based in HBR Layout, Bengaluru, specializing in:
- Property documentation & legal registration assistance
- Verification of deeds, survey records, and khata certificates
- Real estate compliance & land records management
- Premium insurance underwritings, financial products, and KYC verification

To manage this business seamlessly, we built a **unified 4-part digital ecosystem**:
1. 📱 **Client Mobile App** (For customers seeking services)
2. 📱 **Field Employee Mobile App** (For staff working on the ground)
3. 💻 **Head Office Web Portal** (For executives, management & HR)
4. ⚙️ **Central Backend & Real-Time Server** (The brain connecting all 3)

```
                       ┌─────────────────────────────────────┐
                       │      HEAD OFFICE WEB PORTAL         │
                       │   (Netlify: Desktop & Mobile Web)   │
                       │  • Command Center & Live Dashboard  │
                       │  • Live GPS Officer Tracking Map    │
                       │  • Client Pipeline & Stage Manager  │
                       │  • HR Leave & Salary Disbursal      │
                       └──────────────────┬──────────────────┘
                                          │
                        REST APIs & Live WebSocket Signals
                                          │
                                          ▼
                       ┌─────────────────────────────────────┐
                       │        CENTRAL BACKEND API          │
                       │    (Render: Node.js / Express / WS) │
                       │  • Data Storage & User Sessions     │
                       │  • Instant Real-Time Push Events    │
                       │  • Geofencing & Stage Calculations  │
                       └───────────▲──────────────▲──────────┘
                                   │              │
        ┌──────────────────────────┴────┐    ┌────┴──────────────────────────┐
        │       CLIENT MOBILE APP       │    │     FIELD EMPLOYEE APP        │
        │      (Android Native APK)     │    │      (Android Native APK)     │
        │ • Request Legal/Property Srvs │    │ • GPS Geofenced Clock-In      │
        │ • Track Ticket Stage Realtime │    │ • Live Field Tasks & Visits   │
        │ • Premium KYC & Fast Payment  │    │ • Daily EOD Reports & Notes   │
        │ • Support & Corporate Contacts│    │ • Apply for Leave & Pay Slips │
        └───────────────────────────────┘    └───────────────────────────────┘
```

---

## 📱 2. The 3 Applications Explained in Detail

### App 1: Client Mobile App (`client-app`)
* **Who uses it?** Property buyers, land owners, corporate clients, and general public.
* **Format:** Android App (`apks/pees-tee-client-final.apk`).
* **Key Features:**
  1. **One-Tap Service Quotes**: Client selects service (e.g. *Property Registration*, *Deed Verification*, *Khata Transfer*), types a description, and submits with their phone number.
  2. **Live Lifecycle Tracker**: Client enters their Reference # (e.g. `PT-2026-001`) and watches live milestones move:
     `APPLIED` ➔ `CONNECTED` ➔ `IN PROCESSING` ➔ `COMPLETED`
  3. **Premium KYC Applications**: For high-value estate legal services, clients upload verification details and complete mock payment with instant confirmation.
  4. **Corporate Support**: Direct one-tap dialer and email to HBR Layout headquarters.

---

### App 2: Field Employee Mobile App (`employee-app`)
* **Who uses it?** Field verification officers, site survey executives, legal runners, and supervisors.
* **Format:** Android App (`apks/pees-tee-employee-final.apk`).
* **Key Features:**
  1. **GPS Geofenced Clock-In**: Ensures officers are physically present on duty. The app captures real GPS coordinates, verifies location, and activates the shift.
  2. **Daily Directives**: Important instructions broadcast by Central Management appear as high-priority notices upon opening the app.
  3. **End-of-Day (EOD) Reporting**: At shift end, officers file activities completed, collections received, and field observations.
  4. **Self-Service HR**: Employees check their casual/sick leave balances, submit leave requests, and view monthly payslips right from their phone.

---

### App 3: Head Office Web Portal (`web-portal`)
* **Who uses it?** Managing Director, Operations Managers, Supervisors, and HR Personnel.
* **Format:** Responsive Web Dashboard (**[https://pees-tee-head-office-portal.netlify.app](https://pees-tee-head-office-portal.netlify.app)**).
* **Key Features & Modules:**
  1. **Command Dashboard**:
     - Live KPI cards: Total Requests, Pending KYC, Active Staff On Duty, Pending Leaves.
     - Live stage pipeline overview with one-click preview modal.
     - Directives publisher that broadcasts operational notices to mobile apps.
  2. **Client Requests Board**:
     - Search, filter by stage (`APPLIED`, `CONNECTED`, `IN_PROCESSING`, `COMPLETED`).
     - Progress ticket stages with full chronological audit history.
     - **Export PDF Dossier**: Automatically formats and prints an official branded document for clients or court records.
  3. **Live Field Tracking Map**:
     - Real-time interactive Google Map centered on Bengaluru.
     - Active roster showing every clocked-in officer, live GPS coordinates, and clock-in time.
  4. **Employee Management**:
     - Provision new employees with instant credential generation (`EMP00001`, etc.).
     - One-click account activation / suspension.
  5. **HR & Leave Governance**:
     - Review time-off applications with instant **Approve** / **Reject** buttons.
     - Access official digitally-signed monthly salary slips.
  6. **KYC & Premium Underwritings**:
     - Validate applicant details, verify payment status, and approve insurance policies.
  7. **Operational Reports**:
     - Review daily field reports submitted by officers with one-click printable summaries.
  8. **Settings & System Telemetry**:
     - Live environment parameters, API connection status, and test login credentials.

---

### App 4: Central Backend API & Real-Time Gateway (`backend`)
* **Where is it hosted?** Render Cloud (**[https://pees-tee-backend.onrender.com](https://pees-tee-backend.onrender.com)**).
* **Role:**
  - **REST API Endpoints**: Handles authentication, ticket records, employee rosters, and leave approvals.
  - **Socket.IO WebSockets**: Pushes instant notifications between devices (e.g. when a client submits a quote on mobile, the web portal immediately chimes and shows a notification toast).

---

## 🔄 3. How Data Flows (Real-World Scenarios)

### 📌 Scenario A: Customer Requests Property Registration
1. **Customer** opens the Client Mobile App on their Android phone.
2. They select **"Property Registration Assistance"**, enter notes, and tap **"Submit Request"**.
3. The app contacts `https://pees-tee-backend.onrender.com/api/client-requests`.
4. **Backend** assigns ticket `#PT-2026-089` and broadcasts a WebSocket signal.
5. **Web Portal** instantly pops up a gold toast: *"New quote request: Property Registration — #PT-2026-089"*.
6. Head Office manager reviews details, clicks **"Move to Connected"**, then **"In Processing"**.
7. Customer's phone screen updates automatically to show their ticket is now **"In Processing"**.
8. Manager clicks **"Download PDF Dossier"** on the web portal to print an official client dossier.

---

### 📌 Scenario B: Field Officer Daily Operations & GPS Tracking
1. **Officer Ramesh** opens the Employee Mobile App at 9:00 AM.
2. He taps **"Clock In"** ➔ App retrieves high-accuracy GPS coordinates.
3. Backend records active shift and marks status as online.
4. On the **Head Office Portal (Field Tracking page)**, Ramesh appears in the active roster with a live pulsing green indicator, clock-in timestamp, and map coordinates.
5. Throughout the day, Ramesh visits client premises.
6. At 6:00 PM, Ramesh opens **"EOD Report"**, logs: *"Completed 5 verifications at Indiranagar; collected ₹4,000"*, and submits.
7. Central Management views the filed report on the portal's **Reports** page and clicks **"Print PDF"** for accounting records.

---

### 📌 Scenario C: Employee Applies for Leave
1. Employee opens **"HR & Leave"** in the mobile app, selects **"Casual Leave"** for 2 days, and submits.
2. HR Manager opens **Web Portal ➔ HR & Leave**.
3. Under **Pending Leaves**, the manager sees the request, reason, and dates.
4. HR clicks the green **"Approve"** button.
5. Employee's mobile app immediately reflects status: **"APPROVED"**.

---

## 🔑 4. Live URLs & Demonstration Credentials

| Service | Live URL | Description |
| :--- | :--- | :--- |
| **Web Portal** | [https://pees-tee-head-office-portal.netlify.app](https://pees-tee-head-office-portal.netlify.app) | Production Head Office Dashboard |
| **Backend API** | [https://pees-tee-backend.onrender.com](https://pees-tee-backend.onrender.com) | Live Node.js / Socket.IO Server |
| **API Health Check**| [https://pees-tee-backend.onrender.com/health](https://pees-tee-backend.onrender.com/health) | `{"ok":true,"service":"PEES Tee Backend"}` |
| **Android APKs** | Stored locally in `c:\app\apks\` | Installable on any physical Android phone |

### 👤 Demo Accounts for Testing:
* **Central Super Admin**: `EMP00001` / Password: `password123` *(Full Portal Control)*
* **HR Manager**: `EMP00125` / Password: `password123` *(Staff & Leave Approvals)*
* **Field Supervisor**: `EMP00126` / Password: `password123` *(Field Operations)*
* **Field Officer**: `EMP00127` / Password: `password123` *(Mobile App Tasks)*
* **Demo Mobile OTP**: `123456` *(Valid for any phone number during demonstration)*

---

## 🛠️ 5. Technology Stack Summary

* **Frontend Web Portal**: React 18, TypeScript, Tailwind CSS, Space Grotesk + Inter typography, Vite, Socket.IO Client.
* **Mobile Applications**: React Native, Expo, React Navigation, Mobile Vector Icons, Geolocation API.
* **Backend**: Node.js 20+, Express, TypeScript (NodeNext), Socket.IO, JWT Authentication, Multer, PDF-Lib.
* **Hosting**:
  - Web Portal: **Netlify** (with automatic routing `_redirects` and edge caching)
  - Backend: **Render** (with SSL/TLS and real-time WebSocket support)
  - Mobile: **Android APK standalone release binaries**
