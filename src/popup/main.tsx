import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./Popup";
import { ToastProvider } from "../components/Toast";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthWall } from "../shared/AuthWall";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ToastProvider>
      <AuthWall>
        <Popup />
      </AuthWall>
    </ToastProvider>
  </ErrorBoundary>
);
