import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./Popup";
import { ToastProvider } from "../components/Toast";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <Popup />
  </ToastProvider>
);
