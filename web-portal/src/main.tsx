import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import PublicLayout from "./components/PublicLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import HRLeave from "./pages/HRLeave";
import FieldTracking from "./pages/FieldTracking";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ClientRequestsPage from "./pages/ClientRequests";
import PremiumPage from "./pages/Premium";
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Track from "./pages/public/Track";
import Contact from "./pages/public/Contact";
import "./index.css";

const qc = new QueryClient();

function Public({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function Console({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* ── Public website (mirrors peesteegroup.com) ── */}
          <Route path="/" element={<Public><Home /></Public>} />
          <Route path="/services" element={<Public><Services /></Public>} />
          <Route path="/about" element={<Public><About /></Public>} />
          <Route path="/track" element={<Public><Track /></Public>} />
          <Route path="/contact" element={<Public><Contact /></Public>} />

          {/* ── Operations console (staff only) ── */}
          <Route path="/dashboard" element={<Console><Dashboard /></Console>} />
          <Route path="/client-requests" element={<Console><ClientRequestsPage /></Console>} />
          <Route path="/premium" element={<Console><PremiumPage /></Console>} />
          <Route path="/employees" element={<Console><Employees /></Console>} />
          <Route path="/hr-leave" element={<Console><HRLeave /></Console>} />
          <Route path="/field-tracking" element={<Console><FieldTracking /></Console>} />
          <Route path="/reports" element={<Console><Reports /></Console>} />
          <Route path="/settings" element={<Console><Settings /></Console>} />
          <Route path="/console" element={<Navigate to="/dashboard" replace />} />
          <Route path="/console/*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
