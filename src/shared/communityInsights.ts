export type CommunityAttribute =
  | "shape"
  | "size"
  | "weight"
  | "weight-balance"
  | "coating"
  | "main-clicks"
  | "side-buttons"
  | "scroll-wheel"
  | "skates"
  | "sensor-implementation"
  | "wireless-performance"
  | "battery"
  | "software"
  | "qc-reliability"
  | "price-value";

export type Sentiment = "positive" | "mixed" | "negative" | "neutral";
export type EvidenceStrength = "anecdotal" | "repeated-observation" | "broad-community-pattern";

export interface CommunityInsight {
  id: string;
  productId: string;
  attribute: CommunityAttribute;
  sentiment: Sentiment;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceType: "reddit" | "forum" | "review" | "video" | "other";
  observedAt: string;
  conditions?: string;
  evidenceStrength: EvidenceStrength;
  sampleSize?: number;
  disagreementNote?: string;
}

export interface CommunityInsightAggregate {
  productId: string;
  attribute: CommunityAttribute;
  positive: number;
  mixed: number;
  negative: number;
  neutral: number;
  sourceCount: number;
  summary: string;
  limitation: string;
}

export function aggregateCommunityInsights(rows: CommunityInsight[]): CommunityInsightAggregate[] {
  const groups = new Map<string, CommunityInsight[]>();
  for (const row of rows) {
    const key = `${row.productId}::${row.attribute}`;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }

  return [...groups.values()].map(group => {
    const first = group[0];
    const counts = { positive: 0, mixed: 0, negative: 0, neutral: 0 };
    for (const row of group) counts[row.sentiment] += 1;
    return {
      productId: first.productId,
      attribute: first.attribute,
      ...counts,
      sourceCount: new Set(group.map(row => row.sourceUrl)).size,
      summary: `${group.length} traceable observation${group.length === 1 ? "" : "s"} recorded for ${first.attribute}.`,
      limitation: "Community observations are directional evidence, not representative market research. Preserve source, date, conditions and disagreement before drawing a product conclusion.",
    };
  });
}
