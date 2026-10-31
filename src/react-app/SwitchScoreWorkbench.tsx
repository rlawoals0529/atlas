import { useMemo, useState } from "react";
import data from "../shared/thereminGoatScores.json";
import "./workbench.css";

type Lens = keyof typeof data.sheets;
const lenses: Record<Lens, { title: string; max: number; description: string }> = {
  overall: { title: "Overall", max: 100, description: "The complete score: performance, context and other factors." },
  hard: { title: "Hard", max: 70, description: "Push feel, wobble and sound. These are reviewer assessments, not lab measurements." },
  soft: { title: "Soft", max: 30, description: "Context and other factors, including price, availability and distinctiveness." },
};
const sheetUrl = (lens: Lens) => `https://github.com/ThereminGoat/switch-scores/blob/${data.commit}/1-Composite%20${lens[0].toUpperCase() + lens.slice(1)}%20Total%20Score%20Sheet.csv`;
const methodology = "https://www.theremingoat.com/shorts/a-scorecard-time-change";

export default function SwitchScoreWorkbench() {
  const [lens, setLens] = useState<Lens>("overall");
  const [weighted, setWeighted] = useState(true);
  const [query, setQuery] = useState("");
  const [feel, setFeel] = useState("all");
  const [selected, setSelected] = useState("");
  const [page, setPage] = useState(0);
  const meta = lenses[lens];
  const useWeighted = weighted && lens !== "hard";
  const score = (row: { weighted: number | null; timeless: number }) => useWeighted ? row.weighted ?? row.timeless : row.timeless;
  const rows = useMemo(() => data.sheets[lens].filter(row => (!query.trim() || `${row.name} ${row.manufacturer}`.toLowerCase().includes(query.trim().toLowerCase())) && (feel === "all" || row.type === feel))
    .sort((a, b) => (useWeighted ? b.weighted ?? b.timeless : b.timeless) - (useWeighted ? a.weighted ?? a.timeless : a.timeless) || a.name.localeCompare(b.name)), [lens, query, feel, useWeighted]);
  const active = rows.find(row => `${row.name}::${row.date}` === selected) ?? rows[0];
  const pageCount = Math.max(1, Math.ceil(rows.length / 12));
  const currentPage = Math.min(page, pageCount - 1);
  const related = active ? (Object.keys(lenses) as Lens[]).map(key => ({ key, row: data.sheets[key].find(row => row.name === active.name && row.date === active.date) })) : [];
  return <section className="score-workbench" aria-labelledby="score-workbench-heading">
    <header className="workbench-heading"><div><span className="desk-eyebrow">THE REVIEWER'S DESK / 01</span><h2 id="score-workbench-heading">One switch. Three perspectives.</h2><p>Explore ThereminGoat’s score sheets. His assessments stay separate from Atlas specifications.</p></div><a href="https://www.theremingoat.com/" target="_blank" rel="noreferrer">By ThereminGoat</a></header>
    <div className="score-lenses" role="group" aria-label="Score sheet">
      {(Object.keys(lenses) as Lens[]).map((key, index) => <button type="button" key={key} aria-pressed={lens === key} data-lens={key} onClick={() => { setLens(key); setPage(0); }}><span>0{index + 1} / {lenses[key].max} POINTS</span><strong>{lenses[key].title}</strong><small>{lenses[key].description}</small><span className="lens-state">{lens === key ? "Viewing sheet" : "Explore sheet"}</span></button>)}
    </div>
    <div className="score-desk" data-lens={lens}>
      <div className="score-browser">
        <div className="score-controls"><label>Find a switch<input value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Name or manufacturer"/></label><label>Feel<select value={feel} onChange={event => { setFeel(event.target.value); setPage(0); }}><option value="all">All types</option>{[...new Set(data.sheets.overall.map(row => row.type))].sort().map(type => <option key={type}>{type}</option>)}</select></label></div>
        <div className="score-basis" role="group" aria-label="Score basis"><button type="button" aria-pressed={useWeighted} disabled={lens === "hard"} onClick={() => { setWeighted(true); setPage(0); }}>Time weighted</button><button type="button" aria-pressed={!useWeighted} onClick={() => { setWeighted(false); setPage(0); }}>Timeless</button><span role="status">{rows.length} matching rows</span></div>
        <p className="score-caption">{meta.title} / {useWeighted ? "time weighted" : "timeless"} · highest first · out of {meta.max}</p>
        <div className="score-list" role="group" aria-label="Scored switches">
          {rows.slice(currentPage * 12, currentPage * 12 + 12).map(row => <button type="button" className="score-row" key={`${row.name}::${row.date}`} aria-pressed={active?.name === row.name && active?.date === row.date} onClick={() => setSelected(`${row.name}::${row.date}`)}><span className="score-source-rank" title="Rank in original source sheet">#{row.rank}</span><span><b>{row.name}</b><small>{row.manufacturer} · {row.type}</small></span><strong>{score(row).toFixed(useWeighted ? 1 : 0)}</strong></button>)}
          {!rows.length && <p className="score-empty">No matching score rows. <button type="button" onClick={() => { setQuery(""); setFeel("all"); setPage(0); }}>Clear score filters</button></p>}
        </div>
        <div className="score-pagination"><button type="button" disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>Previous</button><span>{currentPage + 1} / {pageCount}</span><button type="button" disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>Next</button></div>
      </div>
      <aside className="score-inspector" aria-label="Selected switch scores" aria-live="polite">
        {active ? <><span className="desk-eyebrow">ON THE DESK</span><h3>{active.name}</h3><p>{active.manufacturer} / {active.type}</p><div className="score-big" key={`${lens}-${active.name}-${useWeighted}`}><strong>{score(active).toFixed(useWeighted ? 1 : 0)}</strong><span>/ {meta.max}<small>{useWeighted ? "Time weighted" : "Timeless"} {meta.title.toLowerCase()}</small></span></div><div className="score-crossread">{related.map(({ key, row }) => <div key={key}><span>{lenses[key].title}</span><b>{row ? (weighted && key !== "hard" ? row.weighted ?? row.timeless : row.timeless).toFixed(weighted && key !== "hard" ? 1 : 0) : "Not in sheet"}<small> / {lenses[key].max}</small></b></div>)}</div><p className="score-caption">Scored {active.date}. Source ranks are from each sheet’s original ranking; filtering does not change them.</p><a className="desk-primary" href={sheetUrl(lens)} target="_blank" rel="noreferrer">Open {meta.title.toLowerCase()} source sheet</a></> : <p>Select a switch after clearing the filters.</p>}
        <p className="score-caption">Cross-sheet values: {weighted ? "time-weighted Overall and Soft; timeless Hard" : "timeless on all three scales"}.</p>
        <details><summary>How to read these scores</summary><p>Hard uses a 70-point scale; Soft uses 30; Overall uses 100. Overall and Soft time-weighted values include the reviewer’s age adjustment. Hard has no time-weighted column. Atlas preserves the CSV values and does not recalculate decay.</p><p>These are one reviewer’s opinions. A high score does not establish compatibility or suit every preference. Re-scored entries remain separate by scoring date.</p><a href={methodology} target="_blank" rel="noreferrer">Read ThereminGoat’s methodology</a></details>
      </aside>
    </div>
    <footer className="score-provenance">474 rows per sheet · sheet header: Oct 24, 2026 · retrieved Oct 30, 2026 · frozen source snapshot <a href={`https://github.com/ThereminGoat/switch-scores/tree/${data.commit}`} target="_blank" rel="noreferrer">{data.commit.slice(0, 7)}</a>. The older scorecard-link directory below has a separate snapshot date.</footer>
  </section>;
}
