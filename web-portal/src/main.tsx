import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import HRLeave from "./pages/HRLeave";
import FieldTracking from "./pages/FieldTracking";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import "./index.css";

// Lazy-loaded inline pages for Client Requests and Premium
import ClientRequestsPage from "./pages/ClientRequests";
import PremiumPage from "./pages/Premium";

const qc = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/client-requests" element={<ClientRequestsPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/hr-leave" element={<HRLeave />} />
            <Route path="/field-tracking" element={<FieldTracking />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
