import rawGames from "../../data/sensitivity-games.json";

export interface SensitivitySource {
  label: string;
  url: string;
}

export interface SensitivityGame {
  id: string;
  label: string;
  yaw: number;
  decimals: number;
  confidence: "high" | "medium" | "low";
  sources: SensitivitySource[];
  note: string;
}

export interface SensitivityDataset {
  version: number;
  checkedAt: string;
  scope: string;
  games: SensitivityGame[];
}

export const sensitivityDataset = rawGames as unknown as SensitivityDataset;
export const sensitivityGames = sensitivityDataset.games;

export function gameById(id: string) {
  return sensitivityGames.find(game => game.id === id) ?? null;
}

export function cm360(dpi: number, sensitivity: number, yaw: number) {
  if (![dpi, sensitivity, yaw].every(value => Number.isFinite(value) && value > 0)) return null;
  return (360 * 2.54) / (dpi * sensitivity * yaw);
}

export function inches360(dpi: number, sensitivity: number, yaw: number) {
  const cm = cm360(dpi, sensitivity, yaw);
  return cm == null ? null : cm / 2.54;
}

export function effectiveDpi(dpi: number, sensitivity: number) {
  if (![dpi, sensitivity].every(value => Number.isFinite(value) && value > 0)) return null;
  return dpi * sensitivity;
}

export function sensitivityForCm360(dpi: number, targetCm360: number, yaw: number) {
  if (![dpi, targetCm360, yaw].every(value => Number.isFinite(value) && value > 0)) return null;
  return (360 * 2.54) / (dpi * yaw * targetCm360);
}

export function convertSensitivity(params: {
  sourceSensitivity: number;
  sourceDpi: number;
  sourceYaw: number;
  targetDpi: number;
  targetYaw: number;
}) {
  const { sourceSensitivity, sourceDpi, sourceYaw, targetDpi, targetYaw } = params;
  if (![sourceSensitivity, sourceDpi, sourceYaw, targetDpi, targetYaw].every(value => Number.isFinite(value) && value > 0)) return null;
  return (sourceSensitivity * sourceDpi * sourceYaw) / (targetDpi * targetYaw);
}
