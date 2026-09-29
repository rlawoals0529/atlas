export type ProductType = "mouse" | "mousepad" | "skate";
export type SourceKind = "manufacturer" | "independent" | "community" | "editorial";
export type Confidence = "high" | "medium" | "low";
export type Grip =
  | "palm"
  | "relaxed-claw"
  | "aggressive-claw"
  | "pincer-claw"
  | "knuckle-claw"
  | "fingertip"
  | "extended-fingertip"
  | "palm-claw-hybrid";
export type GameStyle =
  | "tactical-fps"
  | "tracking-fps"
  | "arena-fps"
  | "battle-royale"
  | "moba-rts"
  | "mmo"
  | "action"
  | "mixed";
export type AimStyle = "finger" | "wrist" | "hybrid" | "arm";

export interface SourceRef {
  id: string;
  label: string;
  url: string;
  kind: SourceKind;
  checkedAt: string;
}

export interface EvidenceNote {
  sourceIds: string[];
  confidence: Confidence;
  note?: string;
}

export interface BaseProduct {
  id: string;
  slug: string;
  type: ProductType;
  brand: string;
  model: string;
  status: "current" | "discontinued" | "announced";
  msrpUsd?: number;
  summary: string;
  tags?: string[];
  sources: SourceRef[];
}

export interface MouseProduct extends BaseProduct {
  type: "mouse";
  specs: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    gripWidthMm?: number;
    frontHeightMm?: number;
    weightG: number;
    shape: "symmetrical" | "ergonomic";
    hump: "front" | "center" | "rear" | "center-rear";
    frontFlare: "low" | "medium" | "high";
    sideCurvature: "straight" | "mild" | "aggressive";
    sensor: string;
    maxDpi?: number;
    maxPollingHz: number;
    connectivity: string[];
    switchType: "mechanical" | "optical" | "hybrid" | "inductive";
    mainSwitch?: string;
    encoder?: string;
    mcu?: string;
    shellMaterial: string;
    programmableButtons?: number;
    sideButtons?: number;
    tiltWheel?: boolean;
    freeSpinWheel?: boolean;
    onboardProfiles?: number;
    webDriver?: boolean;
    driverless?: boolean;
    battery1kHours?: number;
    battery4kHours?: number;
    battery8kHours?: number;
    stockSkateMaterial?: string;
  };
  outline?: {
    top?: [number, number][];
    side?: [number, number][];
    sourceType: "parametric" | "measured-svg" | "scan";
    sourceIds?: string[];
  };
  geometry?: {
    humpPositionPct?: number; // 0 = front, 100 = rear
    humpFullness?: number;
    rearFlare?: number;
    frontFlare?: number;
    sideTaper?: number;
    sideWallAngle?: number;
    buttonHeight?: number;
    pinkyClearance?: number;
    sensorOffsetMm?: number; // positive = forward of geometric center
  };
  fit: {
    handLengthCm: [number, number];
    handWidthCm: [number, number];
    grip: Partial<Record<Grip, number>>;
    aimStyle: Partial<Record<AimStyle, number>>;
    gameStyle: Partial<Record<GameStyle, number>> & Record<string, number>;
    coatingDry: number;
    coatingSweaty: number;
    clickLightness: number;
    clickCrispness?: number;
    wheelTactility?: number;
    liftSecurity?: number;
    palmSupport?: number;
    balance: "rear" | "center" | "front" | "unknown";
  };
  performance?: {
    clickLatencyMs?: number;
    sensorLatencyMs?: number;
    measuredPollingHz?: number;
    cpiDeviationPct?: number;
    sourceIds?: string[];
  };
  evidence: Record<string, EvidenceNote>;
}

export interface MousepadProduct extends BaseProduct {
  type: "mousepad";
  specs: {
    surfaceClass: "cloth" | "hybrid" | "glass" | "resin" | "plastic";
    surfaceMaterial: string;
    baseMaterial: string;
    firmness: "xsoft" | "soft" | "mid" | "firm" | "hard";
    thicknessMm: number;
    widthMm: number;
    heightMm: number;
    stitchedEdges: boolean;
  };
  feel: {
    staticSpeed: number;
    dynamicSpeed: number;
    stoppingPower: number;
    texture: number;
    pressureResponse: number;
    humidityResistance: number;
    sleeveCompatibility: number;
    xyConsistency: number;
    noise: number;
    skinDrag?: number;
    breakInChange?: number;
    wornZoneStability?: number;
    cleaningRecovery?: number;
  };
  evidence: Record<string, EvidenceNote>;
}

export interface SkateProduct extends BaseProduct {
  type: "skate";
  specs: {
    material: "pure-ptfe" | "hardened-ptfe" | "uhmwpe" | "glass" | "pom" | "other";
    format: "dots" | "donuts" | "full-size";
    thicknessMm?: number;
    diameterMm?: number;
    cushionLayer: boolean;
    antiCollapse: boolean;
  };
  feel: {
    speed: number;
    control: number;
    noise: number;
    durability: number;
    freshSpeed?: number;
    brokenInSpeed?: number;
    wearRate?: number;
    dustSensitivity?: number;
  };
  compatibility: {
    cloth: boolean;
    hybrid: boolean;
    glass: boolean;
    plastic: boolean;
    softBase: "good" | "conditional" | "avoid";
  };
  evidence: Record<string, EvidenceNote>;
}

export type Product = MouseProduct | MousepadProduct | SkateProduct;

export interface RelativePreference {
  currentMouseId?: string;
  sizeDelta: -2 | -1 | 0 | 1 | 2;
  widthDelta: -2 | -1 | 0 | 1 | 2;
  humpDelta: -2 | -1 | 0 | 1 | 2;
  weightDelta: -2 | -1 | 0 | 1 | 2;
  palmSupportDelta: -2 | -1 | 0 | 1 | 2;
}

export interface UserProfile {
  handLengthCm: number;
  handWidthCm: number;
  grip: Grip;
  fingerLayout: "1-2-2" | "1-3-1-wheel" | "1-3-1-m2";
  aimStyle: AimStyle;
  gameStyle: GameStyle;
  cm360: number;
  dpi: number;
  displayHz: number;
  cpuTier: "entry" | "mid" | "high";
  weightPreference: "ultralight" | "light" | "medium" | "heavy" | "any";
  shapePreference: "symmetrical" | "ergonomic" | "any";
  clickPreference: "light" | "medium" | "firm" | "any";
  wheelPreference: "light" | "defined" | "free-spin" | "any";
  extraButtons: "minimal" | "some" | "many";
  padSpeed: number;
  textureTolerance: number;
  pressureHabit: "light" | "variable" | "heavy";
  climate: "dry" | "normal" | "humid";
  handMoisture: "dry" | "normal" | "sweaty";
  sleeve: boolean;
  budgetUsd: number;
  relative: RelativePreference;
}

export interface Recommendation<T extends Product = Product> {
  product: T;
  score: number;
  reasons: string[];
  cautions: string[];
  breakdown?: Record<string, number>;
}
