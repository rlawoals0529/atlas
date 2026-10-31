import { useState } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "./useModalDialog";
import "./atlas-jump.css";

const destinations = [
  { href: "#", name: "Browse gear", note: "Catalog · mice, pads, skates, boards and switches" },
  { href: "#pointing", name: "Setup finder & Shape Lab", note: "Fit, outlines and surface pairing" },
  { href: "#mousepads", name: "Mousepads", note: "Materials, glide and stopping context" },
  { href: "#keyboards", name: "Keyboards", note: "Complete board records" },
  { href: "#keyboard-lab", name: "Keyboard Lab", note: "Platform and actuation research" },
  { href: "#switches", name: "Switches & ThereminGoat scores", note: "Canonical specs and attributed score sheets" },
  { href: "#sensitivity", name: "Sensitivity & Drift curves", note: "Convert, match distance and preview acceleration" },
  { href: "#product-lab", name: "Research & provenance", note: "Evidence, data coverage and validation" },
];
export default function AtlasJump({ onClose }: { onClose: () => void }) {
  const ref = useModalDialog<HTMLElement>(onClose);
  const [query, setQuery] = useState("");
  const results = destinations.filter(item => `${item.name} ${item.note}`.toLowerCase().includes(query.trim().toLowerCase()));
  return createPortal(<div className="atlas-jump-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="atlas-jump" ref={ref} role="dialog" aria-modal="true" aria-labelledby="atlas-jump-title" tabIndex={-1}>
    <header><div><span>ATLAS / QUICK NAVIGATION</span><h2 id="atlas-jump-title">Where are we going?</h2></div><button type="button" onClick={onClose} aria-label="Close quick navigation">Esc</button></header>
    <label><span>Find a workspace</span><input data-dialog-initial-focus value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Drift, shapes or switches" onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); ref.current?.querySelector<HTMLAnchorElement>(".atlas-jump-results a")?.focus(); } }}/></label>
    <nav className="atlas-jump-results" aria-label="Matching workspaces">{results.map(item => <a href={item.href} key={item.href} onClick={onClose}><b>{item.name}</b><span>{item.note}</span></a>)}</nav>
    {!results.length && <p className="atlas-jump-empty" role="status">No workspace matches. Try a tool or category name.</p>}
    <footer>Arrow down to results · Tab to move · Enter to open · Esc to close</footer>
  </section></div>, document.body);
}
