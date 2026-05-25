export const COLOR_MAP: Record<string, string> = {
  rojo: "#CE171C",
  verde: "#6A892C",
  amarillo: "#F4A910",
};

export const WAVE_MAP: Record<string, string> = {
  rojo: "/images/web/recetas/red_wave.svg",
  verde: "/images/web/recetas/green_wave.svg",
  amarillo: "/images/web/recetas/yellow_wave.svg",
};

export const DEFAULT_COLOR = COLOR_MAP.rojo;
export const DEFAULT_WAVE = WAVE_MAP.rojo;

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qocina.com";

export const VALID_SITE_CODES = ["pe", "us", "es", "mx", "ar", "co", "ec", "cl"] as const;
export type SiteCode = typeof VALID_SITE_CODES[number];

export const SITE_CODE_COOKIE = "site-code";
export const SITE_URL_COOKIE = "site-url";
export const LOCALE_COOKIE = "locale";
export const COUNTRY_SELECTED_KEY = "qocina_country_selected";

/** Locale por defecto según país */
export const SITE_DEFAULT_LOCALE: Record<SiteCode, "es" | "en"> = {
  pe: "es", co: "es", ar: "es", mx: "es", cl: "es", ec: "es", es: "es", us: "en",
};

/** Moneda oficial por país */
export const SITE_CURRENCY: Record<SiteCode, string> = {
  pe: "PEN", co: "COP", ar: "ARS", mx: "MXN", cl: "CLP", ec: "USD", es: "EUR", us: "USD",
};
