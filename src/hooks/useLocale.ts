"use client";

import { useEffect, useState } from "react";
import { LOCALE_COOKIE } from "@/lib/constants";

function readLocaleCookie(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`));
  return match?.[1] === "en" ? "en" : "es";
}

export function useLocale(): "es" | "en" {
  const [locale, setLocale] = useState<"es" | "en">("es");

  useEffect(() => {
    setLocale(readLocaleCookie());
    const handleChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setLocale(detail === "en" ? "en" : "es");
    };
    window.addEventListener("qocina:locale-change", handleChange);
    return () => window.removeEventListener("qocina:locale-change", handleChange);
  }, []);

  return locale;
}
