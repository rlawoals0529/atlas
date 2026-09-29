import fs from "node:fs";

const path = "src/react-app/App.tsx";
let source = fs.readFileSync(path, "utf8");

const replaceOnce = (from, to, label) => {
  if (!source.includes(from)) throw new Error(`Missing patch target: ${label}`);
  source = source.replace(from, to);
};

replaceOnce(
  'import { alignmentOffset, findSimilarShapes, outlineFor, type AlignMode, type ShapeView } from "../shared/shape";',
  'import { alignmentOffset, findSimilarShapes, outlineFor, type AlignMode, type ShapeView, type SimilarityMode } from "../shared/shape";',
  "shape import",
);

replaceOnce(
  '  const [similarBaseId, setSimilarBaseId] = useState(mice[0]?.id ?? "");',
  '  const [similarBaseId, setSimilarBaseId] = useState(mice[0]?.id ?? "");\n  const [similarityMode, setSimilarityMode] = useState<SimilarityMode>("balanced");',
  "similarity mode state",
);

replaceOnce(
  '  const similarShapes = useMemo(() => similarBase ? findSimilarShapes(similarBase,mice) : [], [similarBase]);',
  '  const similarShapes = useMemo(() => similarBase ? findSimilarShapes(similarBase,mice,similarityMode) : [], [similarBase,similarityMode]);',
  "similarity memo",
);

replaceOnce(
  '<div className="panel similar-panel"><div className="section-head"><div><span>03</span><h2>Find similar</h2></div><small>8-axis geometry</small></div>\n            <label className="similar-base">Reference mouse<select value={similarBaseId} onChange={e=>setSimilarBaseId(e.target.value)}>{mice.map(m=><option value={m.id} key={m.id}>{m.brand} {m.model}</option>)}</select></label>',
  '<div className="panel similar-panel"><div className="section-head"><div><span>03</span><h2>Find similar</h2></div><small>12-axis / grip-aware</small></div>\n            <div className="similar-toolbar"><label className="similar-base">Reference mouse<select value={similarBaseId} onChange={e=>setSimilarBaseId(e.target.value)}>{mice.map(m=><option value={m.id} key={m.id}>{m.brand} {m.model}</option>)}</select></label><label className="similar-base">Similarity mode<select value={similarityMode} onChange={e=>setSimilarityMode(e.target.value as SimilarityMode)}><option value="balanced">Balanced geometry</option><option value="claw">Claw contact</option><option value="fingertip">Fingertip control</option><option value="palm">Palm fill</option></select></label></div>',
  "similar toolbar",
);

replaceOnce(
  '<p>{r.reasons.slice(0,2).join(" · ") || "Close composite geometry"}</p><small>{r.differences.slice(0,2).join(" · ")}</small></div><div className="shape-score"><b>{r.score}</b><span>SHAPE</span></div>',
  '<p>{r.reasons.slice(0,2).join(" · ") || "Close composite geometry"}</p><small>{r.differences.slice(0,2).join(" · ")}</small><div className="similar-metrics">{(["gripWidth","humpPosition","height","frontHeight"] as const).map(k=><span key={k} title={`${k}: ${Math.round(r.components[k])}/100`}><i style={{width:`${r.components[k]}%`}}/></span>)}</div></div><div className="shape-score"><b>{r.score}</b><span>{similarityMode.toUpperCase()}</span></div>',
  "similar metric bars",
);

replaceOnce(
  '<div className="shape-note"><b>Current outlines are Atlas-parametric.</b> They are derived from our own dimensions, hump, flare and curvature fields, not copied from another comparison site. The schema can later accept measured SVG outlines or 3D scans with provenance.</div>',
  '<div className="shape-note"><b>Current outlines are Atlas-parametric.</b> They are derived from our own dimensions, hump, flare and curvature fields, not copied from another comparison site. Similarity can be weighted for claw, fingertip, or palm contact. The schema can later accept measured SVG outlines or 3D scans with provenance.</div>',
  "shape note",
);

replaceOnce(
  '<footer><span>INPUT ATLAS / gaming research build v0.3</span><span>{catalog.length} canonical products</span><span>Cloudflare Workers + D1</span></footer>',
  '<footer><span>INPUT ATLAS / gaming research build v0.4</span><span>{catalog.length} canonical products</span><span>Cloudflare Workers + D1</span></footer>',
  "footer version",
);

fs.writeFileSync(path, source);

const cssPath = "src/react-app/v04.css";
let css = fs.readFileSync(cssPath, "utf8");
css += `\n\n/* grip-aware similarity controls */\n.similar-toolbar{display:grid;grid-template-columns:1.45fr .85fr;gap:10px;margin-bottom:12px}.similar-toolbar .similar-base{margin:0}.similar-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:8px;max-width:260px}.similar-metrics span{height:3px;border-radius:99px;background:#1e252d;overflow:hidden}.similar-metrics i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--atlas-violet),var(--atlas-cyan))}.similar-row .shape-score span{max-width:72px;overflow:hidden;text-overflow:ellipsis}.similar-row .shape-score b{font-variant-numeric:tabular-nums}@media(max-width:760px){.similar-toolbar{grid-template-columns:1fr}}\n`;
fs.writeFileSync(cssPath, css);

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.version = "0.4.0";
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
