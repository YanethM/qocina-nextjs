interface CioAnalytics {
  identify(userIdOrTraits: string | { email: string }, traits?: Record<string, unknown>): void;
  track(event: string, properties?: Record<string, unknown>): void;
  page(name?: string, properties?: Record<string, unknown>): void;
  addSourceMiddleware(fn: (params: { payload: any; next: (payload: any) => void }) => void): void;
  reset(): void;
}

declare global {
  interface Window {
    cioanalytics: CioAnalytics;
  }
}

export {};
