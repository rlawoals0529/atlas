import type { GameStyle, Grip } from "./types";

export const ANALYTICS_SCHEMA_VERSION = 2 as const;
export const ANALYTICS_STORAGE_KEY = "atlas.analytics.events.v2";
export const ANALYTICS_VISITOR_KEY = "atlas.analytics.visitor.v2";
export const ANALYTICS_OPT_OUT_KEY = "atlas.analytics.opt-out.v1";
export const ANALYTICS_PRIVACY_EVENT = "atlas:analytics-privacy";
export const ANALYTICS_MAX_LOCAL_EVENTS = 1000;

export type AnalyticsDataMode = "local-real" | "demo";
export type AnalyticsPrivacyReason = "enabled" | "local-opt-out" | "global-privacy-control" | "do-not-track" | "non-browser";

export type AtlasEventName =
  | "session_started"
  | "search_performed"
  | "product_viewed"
  | "filters_changed"
  | "comparison_started"
  | "comparison_completed"
  | "shape_lab_used"
  | "shape_overlay_changed"
  | "similarity_search_used"
  | "recommendation_started"
  | "recommendation_step_completed"
  | "recommendation_abandoned"
  | "recommendation_completed"
  | "recommendation_result_selected"
  | "outbound_product_clicked"
  | "product_lab_viewed"
  | "validation_plan_generated"
  | "validation_session_started"
  | "validation_case_recorded"
  | "defect_created";

export type HandSizeBand = "small" | "medium" | "large" | "unknown";

export interface AnalyticsSegmentContext {
  handSizeBand?: HandSizeBand;
  grip?: Grip;
  gameStyle?: GameStyle;
}

export interface AtlasEventProperties {
  session_started: { visitNumber: number };
  search_performed: { queryLength: number; resultCount?: number; surface: "catalog" | "shape" | "global" };
  product_viewed: { productId: string; productType: "mouse" | "mousepad" | "skate"; sourceSurface: string };
  filters_changed: { surface: string; filterNames: string[]; activeFilterCount: number };
  comparison_started: { productIds: string[] };
  comparison_completed: { productIds: string[]; comparedCount: number };
  shape_lab_used: { action: "opened" | "alignment_changed" | "view_changed" };
  shape_overlay_changed: { view: "top" | "side" | "unknown"; activeProductIds: string[]; opacityPct?: number };
  similarity_search_used: { referenceProductId: string; mode: "balanced" | "claw" | "fingertip" | "palm"; resultCount?: number };
  recommendation_started: { entrySurface: string };
  recommendation_step_completed: { step: string; stepIndex: number };
  recommendation_abandoned: { lastStep?: string; completedSteps: number; reason: "navigation" | "pagehide" | "unknown" };
  recommendation_completed: { resultCount: number; relativeMode: boolean };
  recommendation_result_selected: { productId: string; rank?: number; fitScore?: number };
  outbound_product_clicked: { productId: string; destinationKind: "manufacturer" | "source" | "retailer" | "other" };
  product_lab_viewed: { section?: "overview" | "analytics" | "intelligence" | "validation" | "decisions" | "integrity" };
  validation_plan_generated: { productId: string; caseCount: number; automationCandidateCount: number };
  validation_session_started: { productId: string; plannedCaseCount: number };
  validation_case_recorded: { productId: string; testId: string; status: "pass" | "fail" | "blocked" | "not-run" };
  defect_created: { productId: string; severity: "S1" | "S2" | "S3" | "S4"; linkedTestId?: string };
}

export interface AtlasAnalyticsEvent<Name extends AtlasEventName = AtlasEventName> {
  schemaVersion: typeof ANALYTICS_SCHEMA_VERSION;
  eventId: string;
  eventName: Name;
  occurredAt: string;
  sessionId: string;
  anonymousVisitorId: string;
  pagePath: string;
  segment?: AnalyticsSegmentContext;
  properties: AtlasEventProperties[Name];
}

export interface AnalyticsFunnelStep {
  name: string;
  sessions: number;
  conversionFromStartPct: number;
}

export interface AnalyticsFeatureUsage {
  feature: string;
  events: number;
  sessions: number;
}

export interface AnalyticsSummary {
  mode: AnalyticsDataMode;
  generatedAt: string;
  sessions: number;
  visitors: number;
  events: number;
  activationRatePct: number;
  recommendationCompletionPct: number;
  recommendationAbandonmentPct: number;
  compareCompletionPct: number;
  shapeLabSessionPct: number;
  repeatVisitorPct: number;
  productsPerSession: number;
  engagedSessionPct: number;
  outboundCtrPct: number;
  funnel: AnalyticsFunnelStep[];
  recommendationSteps: Array<{ step: string; sessions: number }>;
  featureUsage: AnalyticsFeatureUsage[];
  topComparedProducts: Array<{ productId: string; count: number }>;
  topViewedProducts: Array<{ productId: string; count: number }>;
  filterUsage: Array<{ filter: string; count: number }>;
  segmentBreakdown: Array<{ segment: string; value: string; sessions: number }>;
}

interface VisitorState {
  id: string;
  firstSeenAt: string;
  lastSeenAt: string;
  visitNumber: number;
}

const browserAvailable = () => typeof window !== "undefined" && typeof localStorage !== "undefined";
const randomId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function safeRead<T>(key: string, fallback: T): T {
  if (!browserAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  if (!browserAvailable()) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* analytics must never break the product */ }
}

export function analyticsCollectionState(): { enabled: boolean; reason: AnalyticsPrivacyReason } {
  if (!browserAvailable() || typeof navigator === "undefined") return { enabled: false, reason: "non-browser" };
  if (localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1") return { enabled: false, reason: "local-opt-out" };
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true) return { enabled: false, reason: "global-privacy-control" };
  if (navigator.doNotTrack === "1") return { enabled: false, reason: "do-not-track" };
  return { enabled: true, reason: "enabled" };
}

export function clearLocalAnalytics(): void {
  if (!browserAvailable()) return;
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
}

export function setAnalyticsOptOut(optOut: boolean): void {
  if (!browserAvailable()) return;
  if (optOut) {
    localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    localStorage.removeItem(ANALYTICS_VISITOR_KEY);
  } else {
    localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
  }
  window.dispatchEvent(new CustomEvent(ANALYTICS_PRIVACY_EVENT, { detail: analyticsCollectionState() }));
}

export function analyticsVisitor(): VisitorState {
  const now = new Date().toISOString();
  if (!analyticsCollectionState().enabled) return { id: `disabled-${randomId()}`, firstSeenAt: now, lastSeenAt: now, visitNumber: 1 };
  const previous = safeRead<VisitorState | null>(ANALYTICS_VISITOR_KEY, null);
  if (!previous) {
    const created = { id: randomId(), firstSeenAt: now, lastSeenAt: now, visitNumber: 1 } satisfies VisitorState;
    safeWrite(ANALYTICS_VISITOR_KEY, created);
    return created;
  }

  const last = Date.parse(previous.lastSeenAt);
  const newVisit = !Number.isFinite(last) || Date.now() - last > 30 * 60 * 1000;
  const next = { ...previous, lastSeenAt: now, visitNumber: previous.visitNumber + (newVisit ? 1 : 0) };
  safeWrite(ANALYTICS_VISITOR_KEY, next);
  return next;
}

let sessionId = randomId();

export function resetAnalyticsSessionForTests(): void {
  sessionId = randomId();
}

export function localAnalyticsEvents(): AtlasAnalyticsEvent[] {
  return safeRead<AtlasAnalyticsEvent[]>(ANALYTICS_STORAGE_KEY, []);
}

export function trackAtlasEvent<Name extends AtlasEventName>(
  eventName: Name,
  properties: AtlasEventProperties[Name],
  options: { segment?: AnalyticsSegmentContext; pagePath?: string } = {},
): AtlasAnalyticsEvent<Name> | null {
  if (!analyticsCollectionState().enabled) return null;
  const visitor = analyticsVisitor();
  const event: AtlasAnalyticsEvent<Name> = {
    schemaVersion: ANALYTICS_SCHEMA_VERSION,
    eventId: randomId(),
    eventName,
    occurredAt: new Date().toISOString(),
    sessionId,
    anonymousVisitorId: visitor.id,
    pagePath: options.pagePath ?? (typeof location !== "undefined" ? `${location.pathname}${location.hash}` : "/"),
    segment: options.segment,
    properties,
  };

  const events = [...localAnalyticsEvents(), event].slice(-ANALYTICS_MAX_LOCAL_EVENTS);
  safeWrite(ANALYTICS_STORAGE_KEY, events);
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("atlas:analytics", { detail: event }));
  return event;
}

const pct = (value: number, total: number) => total ? Math.round((value / total) * 1000) / 10 : 0;
const round1 = (value: number) => Math.round(value * 10) / 10;

export function summarizeAnalytics(events: AtlasAnalyticsEvent[], mode: AnalyticsDataMode = "local-real"): AnalyticsSummary {
  const sessions = new Set(events.map(event => event.sessionId));
  const visitors = new Set(events.map(event => event.anonymousVisitorId));
  const eventSessions = (name: AtlasEventName) => new Set(events.filter(event => event.eventName === name).map(event => event.sessionId));
  const recommendationStarted = eventSessions("recommendation_started");
  const recommendationCompleted = eventSessions("recommendation_completed");
  const recommendationAbandoned = eventSessions("recommendation_abandoned");
  const comparisonStarted = eventSessions("comparison_started");
  const comparisonCompleted = eventSessions("comparison_completed");
  const shapeSessions = new Set(events.filter(event => event.eventName === "shape_lab_used" || event.eventName === "shape_overlay_changed" || event.eventName === "similarity_search_used").map(event => event.sessionId));
  const productViewSessions = eventSessions("product_viewed");
  const outboundSessions = eventSessions("outbound_product_clicked");

  const meaningfulNames = new Set<AtlasEventName>(["product_viewed", "comparison_started", "shape_lab_used", "shape_overlay_changed", "similarity_search_used", "recommendation_started"]);
  const activatedSessions = new Set(events.filter(event => meaningfulNames.has(event.eventName)).map(event => event.sessionId));
  const sessionActivity = new Map<string, number>();
  const productsBySession = new Map<string, Set<string>>();
  for (const event of events) {
    if (event.eventName !== "session_started") sessionActivity.set(event.sessionId, (sessionActivity.get(event.sessionId) ?? 0) + 1);
    if (event.eventName === "product_viewed") {
      const productId = (event.properties as AtlasEventProperties["product_viewed"]).productId;
      const set = productsBySession.get(event.sessionId) ?? new Set<string>();
      set.add(productId);
      productsBySession.set(event.sessionId, set);
    }
  }
  const engagedSessions = [...sessionActivity.values()].filter(count => count >= 3).length;
  const productSum = [...productsBySession.values()].reduce((sum, set) => sum + set.size, 0);

  const repeatVisitors = new Set(events.filter(event => event.eventName === "session_started" && (event.properties as AtlasEventProperties["session_started"]).visitNumber > 1).map(event => event.anonymousVisitorId));

  const countValues = (name: AtlasEventName, picker: (event: AtlasAnalyticsEvent) => string[]) => {
    const counts = new Map<string, number>();
    for (const event of events.filter(item => item.eventName === name)) for (const value of picker(event)) counts.set(value, (counts.get(value) ?? 0) + 1);
    return [...counts.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  };

  const viewed = countValues("product_viewed", event => [(event.properties as AtlasEventProperties["product_viewed"]).productId]);
  const compared = countValues("comparison_completed", event => (event.properties as AtlasEventProperties["comparison_completed"]).productIds);
  const filters = countValues("filters_changed", event => (event.properties as AtlasEventProperties["filters_changed"]).filterNames);
  const recommendationSteps = countValues("recommendation_step_completed", event => [(event.properties as AtlasEventProperties["recommendation_step_completed"]).step]).map(({ key, count }) => ({ step: key, sessions: new Set(events.filter(event => event.eventName === "recommendation_step_completed" && (event.properties as AtlasEventProperties["recommendation_step_completed"]).step === key).map(event => event.sessionId)).size })).sort((a, b) => b.sessions - a.sessions || a.step.localeCompare(b.step));

  const featureDefinitions: Array<[string, AtlasEventName[]]> = [
    ["Search", ["search_performed"]],
    ["Product detail", ["product_viewed"]],
    ["Compare", ["comparison_started", "comparison_completed"]],
    ["Shape Lab", ["shape_lab_used", "shape_overlay_changed", "similarity_search_used"]],
    ["Recommendations", ["recommendation_started", "recommendation_step_completed", "recommendation_completed", "recommendation_result_selected"]],
    ["Product Lab", ["product_lab_viewed"]],
    ["Validation", ["validation_plan_generated", "validation_session_started", "validation_case_recorded"]],
  ];

  const featureUsage = featureDefinitions.map(([feature, names]) => {
    const matching = events.filter(event => names.includes(event.eventName));
    return { feature, events: matching.length, sessions: new Set(matching.map(event => event.sessionId)).size };
  }).sort((a, b) => b.events - a.events || a.feature.localeCompare(b.feature));

  const funnelSteps: Array<[string, AtlasEventName]> = [
    ["Started recommendation", "recommendation_started"],
    ["Completed a step", "recommendation_step_completed"],
    ["Reached recommendation", "recommendation_completed"],
    ["Selected a result", "recommendation_result_selected"],
    ["Clicked outbound", "outbound_product_clicked"],
  ];
  const funnelStart = recommendationStarted.size;
  const funnel = funnelSteps.map(([name, eventName]) => {
    const count = eventSessions(eventName).size;
    return { name, sessions: count, conversionFromStartPct: pct(count, funnelStart) };
  });

  const segmentCounts = new Map<string, Set<string>>();
  for (const event of events) {
    const segment = event.segment;
    if (!segment) continue;
    for (const [key, value] of Object.entries(segment)) {
      if (!value) continue;
      const mapKey = `${key}::${value}`;
      const set = segmentCounts.get(mapKey) ?? new Set<string>();
      set.add(event.sessionId);
      segmentCounts.set(mapKey, set);
    }
  }

  return {
    mode,
    generatedAt: new Date().toISOString(),
    sessions: sessions.size,
    visitors: visitors.size,
    events: events.length,
    activationRatePct: pct(activatedSessions.size, sessions.size),
    recommendationCompletionPct: pct(recommendationCompleted.size, recommendationStarted.size),
    recommendationAbandonmentPct: pct(recommendationAbandoned.size, recommendationStarted.size),
    compareCompletionPct: pct(comparisonCompleted.size, comparisonStarted.size),
    shapeLabSessionPct: pct(shapeSessions.size, sessions.size),
    repeatVisitorPct: pct(repeatVisitors.size, visitors.size),
    productsPerSession: sessions.size ? round1(productSum / sessions.size) : 0,
    engagedSessionPct: pct(engagedSessions, sessions.size),
    outboundCtrPct: pct(outboundSessions.size, productViewSessions.size),
    funnel,
    recommendationSteps,
    featureUsage,
    topComparedProducts: compared.slice(0, 8).map(({ key, count }) => ({ productId: key, count })),
    topViewedProducts: viewed.slice(0, 8).map(({ key, count }) => ({ productId: key, count })),
    filterUsage: filters.slice(0, 10).map(({ key, count }) => ({ filter: key, count })),
    segmentBreakdown: [...segmentCounts.entries()].map(([key, set]) => {
      const [segment, value] = key.split("::");
      return { segment, value, sessions: set.size };
    }).sort((a, b) => b.sessions - a.sessions || a.segment.localeCompare(b.segment)),
  };
}

export const DEMO_ANALYTICS_EVENTS: AtlasAnalyticsEvent[] = (() => {
  const base = Date.UTC(2026, 8, 20, 18, 0, 0);
  const rows: AtlasAnalyticsEvent[] = [];
  const add = <Name extends AtlasEventName>(visitor: number, session: number, offset: number, eventName: Name, properties: AtlasEventProperties[Name], segment?: AnalyticsSegmentContext) => {
    rows.push({
      schemaVersion: ANALYTICS_SCHEMA_VERSION,
      eventId: `demo-${visitor}-${session}-${offset}-${eventName}`,
      eventName,
      occurredAt: new Date(base + offset * 60_000).toISOString(),
      sessionId: `demo-session-${visitor}-${session}`,
      anonymousVisitorId: `demo-visitor-${visitor}`,
      pagePath: "/#demo",
      segment,
      properties,
    });
  };

  const segments: AnalyticsSegmentContext[] = [
    { handSizeBand: "medium", grip: "relaxed-claw", gameStyle: "tactical-fps" },
    { handSizeBand: "small", grip: "fingertip", gameStyle: "tracking-fps" },
    { handSizeBand: "large", grip: "palm", gameStyle: "mixed" },
  ];

  for (let visitor = 1; visitor <= 12; visitor += 1) {
    const sessionsForVisitor = visitor <= 3 ? 2 : 1;
    for (let session = 1; session <= sessionsForVisitor; session += 1) {
      const segment = segments[(visitor - 1) % segments.length];
      const start = visitor * 100 + session * 10;
      add(visitor, session, start, "session_started", { visitNumber: session }, segment);
      add(visitor, session, start + 1, "recommendation_started", { entrySurface: "fit" }, segment);
      add(visitor, session, start + 2, "recommendation_step_completed", { step: "grip-and-hand", stepIndex: 1 }, segment);
      if (visitor !== 11) add(visitor, session, start + 3, "recommendation_completed", { resultCount: 5, relativeMode: false }, segment);
      else add(visitor, session, start + 3, "recommendation_abandoned", { lastStep: "grip-and-hand", completedSteps: 1, reason: "pagehide" }, segment);
      if (visitor % 3 !== 0) add(visitor, session, start + 4, "recommendation_result_selected", { productId: visitor % 2 ? "mouse-razer-viper-v3-pro" : "mouse-logitech-g-pro-x-superlight-2", rank: 1, fitScore: 90 }, segment);
      if (visitor % 2 === 0) add(visitor, session, start + 5, "shape_lab_used", { action: "opened" }, segment);
      if (visitor % 4 === 0) add(visitor, session, start + 6, "comparison_completed", { productIds: ["mouse-razer-viper-v3-pro", "mouse-logitech-g-pro-x-superlight-2"], comparedCount: 2 }, segment);
      add(visitor, session, start + 7, "product_viewed", { productId: visitor % 2 ? "mouse-razer-viper-v3-pro" : "mouse-logitech-g-pro-x-superlight-2", productType: "mouse", sourceSurface: "recommendation" }, segment);
      if (visitor % 3 === 1) add(visitor, session, start + 8, "outbound_product_clicked", { productId: "mouse-razer-viper-v3-pro", destinationKind: "manufacturer" }, segment);
    }
  }
  return rows;
})();
