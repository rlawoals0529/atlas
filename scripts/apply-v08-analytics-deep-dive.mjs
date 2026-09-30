import fs from "node:fs";

const path = "src/react-app/ProductLab.tsx";
let source = fs.readFileSync(path, "utf8");

function replaceOnce(before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing ${label} anchor`);
  source = source.replace(before, after);
}

replaceOnce(
  'import ProductIntelligenceExtras from "./ProductIntelligenceExtras";\n',
  'import ProductIntelligenceExtras from "./ProductIntelligenceExtras";\nimport AnalyticsDeepDive from "./AnalyticsDeepDive";\n',
  "AnalyticsDeepDive import",
);

replaceOnce(
  '  const summary = useMemo<AnalyticsSummary>(() => {\n    void revision;\n    return summarizeAnalytics(mode === "demo" ? DEMO_ANALYTICS_EVENTS : localAnalyticsEvents(), mode);\n  }, [mode, revision]);',
  '  const events = useMemo(() => {\n    void revision;\n    return mode === "demo" ? DEMO_ANALYTICS_EVENTS : localAnalyticsEvents();\n  }, [mode, revision]);\n  const summary = useMemo<AnalyticsSummary>(() => summarizeAnalytics(events, mode), [events, mode]);',
  "analytics event source",
);

replaceOnce(
  '    </div>\n\n    <section className="pl-integrity-note"><b>Privacy boundary</b>',
  '    </div>\n\n    <AnalyticsDeepDive events={events}/>\n\n    <section className="pl-integrity-note"><b>Privacy boundary</b>',
  "analytics deep dive placement",
);

fs.writeFileSync(path, source);
console.log("Applied Atlas v0.8 analytics deep-dive patch.");
