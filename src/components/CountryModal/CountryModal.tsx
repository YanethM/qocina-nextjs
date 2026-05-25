"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Site } from "@/types";
import {
  VALID_SITE_CODES,
  SITE_CODE_COOKIE,
  LOCALE_COOKIE,
  COUNTRY_SELECTED_KEY,
  SITE_DEFAULT_LOCALE,
  COOKIE_MAX_AGE,
  type SiteCode,
} from "@/lib/constants";
import styles from "./CountryModal.module.css";

const VALID = new Set<string>(VALID_SITE_CODES);

const FLAG_EMOJI: Record<string, string> = {
  pe: "🇵🇪",
  us: "🇺🇸",
  es: "🇪🇸",
  mx: "🇲🇽",
  ar: "🇦🇷",
  co: "🇨🇴",
  ec: "🇪🇨",
  cl: "🇨🇱",
};

function setCookie(name: string, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

interface Props {
  forceVisible?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function CountryModal({ forceVisible = false, open, onClose }: Props) {
  const router = useRouter();
  const isControlled = open !== undefined;
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const isVisible = isControlled ? open : visible;

  useEffect(() => {
    if (isControlled) return;
    if (forceVisible) {
      const saved = localStorage.getItem(COUNTRY_SELECTED_KEY);
      if (saved && VALID.has(saved)) {
        setCookie(SITE_CODE_COOKIE, saved);
        setCookie(LOCALE_COOKIE, SITE_DEFAULT_LOCALE[saved as SiteCode]);
        router.replace(`/${saved}`);
        return;
      }
      setVisible(true);
      return;
    }
    const saved = localStorage.getItem(COUNTRY_SELECTED_KEY);
    if (!saved) setVisible(true);
  }, [forceVisible, isControlled, router]);

  useEffect(() => {
    if (!isVisible) return;
    if (sites.length > 0) return;
    setLoading(true);
    fetch("/api/sites")
      .then((r) => r.json())
      .then((data: Site[]) => {
        setSites(Array.isArray(data) ? data.filter((s) => s.activo) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isVisible, sites.length]);

  const handleSelect = (code: string) => {
    const locale = SITE_DEFAULT_LOCALE[code as SiteCode] ?? "es";
    setCookie(SITE_CODE_COOKIE, code);
    setCookie(LOCALE_COOKIE, locale);
    localStorage.setItem(COUNTRY_SELECTED_KEY, code);
    if (isControlled) {
      onClose?.();
    } else {
      setVisible(false);
    }
    router.push(`/${code}`);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Selecciona tu país">
      <div className={styles.modal}>
        <div className={styles.logo}>
          <Image
            src="/images/web/footer/logo-qocina.svg"
            alt="Q'ocina"
            width={140}
            height={52}
            priority
          />
        </div>

        <h2 className={styles.title}>¿Desde dónde nos visitas?</h2>

        <p className={styles.subtitle}>
          Selecciona tu país para ver precios, productos y contenido personalizado para ti
        </p>

        {loading ? (
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        ) : (
          <div className={styles.grid}>
            {sites.map((site) => (
              <button
                key={site.code}
                className={styles.countryBtn}
                onClick={() => handleSelect(site.code)}
              >
                <span className={styles.flag}>{FLAG_EMOJI[site.code] ?? "🌎"}</span>
                <span className={styles.countryName}>{site.nombre}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
