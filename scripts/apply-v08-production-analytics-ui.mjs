import fs from "node:fs";
const path = "src/react-app/ProductLab.tsx";
let source = fs.readFileSync(path, "utf8");
const replaceOnce = (before, after, label) => {
  if (!source.includes(before)) throw new Error(`Missing ${label} anchor`);
  source = source.replace(before, after);
};
replaceOnce(
  'import AnalyticsDeepDive from "./AnalyticsDeepDive";\n',
  'import AnalyticsDeepDive from "./AnalyticsDeepDive";\nimport ProductionAnalyticsStatus from "./ProductionAnalyticsStatus";\n',
  "ProductionAnalyticsStatus import",
);
replaceOnce(
  '    </section>\n\n    <section className="pl-metrics">',
  '    </section>\n\n    <ProductionAnalyticsStatus/>\n\n    <section className="pl-metrics">',
  "production analytics placement",
);
fs.writeFileSync(path, source);
console.log("Applied Atlas production analytics status patch.");
