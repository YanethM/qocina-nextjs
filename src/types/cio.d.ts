interface CioAnalytics {
  identify(userIdOrTraits: string | { email: string }, traits?: Record<string, unknown>): void;
  track(event: string, properties?: Record<string, unknown>): void;
  page(name?: string, properties?: Record<string, unknown>): void;
}

declare global {
  interface Window {
    cioanalytics: CioAnalytics;
  }
}

export {};
