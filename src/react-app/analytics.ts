import { ANALYTICS_SCHEMA_VERSION, type AnalyticsPrimitive, type AnalyticsSegments, type AtlasAnalyticsEvent, type AtlasEventName } from "../shared/analytics";

const VISITOR_KEY = "atlas_visitor_v1";
const SESSION_KEY = "atlas_session_v1";
const SESSION_STARTED_KEY = "atlas_session_started_v1";
const OPT_OUT_KEY = "atlas_analytics_opt_out";
const RECOMMENDATION_STARTED_KEY = "atlas_recommendation_started_v1";
const RECOMMENDATION_COMPLETED_KEY = "atlas_recommendation_completed_v1";

function randomId(prefix: string): string {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${id}`;
}

function storageId(storage: Storage, key: string, prefix: string): string {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const created = randomId(prefix);
  storage.setItem(key, created);
  return created;
}

export function analyticsDisabled(): boolean {
  if (typeof window === "undefined") return true;
  if (localStorage.getItem(OPT_OUT_KEY) === "1") return true;
  if (navigator.doNotTrack === "1") return true;
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true) return true;
  return false;
}

export function setAnalyticsOptOut(optOut: boolean): void {
  if (optOut) localStorage.setItem(OPT_OUT_KEY, "1");
  else localStorage.removeItem(OPT_OUT_KEY);
}

export interface TrackOptions {
  productId?: string;
  feature?: string;
  segments?: AnalyticsSegments;
  properties?: Record<string, AnalyticsPrimitive>;
}

export function trackAtlasEvent(name: AtlasEventName, options: TrackOptions = {}): void {
  if (analyticsDisabled()) return;

  const event: AtlasAnalyticsEvent = {
    schemaVersion: ANALYTICS_SCHEMA_VERSION,
    eventId: randomId("evt"),
    name,
    occurredAt: new Date().toISOString(),
    sessionId: storageId(sessionStorage, SESSION_KEY, "ses"),
    visitorId: storageId(localStorage, VISITOR_KEY, "vis"),
    ...options,
  };

  const body = JSON.stringify(event);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/events", blob)) return;
  }
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
}

function cleanText(value: string | null | undefined, max = 80): string | undefined {
  const text = value?.replace(/\s+/g, " ").trim();
  return text ? text.slice(0, max) : undefined;
}

function closestLabel(target: Element): string | undefined {
  const labelled = target.closest("label");
  const labelText = labelled?.childNodes[0]?.textContent ?? labelled?.textContent;
  return cleanText(labelText);
}

function recommendationStart(): void {
  if (sessionStorage.getItem(RECOMMENDATION_STARTED_KEY)) return;
  sessionStorage.setItem(RECOMMENDATION_STARTED_KEY, "1");
  trackAtlasEvent("recommendation_flow_started", { feature: "fit-engine" });
}

function recommendationCompleteSoon(): void {
  if (sessionStorage.getItem(RECOMMENDATION_COMPLETED_KEY)) return;
  window.setTimeout(() => {
    if (!document.querySelector(".v5-results .v5-result")) return;
    sessionStorage.setItem(RECOMMENDATION_COMPLETED_KEY, "1");
    trackAtlasEvent("recommendation_flow_completed", { feature: "fit-engine" });
  }, 300);
}

export function installAtlasAnalytics(): () => void {
  if (typeof document === "undefined" || analyticsDisabled()) return () => undefined;

  if (!sessionStorage.getItem(SESSION_STARTED_KEY)) {
    sessionStorage.setItem(SESSION_STARTED_KEY, "1");
    trackAtlasEvent("session_started", { feature: "atlas" });
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const topNav = target.closest(".v5-topbar nav button");
    if (topNav) {
      trackAtlasEvent("feature_viewed", { feature: cleanText(topNav.textContent) ?? "navigation" });
      return;
    }

    const productCard = target.closest(".v5-product-card");
    if (productCard) {
      const productLabel = cleanText(productCard.querySelector("h3")?.textContent);
      const brand = cleanText(productCard.querySelector(".v5-eyebrow")?.textContent);
      const inRecommendation = Boolean(productCard.closest(".v5-results"));
      trackAtlasEvent(inRecommendation ? "recommendation_result_selected" : "product_viewed", {
        feature: inRecommendation ? "fit-engine" : "catalog",
        properties: {
          ...(productLabel ? { productLabel } : {}),
          ...(brand ? { brand } : {}),
        },
      });
      return;
    }

    const similar = target.closest(".v5-similar-list button");
    if (similar) {
      trackAtlasEvent("similarity_search_used", {
        feature: "shape-lab",
        properties: { resultLabel: cleanText(similar.querySelector("h3")?.textContent) ?? "shape-result" },
      });
      return;
    }

    if (target.closest(".v5-mode-grid button") || target.closest(".v5-overlay-panel")) {
      trackAtlasEvent("shape_lab_used", { feature: "shape-lab" });
      return;
    }

    if (target.closest("#v5-profile")) {
      recommendationStart();
      recommendationCompleteSoon();
    }
  };

  const onChange = (event: Event) => {
    const target = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement
      ? event.target
      : null;
    if (!target) return;

    if (target.closest("#v5-profile")) {
      recommendationStart();
      const control = closestLabel(target) ?? (target.name || target.type || "profile-control");
      trackAtlasEvent("filters_used", {
        feature: "fit-engine",
        properties: { control },
      });
      recommendationCompleteSoon();
      return;
    }

    if (target.closest(".v5-lab-controls")) {
      trackAtlasEvent("shape_lab_used", {
        feature: "shape-lab",
        properties: { control: closestLabel(target) ?? "shape-control" },
      });
    }
  };

  document.addEventListener("click", onClick, { passive: true });
  document.addEventListener("change", onChange, { passive: true });
  return () => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("change", onChange);
  };
}
