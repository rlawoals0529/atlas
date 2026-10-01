import { useMemo, useState } from "react";
import { THEREMINGOAT_SWITCH_REVIEW_COUNT, THEREMINGOAT_SWITCH_SOURCE, thereminGoatSwitchReviews } from "../shared/thereminGoatSwitchReviews";

const typeOrder = ["Linear", "Tactile", "Clicky", "Silent Linear", "Silent Tactile"];

function prettyDate(value: string) {
  const [month, day, year] = value.split("/").map(Number);
  if (!month || !day || !year) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}

export default function SwitchReviewIndex() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [manufacturer, setManufacturer] = useState("all");

  const manufacturers = useMemo(() => [...new Set(thereminGoatSwitchReviews.map(entry => entry.manufacturer))].sort((a, b) => a.localeCompare(b)), []);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return thereminGoatSwitchReviews.filter(entry => {
      if (type !== "all" && entry.type !== type) return false;
      if (manufacturer !== "all" && entry.manufacturer !== manufacturer) return false;
      if (!needle) return true;
      return `${entry.name} ${entry.manufacturer} ${entry.type}`.toLowerCase().includes(needle);
    });
  }, [query, type, manufacturer]);

  return <section className="switch-review-index" aria-labelledby="switch-review-index-title">
    <div className="switch-review-index-head">
      <div>
        <span>External review directory</span>
        <h2 id="switch-review-index-title">ThereminGoat switch scorecards</h2>
        <p>Atlas lists the switch names and review metadata from the public composite sheet without republishing its score columns. These are ThereminGoat reviews, not Atlas ratings or product-spec records.</p>
      </div>
      <div className="switch-review-index-stat"><b>{thereminGoatSwitchReviews.length}</b><span>unique switches</span><small>{THEREMINGOAT_SWITCH_REVIEW_COUNT} score-sheet rows</small></div>
    </div>

    <div className="switch-review-index-source">
      <span>Source snapshot · Composite Overall Total Score Sheet</span>
      <a href={THEREMINGOAT_SWITCH_SOURCE} target="_blank" rel="noreferrer">Open source sheet ↗</a>
    </div>

    <div className="switch-review-index-controls">
      <label className="switch-index-search"><span>Search</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Switch, manufacturer, type…"/></label>
      <label><span>Type</span><select value={type} onChange={event => setType(event.target.value)}><option value="all">All types</option>{typeOrder.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Manufacturer</span><select value={manufacturer} onChange={event => setManufacturer(event.target.value)}><option value="all">All manufacturers</option>{manufacturers.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <div className="switch-index-count"><b>{filtered.length}</b><span>shown</span></div>
    </div>

    <div className="switch-review-table" role="table" aria-label="External switch review directory">
      <div className="switch-review-row header" role="row">
        <span role="columnheader">Switch</span><span role="columnheader">Manufacturer</span><span role="columnheader">Type</span><span role="columnheader">Reviewed</span><span role="columnheader">Source</span>
      </div>
      {filtered.map((entry, index) => <div className="switch-review-row" role="row" key={`${entry.name}-${entry.reviewedAt}`}>
        <div role="cell"><small>{String(index + 1).padStart(3, "0")}</small><b>{entry.name}</b></div>
        <span role="cell">{entry.manufacturer}</span>
        <span role="cell" className="switch-review-type">{entry.type}</span>
        <time role="cell" dateTime={entry.reviewedAt}>{prettyDate(entry.reviewedAt)}</time>
        <span role="cell"><a href={entry.reviewUrl} target="_blank" rel="noreferrer" title={entry.scorecardName ? `Source scorecard title: ${entry.scorecardName}` : undefined}>Scorecard ↗</a></span>
      </div>)}
    </div>
    {filtered.length === 0 && <div className="switch-review-empty">No switch reviews match those filters.</div>}
  </section>;
}
