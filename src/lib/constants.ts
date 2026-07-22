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

export const WAVE_BANNER_MAP: Record<string, string> = {
  rojo: "/images/web/recetas/recetas_detail/baner_waves_roja.svg",
  verde: "/images/web/recetas/recetas_detail/baner_waves_verde.svg",
  amarillo: "/images/web/recetas/recetas_detail/baner_waves_amarilla.svg",
};

export const INGREDIENTES_BG_MAP: Record<string, string> = {
  rojo: "/images/mobile/recetas/qocinaencasaingredientssectionrojo.svg",
  amarillo: "/images/mobile/recetas/qocinaencasaingredientssectionamarillo.svg",
  verde: "/images/mobile/recetas/qocinaencasaingredientssectionverde.svg",
};

export const INGREDIENTES_IMG_MAP: Record<string, string> = {
  rojo: "/images/web/recetas/recetas_detail/receta_roja.svg",
  amarillo: "/images/web/recetas/recetas_detail/receta_amarilla.svg",
  verde: "/images/web/recetas/recetas_detail/receta_verde.svg",
};

export const TIPS_WAVE_TOP_MAP: Record<string, string> = {
  rojo: "/images/web/recetas/recetas_detail/waves_rojas_solas.svg",
  verde: "/images/web/recetas/recetas_detail/waves_verdes_solas.svg",
  amarillo: "/images/web/recetas/recetas_detail/waves_amarillas_solas.svg",
};

export const PRODUCT_WAVE_MAP: Record<string, string> = {
  rojo: "/images/web/products/red_waves.svg",
  verde: "/images/web/products/green_waves.svg",
  amarillo: "/images/web/products/yellow_waves.svg",
};

export const PRODUCT_DETAIL_WAVE_MAP: Record<string, string> = {
  rojo: "/images/web/products/product_detail/waves_red_product_detail.svg",
  verde: "/images/web/products/product_detail/waves_green_product_detail.svg",
  amarillo: "/images/web/products/product_detail/waves_yellow_product_detail.svg",
};

export const COLOR_HEX_TO_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(COLOR_MAP).map(([key, hex]) => [hex.toLowerCase(), key])
);

export const DEFAULT_COLOR = COLOR_MAP.rojo;
export const DEFAULT_WAVE = WAVE_MAP.rojo;
export const DEFAULT_WAVE_BANNER = WAVE_BANNER_MAP.rojo;
export const DEFAULT_TIPS_WAVE_TOP = TIPS_WAVE_TOP_MAP.rojo;
export const DEFAULT_INGREDIENTES_IMG = INGREDIENTES_IMG_MAP.rojo;
export const DEFAULT_PRODUCT_WAVE = PRODUCT_WAVE_MAP.rojo;
export const DEFAULT_PRODUCT_DETAIL_WAVE = PRODUCT_DETAIL_WAVE_MAP.rojo;

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qocina.com";

export const VALID_SITE_CODES = ["pe", "us", "es", "mx", "ar", "co", "ec", "cl"] as const;
export type SiteCode = typeof VALID_SITE_CODES[number];

/** Países con checkout operativo (warehouseID de Ofix configurado) */
export const CHECKOUT_ENABLED_SITE_CODES = ["pe", "co", "ec", "cl", "us"] as const;

/** País al que se redirige cuando la geolocalización detecta un país sin checkout operativo */
export const GEO_FALLBACK_SITE_CODE: SiteCode = "pe";

export const SITE_CODE_COOKIE = "site-code";
export const SITE_URL_COOKIE = "site-url";
export const LOCALE_COOKIE = "locale";
export const COUNTRY_SELECTED_KEY = "qocina_country_selected";

export const GEO_HINT_COOKIE = "geo-hint";
export const GEO_HINT_MAX_AGE = 60 * 60 * 24;

/** Locale por defecto según país */
export const SITE_DEFAULT_LOCALE: Record<SiteCode, "es" | "en"> = {
  pe: "es", co: "es", ar: "es", mx: "es", cl: "es", ec: "es", es: "es", us: "en",
};

/** Moneda oficial por país */
export const SITE_CURRENCY: Record<SiteCode, string> = {
  pe: "PEN", co: "COP", ar: "ARS", mx: "MXN", cl: "CLP", ec: "USD", es: "EUR", us: "USD",
};
