import React from "react";
import { createRoot } from "react-dom/client";
import { SidePanel } from "./SidePanel";
import { ToastProvider } from "../components/Toast";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <SidePanel />
  </ToastProvider>
);
