export type CommunityAttribute =
  | "shape"
  | "size"
  | "grip-fit"
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
export type EvidenceStrength = "anecdotal" | "repeated-observation" | "structured-sample" | "independent-measurement";
export type ConsensusIndicator = "single-source" | "disagreement" | "directional" | "cross-source-consensus";
export type CommunitySourceType = "reddit" | "forum" | "review" | "video" | "support-thread" | "other";

export interface CommunityInsight {
  id: string;
  productId: string;
  attribute: CommunityAttribute;
  sentiment: Sentiment;
  summary: string;
  sourceId: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceType: CommunitySourceType;
  publishedAt?: string;
  observedAt: string;
  conditions?: string;
  evidenceStrength: EvidenceStrength;
  sampleSize?: number;
  consensus: ConsensusIndicator;
  disagreementNote?: string;
  quote?: string;
  quoteUse?: "short-verbatim" | "paraphrase";
}

export interface CommunityInsightAggregate {
  productId: string;
  attribute: CommunityAttribute;
  positive: number;
  mixed: number;
  negative: number;
  neutral: number;
  sourceCount: number;
  sourceTypeCount: number;
  consensus: ConsensusIndicator;
  summary: string;
  limitation: string;
}

function consensusFor(group: CommunityInsight[]): ConsensusIndicator {
  if (new Set(group.map(row => row.sourceId)).size <= 1) return "single-source";
  const directional = group.filter(row => row.sentiment !== "neutral");
  const sentimentKinds = new Set(directional.map(row => row.sentiment));
  if (sentimentKinds.has("positive") && sentimentKinds.has("negative")) return "disagreement";
  if (group.some(row => row.consensus === "cross-source-consensus") && new Set(group.map(row => row.sourceType)).size >= 2) return "cross-source-consensus";
  return "directional";
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
    const sourceCount = new Set(group.map(row => row.sourceId)).size;
    const sourceTypeCount = new Set(group.map(row => row.sourceType)).size;
    const consensus = consensusFor(group);
    return {
      productId: first.productId,
      attribute: first.attribute,
      ...counts,
      sourceCount,
      sourceTypeCount,
      consensus,
      summary: `${group.length} traceable observation${group.length === 1 ? "" : "s"} from ${sourceCount} source${sourceCount === 1 ? "" : "s"} recorded for ${first.attribute}.`,
      limitation: "Community observations are directional evidence, not representative market research. Source selection, self-selection and shared talking points can create apparent consensus; preserve source, date, conditions, sample size and disagreement before drawing a product conclusion.",
    };
  });
}
