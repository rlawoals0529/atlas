import { mice, mousepads, skates } from "./catalog";
import type { GameStyle, MouseProduct, MousepadProduct, Recommendation, SkateProduct, UserProfile } from "./types";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const proximity = (value: number, min: number, max: number) => {
  if (value >= min && value <= max) return 100;
  const delta = value < min ? min - value : value - max;
  return clamp(100 - delta * 28);
};
const target = (actual: number, desired: number, scale: number) => clamp(100 - Math.abs(actual - desired) * scale);

function gameScore(mouse: MouseProduct, game: GameStyle) {
  const direct = mouse.fit.gameStyle[game];
  if (typeof direct === "number") return direct;
  const legacy = mouse.fit.gameStyle as Record<string, number | undefined>;
  if (game === "tactical-fps") return legacy.tactical ?? 78;
  if (game === "tracking-fps" || game === "arena-fps") return legacy.tracking ?? 78;
  if (game === "battle-royale" || game === "action") return legacy.mixed ?? 78;
  if (game === "moba-rts") return legacy.moba ?? 72;
  if (game === "mmo") {
    const buttons = mouse.specs.programmableButtons ?? 5;
    return clamp(42 + buttons * 4.5 + (mouse.specs.tiltWheel ? 8 : 0));
  }
  return legacy.mixed ?? 80;
}

function buttonFit(mouse: MouseProduct, profile: UserProfile) {
  const buttons = mouse.specs.programmableButtons ?? 5;
  if (profile.extraButtons === "minimal") return buttons <= 7 ? 100 : clamp(100 - (buttons - 7) * 8);
  if (profile.extraButtons === "some") return buttons >= 7 && buttons <= 12 ? 100 : clamp(85 - Math.abs(buttons - 9) * 5);
  return clamp(45 + buttons * 4);
}

function clickFit(mouse: MouseProduct, profile: UserProfile) {
  if (profile.clickPreference === "any") return 90;
  const desired = profile.clickPreference === "light" ? 88 : profile.clickPreference === "medium" ? 65 : 38;
  return target(mouse.fit.clickLightness, desired, 1.1);
}

function wheelFit(mouse: MouseProduct, profile: UserProfile) {
  if (profile.wheelPreference === "any") return 90;
  if (profile.wheelPreference === "free-spin") return mouse.specs.freeSpinWheel ? 100 : 25;
  const tactility = mouse.fit.wheelTactility ?? 65;
  return profile.wheelPreference === "defined" ? target(tactility, 82, 0.8) : target(tactility, 38, 0.8);
}

function highPollingValue(mouse: MouseProduct, profile: UserProfile) {
  // This is intentionally a small weight: modern gaming mice are already fast, and
  // high polling has diminishing practical returns outside suitable systems/scenarios.
  if (mouse.specs.maxPollingHz <= 1000) return 75;
  const display = profile.displayHz >= 360 ? 100 : profile.displayHz >= 240 ? 90 : profile.displayHz >= 165 ? 78 : 66;
  const cpu = profile.cpuTier === "high" ? 100 : profile.cpuTier === "mid" ? 86 : 68;
  const dpi = profile.dpi >= 1600 ? 100 : profile.dpi >= 800 ? 86 : 70;
  const cap = mouse.specs.maxPollingHz >= 8000 ? 100 : mouse.specs.maxPollingHz >= 4000 ? 92 : 84;
  return display * .3 + cpu * .25 + dpi * .25 + cap * .2;
}

function relativeFit(mouse: MouseProduct, profile: UserProfile) {
  const current = mice.find((m) => m.id === profile.relative.currentMouseId);
  if (!current || current.id === mouse.id) return 86;
  const r = profile.relative;
  const desiredLength = current.specs.lengthMm + r.sizeDelta * 4;
  const desiredWidth = (current.specs.gripWidthMm ?? current.specs.widthMm) + r.widthDelta * 2.5;
  const desiredHeight = current.specs.heightMm + r.humpDelta * 2;
  const desiredWeight = current.specs.weightG + r.weightDelta * 7;
  const desiredPalm = (current.fit.palmSupport ?? 60) + r.palmSupportDelta * 12;
  return (
    target(mouse.specs.lengthMm, desiredLength, 3.2) * .22 +
    target(mouse.specs.gripWidthMm ?? mouse.specs.widthMm, desiredWidth, 4) * .22 +
    target(mouse.specs.heightMm, desiredHeight, 5) * .18 +
    target(mouse.specs.weightG, desiredWeight, 3.2) * .2 +
    target(mouse.fit.palmSupport ?? 60, desiredPalm, 1.8) * .18
  );
}

export function recommendMice(profile: UserProfile): Recommendation<MouseProduct>[] {
  return mice.map((mouse) => {
    const reasons: string[] = [];
    const cautions: string[] = [];
    const hand = proximity(profile.handLengthCm, ...mouse.fit.handLengthCm) * .65 + proximity(profile.handWidthCm, ...mouse.fit.handWidthCm) * .35;
    const grip = mouse.fit.grip[profile.grip] ?? 58;
    const aim = mouse.fit.aimStyle[profile.aimStyle] ?? 78;
    const game = gameScore(mouse, profile.gameStyle);
    const weightTarget = profile.weightPreference === "ultralight" ? 40 : profile.weightPreference === "light" ? 52 : profile.weightPreference === "medium" ? 68 : profile.weightPreference === "heavy" ? 100 : mouse.specs.weightG;
    const weight = profile.weightPreference === "any" ? 90 : target(mouse.specs.weightG, weightTarget, profile.gameStyle === "mmo" ? 1.4 : 3.7);
    const shape = profile.shapePreference === "any" || profile.shapePreference === mouse.specs.shape ? 100 : 35;
    const budget = mouse.msrpUsd && mouse.msrpUsd > profile.budgetUsd ? clamp(100 - (mouse.msrpUsd - profile.budgetUsd) * 2) : 100;
    const gripWidth = mouse.specs.gripWidthMm ?? mouse.specs.widthMm;
    const fingerLayout = profile.fingerLayout.startsWith("1-3-1") ? clamp(58 + (gripWidth - 52) * 4 + (mouse.geometry?.pinkyClearance ?? 55) * .14) : 92;
    const moisture = profile.handMoisture === "dry" ? mouse.fit.coatingDry : profile.handMoisture === "sweaty" ? mouse.fit.coatingSweaty : (mouse.fit.coatingDry + mouse.fit.coatingSweaty) / 2;
    const buttons = buttonFit(mouse, profile);
    const clicks = clickFit(mouse, profile);
    const wheel = wheelFit(mouse, profile);
    const polling = highPollingValue(mouse, profile);
    const relative = relativeFit(mouse, profile);

    const fpsLike = ["tactical-fps", "tracking-fps", "arena-fps", "battle-royale"].includes(profile.gameStyle);
    const mmoLike = profile.gameStyle === "mmo";
    const weights = mmoLike
      ? { hand:.16, grip:.13, aim:.03, game:.14, weight:.03, shape:.05, budget:.06, finger:.03, moisture:.06, buttons:.19, clicks:.04, wheel:.06, polling:.01, relative:.01 }
      : fpsLike
        ? { hand:.18, grip:.21, aim:.08, game:.10, weight:.10, shape:.06, budget:.04, finger:.04, moisture:.05, buttons:.02, clicks:.04, wheel:.01, polling:.03, relative:.04 }
        : { hand:.16, grip:.16, aim:.05, game:.12, weight:.05, shape:.05, budget:.05, finger:.03, moisture:.06, buttons:.10, clicks:.06, wheel:.04, polling:.02, relative:.05 };

    const score =
      hand*weights.hand + grip*weights.grip + aim*weights.aim + game*weights.game + weight*weights.weight +
      shape*weights.shape + budget*weights.budget + fingerLayout*weights.finger + moisture*weights.moisture +
      buttons*weights.buttons + clicks*weights.clicks + wheel*weights.wheel + polling*weights.polling + relative*weights.relative;

    if (hand >= 88) reasons.push(`Strong dimensional match for ${profile.handLengthCm.toFixed(1)} × ${profile.handWidthCm.toFixed(1)} cm hands.`);
    if (grip >= 88) reasons.push(`Shape profile strongly supports ${profile.grip.replaceAll("-", " ")} grip.`);
    if (game >= 90) reasons.push(`Feature/shape model is highly aligned with ${profile.gameStyle.replaceAll("-", " ")}.`);
    if (mouse.specs.weightG <= 45 && fpsLike) reasons.push(`${mouse.specs.weightG} g mass favors low-inertia corrections and rapid repositioning.`);
    if (profile.gameStyle === "mmo" && (mouse.specs.programmableButtons ?? 0) >= 12) reasons.push(`${mouse.specs.programmableButtons} programmable inputs strongly suit MMO binding density.`);
    if (profile.fingerLayout.startsWith("1-3-1") && fingerLayout >= 82) reasons.push("Top width and ring/pinky clearance are relatively accommodating for 1-3-1 placement.");
    if (profile.relative.currentMouseId && relative >= 86) reasons.push("Moves in the direction you requested relative to your current mouse.");
    if (profile.handMoisture === "sweaty" && mouse.fit.coatingSweaty >= 86) reasons.push("Coating evidence/model is favorable for sweaty-hand grip.");

    if (hand < 68) cautions.push("Hand-size fit sits outside this mouse's preferred band.");
    if (shape < 50) cautions.push(`You asked for ${profile.shapePreference}; this is ${mouse.specs.shape}.`);
    if (mouse.msrpUsd && mouse.msrpUsd > profile.budgetUsd) cautions.push(`MSRP exceeds your $${profile.budgetUsd} budget.`);
    if (profile.gameStyle === "moba-rts" && mouse.fit.clickLightness < 65) cautions.push("Main click feel may be less ideal for high-frequency repeated inputs.");
    if (profile.gameStyle === "mmo" && (mouse.specs.programmableButtons ?? 5) < 8) cautions.push("Low button count limits MMO hotkey density.");
    if (profile.wheelPreference === "free-spin" && !mouse.specs.freeSpinWheel) cautions.push("No free-spin wheel mode.");
    if (mouse.specs.maxPollingHz >= 8000 && (profile.cpuTier === "entry" || profile.displayHz < 165)) cautions.push("8 kHz support is present, but your system/display profile may see little practical benefit versus a lower polling setting.");

    return {
      product: mouse,
      score: Math.round(score),
      reasons,
      cautions,
      breakdown: { hand:Math.round(hand), grip:Math.round(grip), game:Math.round(game), weight:Math.round(weight), controls:Math.round((buttons+clicks+wheel)/3), relative:Math.round(relative) }
    };
  }).sort((a, b) => b.score - a.score);
}

export function recommendPads(profile: UserProfile): Recommendation<MousepadProduct>[] {
  return mousepads.map((pad) => {
    const reasons: string[] = [];
    const cautions: string[] = [];
    const speed = pad.feel.staticSpeed * .55 + pad.feel.dynamicSpeed * .45;
    const gameAdjust = profile.gameStyle === "tactical-fps" ? -6 : profile.gameStyle === "tracking-fps" || profile.gameStyle === "arena-fps" ? 7 : 0;
    const requested = clamp(profile.padSpeed + gameAdjust);
    const speedFit = clamp(100 - Math.abs(speed - requested) * 1.7);
    const textureFit = clamp(100 - Math.max(0, pad.feel.texture - profile.textureTolerance) * 2);
    const humidityFit = profile.climate === "humid" ? pad.feel.humidityResistance : 92;
    const sleeveFit = profile.sleeve ? pad.feel.sleeveCompatibility : 90;
    const pressureTarget = profile.pressureHabit === "heavy" ? 82 : profile.pressureHabit === "variable" ? 62 : 30;
    const pressureFit = clamp(100 - Math.abs(pad.feel.pressureResponse - pressureTarget));
    const stability = pad.feel.wornZoneStability ?? 78;
    const score = speedFit*.31 + textureFit*.14 + humidityFit*.12 + sleeveFit*.08 + pressureFit*.14 + pad.feel.xyConsistency*.11 + stability*.10;

    if (speedFit >= 85) reasons.push("Initial and dynamic glide sit close to the requested/game-adjusted speed zone.");
    if (profile.gameStyle === "tactical-fps" && pad.feel.stoppingPower >= 72) reasons.push("Higher stopping-power profile complements tactical FPS micro-correction and braking needs.");
    if ((profile.gameStyle === "tracking-fps" || profile.gameStyle === "arena-fps") && pad.feel.dynamicSpeed >= 70) reasons.push("Faster continued glide supports long tracking motions.");
    if (profile.climate === "humid" && pad.feel.humidityResistance >= 85) reasons.push("High humidity-resistance profile.");
    if (profile.pressureHabit !== "light" && pad.feel.pressureResponse >= 65) reasons.push("Base softness can convert downward pressure into additional stopping power.");
    if (profile.sleeve && pad.feel.sleeveCompatibility >= 85) reasons.push("Strong sleeve compatibility in the current evidence model.");
    if (profile.sleeve && pad.feel.sleeveCompatibility < 65) cautions.push("Sleeve drag may be noticeable.");
    if (profile.pressureHabit === "heavy" && pad.specs.firmness === "hard") cautions.push("Hard surface provides almost no pressure-based braking.");
    if (pad.specs.surfaceClass === "glass") cautions.push("Glide depends heavily on skate material, dust, pressure, and wear state.");

    return { product: pad, score: Math.round(score), reasons, cautions, breakdown:{ speed:Math.round(speedFit), texture:Math.round(textureFit), climate:Math.round(humidityFit), pressure:Math.round(pressureFit) } };
  }).sort((a, b) => b.score - a.score);
}

export function recommendSkates(pad: MousepadProduct, profile: UserProfile): Recommendation<SkateProduct>[] {
  return skates.map((skate) => {
    const surface = pad.specs.surfaceClass;
    const compatible = surface === "cloth" ? skate.compatibility.cloth : surface === "glass" ? skate.compatibility.glass : surface === "hybrid" ? skate.compatibility.hybrid : skate.compatibility.plastic;
    const targetSpeed = profile.padSpeed;
    const speed = skate.feel.brokenInSpeed ?? skate.feel.speed;
    const durabilityBoost = surface === "glass" ? skate.feel.durability * .22 : skate.feel.durability * .08;
    const score = compatible ? clamp(100 - Math.abs(speed - targetSpeed) * .65) * .78 + durabilityBoost : 5;
    const reasons = compatible ? [`Compatible with ${surface} surfaces.`, `Broken-in speed model is ${speed}/100; durability ${skate.feel.durability}/100.`] : [];
    const cautions = compatible ? [] : [`Current compatibility evidence does not recommend ${surface} use.`];
    if (pad.specs.firmness === "xsoft" && skate.specs.format === "dots") cautions.push("Dot skates on very soft foam can sink more under pressure; dot count and placement matter.");
    if (surface === "glass" && skate.specs.material === "pure-ptfe" && (skate.feel.wearRate ?? 65) > 60) cautions.push("Pure PTFE can wear quickly on glass; fresh and broken-in glide may differ noticeably.");
    if (surface === "glass" && skate.specs.material === "glass") cautions.push("Avoid glass-on-glass contact.");
    return { product: skate, score: Math.round(score), reasons, cautions };
  }).sort((a, b) => b.score - a.score);
}
