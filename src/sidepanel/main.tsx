import React from "react";
import { createRoot } from "react-dom/client";
import { SidePanel } from "./SidePanel";
import { ToastProvider } from "../components/Toast";
import { ErrorBoundary } from "../components/ErrorBoundary";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ToastProvider>
      <SidePanel />
    </ToastProvider>
  </ErrorBoundary>
);
