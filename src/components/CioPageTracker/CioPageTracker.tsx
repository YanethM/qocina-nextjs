"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { VALID_SITE_CODES } from "@/lib/constants";

const IS_DEV = process.env.NODE_ENV === "development";

function getAnonymousId(): string {
  try {
    return localStorage.getItem("ajs_anonymous_id") ?? "desconocido";
  } catch {
    return "desconocido";
  }
}

function installCioLogger() {
  if (!IS_DEV || typeof window === "undefined") return;
  if ((window as any).__cioLoggerInstalled) return;
  if (!window.cioanalytics) {
    window.addEventListener("load", installCioLogger, { once: true });
    return;
  }
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
      const anonymousId = getAnonymousId();
      const label = method === "track" ? args[0] : method === "identify" ? "identify" : "page";

      console.group(`%c[CIO:${method}] ${label}`, `color:${color};font-weight:bold`);
      console.log("anonymousId:", anonymousId);

      if (method === "track") {
        console.log("event:", args[0]);
        console.log("props:", args[1]);
        console.log("userId:", (window as any).__cioCurrentUserId ?? "(anónimo)");
      }

      if (method === "identify") {
        const prevAnonymous = anonymousId;
        const newUserId = args[0];
        console.log("%c FUSIÓN anonymousId → userId", "color:#a855f7;font-weight:bold");
        console.log("  anonymousId:", prevAnonymous);
        console.log("  userId (offixCustomerId):", newUserId);
        console.log("  traits:", args[1]);
        (window as any).__cioCurrentUserId = newUserId;
      }

      if (method === "page") {
        console.log("pathname:", window.location.pathname);
        console.log("userId:", (window as any).__cioCurrentUserId ?? "(anónimo)");
      }

      console.groupEnd();
      return original(...args);
    };
  };

  wrap("track");
  wrap("identify");
  wrap("page");
}

function installSiteCodeMiddleware() {
  if (typeof window === "undefined") return;
  if ((window as any).__cioMiddlewareInstalled) return;
  if (!window.cioanalytics) {
    window.addEventListener("load", installSiteCodeMiddleware, { once: true });
    return;
  }
  (window as any).__cioMiddlewareInstalled = true;

  window.cioanalytics.addSourceMiddleware(({ payload, next }: any) => {
    const obj = payload?.obj ?? {};
    const siteCode = window.location.pathname.split("/")[1];

    if ((VALID_SITE_CODES as readonly string[]).includes(siteCode)) {
      if (obj.type === "track" && obj.properties) {
        obj.properties.country = siteCode;
      }
    }

    if (IS_DEV) {
      const COLORS: Record<string, string> = {
        track: "#f59e0b",
        identify: "#0ea5e9",
        page: "#22c55e",
      };
      const color = COLORS[obj.type] ?? "#94a3b8";

      console.group(`%c[CIO] ${obj.type?.toUpperCase()} ${obj.event ?? ""}`, `color:${color};font-weight:bold`);
      console.log("anonymousId :", obj.anonymousId ?? "(no disponible aún)");
      console.log("userId      :", obj.userId ?? "(anónimo)");

      if (obj.type === "track") {
        console.log("event       :", obj.event);
        console.log("properties  :", obj.properties);
      }
      if (obj.type === "identify") {
        console.log("%c→ FUSIÓN anonymousId → userId", "color:#a855f7;font-weight:bold");
        console.log("  anonymousId:", obj.anonymousId);
        console.log("  userId     :", obj.userId);
        console.log("  traits     :", obj.traits);
      }
      if (obj.type === "page") {
        console.log("url         :", obj.properties?.url ?? window.location.href);
      }
      console.log("--- payload completo ---", obj);
      console.groupEnd();
    }

    next(payload);
  });
}

export default function CioPageTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    installCioLogger();
    installSiteCodeMiddleware();
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
