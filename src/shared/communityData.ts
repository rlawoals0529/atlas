import rawPilot from "../../data/community-insights.2026q3.json";
import { aggregateCommunityInsights, type CommunityInsight } from "./communityInsights";

export interface CommunityPilotMethodology {
  selection: string;
  interpretation: string;
  limitations: string[];
}

export interface CommunityPilotData {
  version: number;
  observedAt: string;
  scope: string;
  methodology: CommunityPilotMethodology;
  insights: CommunityInsight[];
}

export const communityPilot = rawPilot as unknown as CommunityPilotData;
export const communityInsights = communityPilot.insights;
export const communityAggregates = aggregateCommunityInsights(communityInsights);

export const communityPilotProductIds = [...new Set(communityInsights.map(row => row.productId))];
