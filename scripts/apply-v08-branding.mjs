import fs from "node:fs";

const path = "src/react-app/AppV05.tsx";
let source = fs.readFileSync(path, "utf8");

const replacements = [
  ['const VERSION = "0.5";', 'const VERSION = "0.8";'],
  ['<button className="v5-brand" onClick={() => setActive("fit")}><LogoMark/><span>INPUT <b>ATLAS</b></span><small>v{VERSION}</small></button>', '<button className="v5-brand" onClick={() => setActive("fit")}><LogoMark/><span><b>ATLAS</b></span><small>v{VERSION}</small></button>'],
  ['<nav>{([[\'fit\', \'Find your setup\'], [\'lab\', \'Shape lab\'], [\'catalog\', \'Database\'], [\'compare\', \'Compare\'], [\'method\', \'Method\']] as const).map(([id, label]) => <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}{id === "catalog" && <span>{catalog.length}</span>}</button>)}</nav>', '<nav>{([[\'fit\', \'Find your setup\'], [\'lab\', \'Shape lab\'], [\'catalog\', \'Database\'], [\'compare\', \'Compare\'], [\'method\', \'Method\']] as const).map(([id, label]) => <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}{id === "catalog" && <span>{catalog.length}</span>}</button>)}<a className="v5-product-lab-nav" href="#product-lab">Product lab</a></nav>'],
];

for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error(`Expected source anchor was not found: ${before.slice(0, 90)}`);
  source = source.replace(before, after);
}

fs.writeFileSync(path, source);
console.log("Applied Atlas v0.8 consumer branding/navigation patch.");
