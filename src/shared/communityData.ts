import rawMousePilot from "../../data/community-insights.2026q3.json";
import rawSurfacePilot from "../../data/community-insights.surfaces.2026q3.json";
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

export const communityPilots = [rawMousePilot, rawSurfacePilot] as unknown as CommunityPilotData[];
// Backward compatibility for consumers that still refer to the original mouse pilot.
export const communityPilot = communityPilots[0];
export const communityInsights = communityPilots.flatMap(pilot => pilot.insights);
export const communityAggregates = aggregateCommunityInsights(communityInsights);
export const communityPilotProductIds = [...new Set(communityInsights.map(row => row.productId))];

export function pilotForProduct(productId: string) {
  return communityPilots.find(pilot => pilot.insights.some(row => row.productId === productId)) ?? communityPilots[0];
}
