import type { AtlasAnalyticsEvent, AtlasEventProperties } from "./analytics";
import type { MouseProduct } from "./types";

export interface SessionDepthComparison {
  cohort: "Shape Lab sessions" | "Other sessions";
  sessions: number;
  eventsPerSession: number;
  productViewsPerSession: number;
  comparisonSessionPct: number;
  outboundSessionPct: number;
}

export interface SegmentBehaviorRow {
  segment: "handSizeBand" | "grip" | "gameStyle";
  value: string;
  sessions: number;
  recommendationStarted: number;
  recommendationCompleted: number;
  recommendationCompletionPct: number;
  shapeLabSessionPct: number;
  outboundSessionPct: number;
}

export interface AttributeEngagementRow {
  attribute: "shape" | "weight" | "polling" | "price";
  value: string;
  viewSessions: number;
  outboundSessions: number;
  outboundPerViewSessionPct: number;
}

const pct = (value: number, total: number) => total ? Math.round((value / total) * 1000) / 10 : 0;
const round1 = (value: number) => Math.round(value * 10) / 10;

function sessionMap(events: AtlasAnalyticsEvent[]) {
  const map = new Map<string, AtlasAnalyticsEvent[]>();
  for (const event of events) {
    const list = map.get(event.sessionId) ?? [];
    list.push(event);
    map.set(event.sessionId, list);
  }
  return map;
}

export function compareShapeLabSessionDepth(events: AtlasAnalyticsEvent[]): SessionDepthComparison[] {
  const sessions = sessionMap(events);
  const rows = [true, false].map(usedShapeLab => {
    const selected = [...sessions.values()].filter(sessionEvents => sessionEvents.some(event => event.eventName === "shape_lab_used") === usedShapeLab);
    const eventCount = selected.reduce((sum, list) => sum + list.length, 0);
    const productViews = selected.reduce((sum, list) => sum + list.filter(event => event.eventName === "product_viewed").length, 0);
    const comparisonSessions = selected.filter(list => list.some(event => event.eventName === "comparison_completed")).length;
    const outboundSessions = selected.filter(list => list.some(event => event.eventName === "outbound_product_clicked")).length;
    return {
      cohort: usedShapeLab ? "Shape Lab sessions" as const : "Other sessions" as const,
      sessions: selected.length,
      eventsPerSession: selected.length ? round1(eventCount / selected.length) : 0,
      productViewsPerSession: selected.length ? round1(productViews / selected.length) : 0,
      comparisonSessionPct: pct(comparisonSessions, selected.length),
      outboundSessionPct: pct(outboundSessions, selected.length),
    };
  });
  return rows;
}

export function segmentBehavior(events: AtlasAnalyticsEvent[]): SegmentBehaviorRow[] {
  const sessions = sessionMap(events);
  const segments = new Map<string, Set<string>>();
  for (const [sessionId, list] of sessions) {
    const context = list.find(event => event.segment)?.segment;
    if (!context) continue;
    for (const key of ["handSizeBand", "grip", "gameStyle"] as const) {
      const value = context[key];
      if (!value) continue;
      const mapKey = `${key}::${value}`;
      const set = segments.get(mapKey) ?? new Set<string>();
      set.add(sessionId);
      segments.set(mapKey, set);
    }
  }

  return [...segments.entries()].map(([mapKey, ids]) => {
    const [segment, value] = mapKey.split("::") as [SegmentBehaviorRow["segment"], string];
    const lists = [...ids].map(id => sessions.get(id) ?? []);
    const started = lists.filter(list => list.some(event => event.eventName === "recommendation_started")).length;
    const completed = lists.filter(list => list.some(event => event.eventName === "recommendation_completed")).length;
    const shape = lists.filter(list => list.some(event => event.eventName === "shape_lab_used")).length;
    const outbound = lists.filter(list => list.some(event => event.eventName === "outbound_product_clicked")).length;
    return {
      segment,
      value,
      sessions: ids.size,
      recommendationStarted: started,
      recommendationCompleted: completed,
      recommendationCompletionPct: pct(completed, started),
      shapeLabSessionPct: pct(shape, ids.size),
      outboundSessionPct: pct(outbound, ids.size),
    };
  }).sort((a, b) => a.segment.localeCompare(b.segment) || b.sessions - a.sessions || a.value.localeCompare(b.value));
}

function weightBand(mouse: MouseProduct) {
  const value = mouse.specs.weightG;
  if (value < 50) return "<50 g";
  if (value < 60) return "50–59 g";
  if (value < 70) return "60–69 g";
  return "70+ g";
}

function pollingBand(mouse: MouseProduct) {
  const value = mouse.specs.maxPollingHz;
  if (value <= 1000) return "1K or lower";
  if (value <= 2000) return "2K";
  if (value <= 4000) return "4K";
  return "8K+";
}

function priceBand(mouse: MouseProduct) {
  const value = mouse.msrpUsd;
  if (value == null) return "Unknown MSRP";
  if (value < 80) return "<$80";
  if (value < 120) return "$80–119";
  if (value < 160) return "$120–159";
  return "$160+";
}

export function attributeOutboundEngagement(events: AtlasAnalyticsEvent[], products: MouseProduct[]): AttributeEngagementRow[] {
  const byId = new Map(products.map(product => [product.id, product]));
  const buckets = new Map<string, { attribute: AttributeEngagementRow["attribute"]; value: string; views: Set<string>; outbound: Set<string> }>();

  const note = (attribute: AttributeEngagementRow["attribute"], value: string, sessionId: string, outbound: boolean) => {
    const key = `${attribute}::${value}`;
    const row = buckets.get(key) ?? { attribute, value, views: new Set<string>(), outbound: new Set<string>() };
    if (outbound) row.outbound.add(sessionId); else row.views.add(sessionId);
    buckets.set(key, row);
  };

  for (const event of events) {
    if (event.eventName !== "product_viewed" && event.eventName !== "outbound_product_clicked") continue;
    const productId = (event.properties as AtlasEventProperties["product_viewed"] | AtlasEventProperties["outbound_product_clicked"]).productId;
    const product = byId.get(productId);
    if (!product) continue;
    const outbound = event.eventName === "outbound_product_clicked";
    note("shape", product.specs.shape, event.sessionId, outbound);
    note("weight", weightBand(product), event.sessionId, outbound);
    note("polling", pollingBand(product), event.sessionId, outbound);
    note("price", priceBand(product), event.sessionId, outbound);
  }

  return [...buckets.values()].map(row => ({
    attribute: row.attribute,
    value: row.value,
    viewSessions: row.views.size,
    outboundSessions: row.outbound.size,
    outboundPerViewSessionPct: pct(row.outbound.size, row.views.size),
  })).filter(row => row.viewSessions > 0).sort((a, b) => a.attribute.localeCompare(b.attribute) || b.viewSessions - a.viewSessions || a.value.localeCompare(b.value));
}

export function topFilterUsage(events: AtlasAnalyticsEvent[], limit = 10): Array<{ filter: string; events: number; sessions: number }> {
  const map = new Map<string, { events: number; sessions: Set<string> }>();
  for (const event of events) {
    if (event.eventName !== "filters_changed") continue;
    const properties = event.properties as AtlasEventProperties["filters_changed"];
    for (const filter of properties.filterNames) {
      const row = map.get(filter) ?? { events: 0, sessions: new Set<string>() };
      row.events += 1;
      row.sessions.add(event.sessionId);
      map.set(filter, row);
    }
  }
  return [...map.entries()].map(([filter, row]) => ({ filter, events: row.events, sessions: row.sessions.size })).sort((a, b) => b.events - a.events || a.filter.localeCompare(b.filter)).slice(0, limit);
}
