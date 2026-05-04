"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const IS_DEV = process.env.NODE_ENV === "development";

function installCioLogger() {
  if (!IS_DEV || typeof window === "undefined" || !window.cioanalytics) return;
  if ((window as any).__cioLoggerInstalled) return;
  (window as any).__cioLoggerInstalled = true;

  const COLORS: Record<string, string> = {
    track: "#f59e0b",
    identify: "#0ea5e9",
    page: "#22c55e",
  };

  const wrap = (method: "track" | "identify" | "page") => {
    const original = (window.cioanalytics[method] as Function).bind(window.cioanalytics);
    (window.cioanalytics[method] as Function) = function (...args: unknown[]) {
      const color = COLORS[method] ?? "#94a3b8";
      const label = method === "track" ? args[0] : method === "identify" ? "identify" : "page";
      console.group(`%c[CIO:${method}] ${label}`, `color:${color};font-weight:bold`);
      if (method === "track") console.log("props:", args[1]);
      if (method === "identify") console.log("userId:", args[0], "| traits:", args[1]);
      if (method === "page") console.log("pathname:", window.location.pathname);
      console.groupEnd();
      return original(...args);
    };
  };

  wrap("track");
  wrap("identify");
  wrap("page");
}

export default function CioPageTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    installCioLogger();
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.cioanalytics) {
      window.cioanalytics.page();
    }
  }, [pathname]);

  return null;
}
