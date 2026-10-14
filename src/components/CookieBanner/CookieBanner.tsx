"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSiteCode } from "@/hooks/useSiteCode";
import { useLocale } from "@/hooks/useLocale";
import styles from "./CookieBanner.module.css";

const translations = {
  es: {
    reject: "Rechazar",
    accept: "Aceptar todas",
    ariaLabel: "Aviso de cookies",
    textPre: "Usamos cookies propias y de terceros para mejorar tu experiencia de navegación y mostrarte contenido personalizado. Puedes aceptarlas o rechazarlas. Más información en nuestra",
    linkText: "política de cookies",
  },
  en: {
    reject: "Reject",
    accept: "Accept all",
    ariaLabel: "Cookie notice",
    textPre: "We use our own and third-party cookies to improve your browsing experience and show you personalized content. You can accept or reject them. More information in our",
    linkText: "cookie policy",
  },
};

const STORAGE_KEY = "qocina_cookie_consent";

export default function CookieBanner() {
  const siteCode = useSiteCode();
  const locale = useLocale();
  const t = translations[locale];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label={t.ariaLabel}>
      <div className={styles.content}>
        <p className={styles.text}>
          {t.textPre}{" "}
          <Link href={`/${siteCode}/politicas-de-cookies`} className={styles.link}>
            {t.linkText}
          </Link>
          .
        </p>
        <div className={styles.actions}>
          <button className={styles.btnReject} onClick={handleReject}>
            {t.reject}
          </button>
          <button className={styles.btnAccept} onClick={handleAccept}>
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
