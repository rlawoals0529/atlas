import { useEffect } from "react";
import { catalog } from "../shared/catalog";
import { trackAtlasEvent } from "../shared/analytics";

const productFromCard = (target: Element) => {
  const card = target.closest(".v5-product-card");
  if (!card) return null;
  const brand = card.querySelector(".v5-eyebrow")?.textContent?.trim() ?? "";
  const model = card.querySelector("h3")?.textContent?.trim() ?? "";
  return catalog.find(product => product.brand === brand && product.model === model) ?? null;
};

const productType = (type: string): "mouse" | "mousepad" | "skate" => type === "mousepad" ? "mousepad" : type === "skate" ? "skate" : "mouse";
const navLabel = (target: Element) => target.closest("button")?.textContent?.replace(/\d+/g, "").trim().toLowerCase() ?? "";
const isNonFitSurface = (target: Element) => Boolean(target.closest(".v5-database") || target.closest(".v5-compare") || target.closest(".v5-shape-lab") || target.closest(".v5-overlay"));
const cleanStep = (target: HTMLInputElement | HTMLSelectElement) => (target.name || target.id || target.type || "profile-control").replace(/[^a-zA-Z0-9_.:-]/g, "-").slice(0, 64);

export default function AnalyticsBridge() {
  useEffect(() => {
    const recommendationStartedKey = "atlas.analytics.recommendation-started.v2";
    const recommendationCompletedKey = "atlas.analytics.recommendation-completed.v2";
    const recommendationAbandonedKey = "atlas.analytics.recommendation-abandoned.v2";
    const recommendationStepsKey = "atlas.analytics.recommendation-steps.v2";

    const completedSteps = () => {
      try { return JSON.parse(sessionStorage.getItem(recommendationStepsKey) ?? "[]") as string[]; } catch { return []; }
    };

    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const product = productFromCard(target);
      if (product) {
        const resultArticle = target.closest(".v5-result");
        const sourceSurface = resultArticle ? "recommendation" : target.closest(".v5-database") ? "catalog" : "atlas";
        trackAtlasEvent("product_viewed", { productId: product.id, productType: productType(product.type), sourceSurface });
        if (resultArticle) {
          const rankText = resultArticle.querySelector(".v5-rank")?.textContent?.trim();
          const fitText = resultArticle.querySelector(".v5-fit-badge b")?.textContent?.trim();
          trackAtlasEvent("recommendation_result_selected", {
            productId: product.id,
            rank: rankText ? Number(rankText) || undefined : undefined,
            fitScore: fitText ? Number(fitText) || undefined : undefined,
          });
        }
        return;
      }

      const similar = target.closest(".v5-similar-list button");
      if (similar) {
        const label = similar.querySelector("h3")?.textContent?.trim() ?? similar.textContent?.trim() ?? "";
        const reference = catalog.find(item => label.includes(item.model));
        if (reference?.type === "mouse") trackAtlasEvent("similarity_search_used", { referenceProductId: reference.id, mode: "balanced" });
      }

      const label = navLabel(target);
      if (label.includes("shape lab")) trackAtlasEvent("shape_lab_used", { action: "opened" });
      if (label.includes("compare")) trackAtlasEvent("comparison_started", { productIds: [] });

      const external = target.closest("a[target='_blank']") as HTMLAnchorElement | null;
      if (external) {
        const inspector = external.closest(".v5-inspector");
        const brand = inspector?.querySelector(".v5-eyebrow")?.textContent?.split("/")[0]?.trim() ?? "";
        const model = inspector?.querySelector("h2")?.textContent?.trim() ?? "";
        const selected = catalog.find(item => item.brand === brand && item.model === model);
        if (selected) trackAtlasEvent("outbound_product_clicked", { productId: selected.id, destinationKind: "source" });
      }
    };

    const change = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
      const main = target.closest("main");
      if (!main) return;

      if (target instanceof HTMLInputElement && (target.type === "search" || /search/i.test(target.placeholder))) {
        trackAtlasEvent("search_performed", { queryLength: target.value.length, surface: target.closest(".v5-database") ? "catalog" : "global" });
      }

      if (target.closest(".v5-database") || target.closest(".v5-filters")) {
        trackAtlasEvent("filters_changed", { surface: "catalog", filterNames: [target.name || target.getAttribute("aria-label") || target.type || "filter"], activeFilterCount: 1 });
      }

      if (target.closest(".v5-shape-lab") || target.closest(".v5-overlay")) {
        if (target instanceof HTMLSelectElement || target.type === "range") {
          const productIds = [...main.querySelectorAll(".v5-shape-lab select, .v5-overlay select")].map(select => (select as HTMLSelectElement).value).filter(value => catalog.some(product => product.id === value));
          trackAtlasEvent("shape_overlay_changed", {
            view: /side/i.test(target.name || target.id || "") ? "side" : /top/i.test(target.name || target.id || "") ? "top" : "unknown",
            activeProductIds: [...new Set(productIds)].slice(0, 8),
            opacityPct: target instanceof HTMLInputElement && target.type === "range" ? Math.max(0, Math.min(100, Number(target.value))) : undefined,
          });
        } else {
          trackAtlasEvent("shape_lab_used", { action: "alignment_changed" });
        }
      }

      if (target.closest(".v5-compare")) {
        const ids = [...main.querySelectorAll(".v5-compare select")].map(select => (select as HTMLSelectElement).value).filter(value => catalog.some(product => product.id === value));
        const unique = [...new Set(ids)];
        if (unique.length >= 2) trackAtlasEvent("comparison_completed", { productIds: unique, comparedCount: unique.length });
      }

      if (!isNonFitSurface(target)) {
        if (!sessionStorage.getItem(recommendationStartedKey)) {
          const started = trackAtlasEvent("recommendation_started", { entrySurface: "fit" });
          if (started) sessionStorage.setItem(recommendationStartedKey, "1");
        }

        const step = cleanStep(target);
        const existing = completedSteps();
        if (!existing.includes(step)) {
          const recorded = trackAtlasEvent("recommendation_step_completed", { step, stepIndex: existing.length + 1 });
          if (recorded) sessionStorage.setItem(recommendationStepsKey, JSON.stringify([...existing, step]));
        }

        queueMicrotask(() => {
          if (sessionStorage.getItem(recommendationCompletedKey)) return;
          const resultCount = document.querySelectorAll(".v5-results .v5-result").length;
          if (!resultCount) return;
          const completed = trackAtlasEvent("recommendation_completed", { resultCount, relativeMode: Boolean(document.querySelector(".v5-relative")) });
          if (completed) sessionStorage.setItem(recommendationCompletedKey, "1");
        });
      }
    };

    const pagehide = () => {
      if (!sessionStorage.getItem(recommendationStartedKey) || sessionStorage.getItem(recommendationCompletedKey) || sessionStorage.getItem(recommendationAbandonedKey)) return;
      const steps = completedSteps();
      const abandoned = trackAtlasEvent("recommendation_abandoned", { lastStep: steps.at(-1), completedSteps: steps.length, reason: "pagehide" });
      if (abandoned) sessionStorage.setItem(recommendationAbandonedKey, "1");
    };

    document.addEventListener("click", click, true);
    document.addEventListener("change", change, true);
    window.addEventListener("pagehide", pagehide);
    return () => {
      document.removeEventListener("click", click, true);
      document.removeEventListener("change", change, true);
      window.removeEventListener("pagehide", pagehide);
    };
  }, []);

  return null;
}
