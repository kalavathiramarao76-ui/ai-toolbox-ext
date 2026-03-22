import React from "react";
import { createRoot } from "react-dom/client";
import { SidePanel } from "./SidePanel";
import { ToastProvider } from "../components/Toast";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthWall } from "../shared/AuthWall";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ToastProvider>
      <AuthWall>
        <SidePanel />
      </AuthWall>
    </ToastProvider>
  </ErrorBoundary>
);
