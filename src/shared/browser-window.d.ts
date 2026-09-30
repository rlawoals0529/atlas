// Shared modules are compiled for both the browser and Cloudflare Worker targets.
// `analytics.ts` only touches window behind `typeof window !== "undefined"` guards,
// but the Worker lib set intentionally does not declare the browser global.
// This minimal ambient declaration keeps that guard type-safe without adding DOM
// APIs to the Worker runtime or changing runtime behavior.
interface Window extends EventTarget {}
declare var window: Window & typeof globalThis;
