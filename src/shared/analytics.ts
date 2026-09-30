export const ANALYTICS_SCHEMA_VERSION = 1 as const;

export type AtlasEventName =
  | "session_started"
  | "feature_viewed"
  | "search_performed"
  | "filters_used"
  | "product_viewed"
  | "comparison_started"
  | "comparison_completed"
  | "shape_lab_used"
  | "similarity_search_used"
  | "recommendation_flow_started"
  | "recommendation_flow_completed"
  | "recommendation_result_selected"
  | "outbound_product_clicked";

export type AnalyticsPrimitive = string | number | boolean;

export interface AnalyticsSegments {
  grip?: string;
  gameStyle?: string;
  handSize?: "small" | "medium" | "large";
}

export interface AtlasAnalyticsEvent {
  schemaVersion: typeof ANALYTICS_SCHEMA_VERSION;
  eventId: string;
  name: AtlasEventName;
  occurredAt: string;
  sessionId: string;
  visitorId: string;
  productId?: string;
  feature?: string;
  segments?: AnalyticsSegments;
  properties?: Record<string, AnalyticsPrimitive>;
}

export const ATLAS_EVENT_NAMES: readonly AtlasEventName[] = [
  "session_started",
  "feature_viewed",
  "search_performed",
  "filters_used",
  "product_viewed",
  "comparison_started",
  "comparison_completed",
  "shape_lab_used",
  "similarity_search_used",
  "recommendation_flow_started",
  "recommendation_flow_completed",
  "recommendation_result_selected",
  "outbound_product_clicked",
] as const;

const idPattern = /^[a-zA-Z0-9._:-]{8,120}$/;
const textPattern = /^[^\u0000-\u001f\u007f]{1,120}$/;

function isPrimitive(value: unknown): value is AnalyticsPrimitive {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function validProperties(value: unknown): value is Record<string, AnalyticsPrimitive> {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > 12) return false;
  return entries.every(([key, item]) => {
    if (!/^[a-zA-Z0-9_.:-]{1,48}$/.test(key) || !isPrimitive(item)) return false;
    if (typeof item === "string") return textPattern.test(item);
    return typeof item !== "number" || Number.isFinite(item);
  });
}

function validSegments(value: unknown): value is AnalyticsSegments {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const s = value as Record<string, unknown>;
  if (Object.keys(s).some(key => !["grip", "gameStyle", "handSize"].includes(key))) return false;
  return (s.grip === undefined || (typeof s.grip === "string" && textPattern.test(s.grip)))
    && (s.gameStyle === undefined || (typeof s.gameStyle === "string" && textPattern.test(s.gameStyle)))
    && (s.handSize === undefined || ["small", "medium", "large"].includes(String(s.handSize)));
}

export function isAtlasAnalyticsEvent(value: unknown): value is AtlasAnalyticsEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;
  if (event.schemaVersion !== ANALYTICS_SCHEMA_VERSION) return false;
  if (!ATLAS_EVENT_NAMES.includes(event.name as AtlasEventName)) return false;
  if (typeof event.eventId !== "string" || !idPattern.test(event.eventId)) return false;
  if (typeof event.sessionId !== "string" || !idPattern.test(event.sessionId)) return false;
  if (typeof event.visitorId !== "string" || !idPattern.test(event.visitorId)) return false;
  if (typeof event.occurredAt !== "string" || Number.isNaN(Date.parse(event.occurredAt))) return false;
  if (event.productId !== undefined && (typeof event.productId !== "string" || !textPattern.test(event.productId))) return false;
  if (event.feature !== undefined && (typeof event.feature !== "string" || !textPattern.test(event.feature))) return false;
  return validSegments(event.segments) && validProperties(event.properties);
}

export function handSizeBucket(lengthCm: number, widthCm: number): AnalyticsSegments["handSize"] {
  const score = lengthCm + widthCm * 0.6;
  if (score < 24) return "small";
  if (score > 27) return "large";
  return "medium";
}
