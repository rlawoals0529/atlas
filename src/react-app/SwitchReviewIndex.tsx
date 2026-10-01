import { Fragment, useMemo, useState } from "react";
import { THEREMINGOAT_SWITCH_REVIEW_COUNT, THEREMINGOAT_SWITCH_SOURCE, thereminGoatSwitchReviews } from "../shared/thereminGoatSwitchReviews";
import "./switch-review-index.css";

const typeOrder = ["Linear", "Tactile", "Clicky", "Silent Linear", "Silent Tactile"];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
type SortMode = "name" | "manufacturer" | "newest" | "oldest";

function prettyDate(value: string) {
  const [month, day, year] = value.split("/").map(Number);
  if (!month || !day || !year) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}

function dateValue(value: string) {
  const [month, day, year] = value.split("/").map(Number);
  return (year || 0) * 10000 + (month || 0) * 100 + (day || 0);
}

function initialFor(name: string) {
  const initial = name.trim().charAt(0).toUpperCase();
  return /^[A-Z]$/.test(initial) ? initial : "#";
}

function typeClass(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-");
}

export default function SwitchReviewIndex() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [manufacturer, setManufacturer] = useState("all");
  const [letter, setLetter] = useState("all");
  const [sort, setSort] = useState<SortMode>("name");

  const manufacturers = useMemo(
    () => [...new Set(thereminGoatSwitchReviews.map(entry => entry.manufacturer))].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of thereminGoatSwitchReviews) counts.set(entry.type, (counts.get(entry.type) ?? 0) + 1);
    return counts;
  }, []);

  const baseFiltered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return thereminGoatSwitchReviews.filter(entry => {
      if (type !== "all" && entry.type !== type) return false;
      if (manufacturer !== "all" && entry.manufacturer !== manufacturer) return false;
      if (!needle) return true;
      return `${entry.name} ${entry.manufacturer} ${entry.type}`.toLowerCase().includes(needle);
    });
  }, [query, type, manufacturer]);

  const letterCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of baseFiltered) {
      const initial = initialFor(entry.name);
      counts.set(initial, (counts.get(initial) ?? 0) + 1);
    }
    return counts;
  }, [baseFiltered]);

  const filtered = useMemo(() => {
    const rows = baseFiltered.filter(entry => letter === "all" || initialFor(entry.name) === letter);
    rows.sort((a, b) => {
      if (sort === "newest") return dateValue(b.reviewedAt) - dateValue(a.reviewedAt) || a.name.localeCompare(b.name);
      if (sort === "oldest") return dateValue(a.reviewedAt) - dateValue(b.reviewedAt) || a.name.localeCompare(b.name);
      if (sort === "manufacturer") return a.manufacturer.localeCompare(b.manufacturer) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [baseFiltered, letter, sort]);

  const hasFilters = query.trim() || type !== "all" || manufacturer !== "all" || letter !== "all" || sort !== "name";
  const reset = () => {
    setQuery("");
    setType("all");
    setManufacturer("all");
    setLetter("all");
    setSort("name");
  };

  return <section className="switch-review-index" id="switch-review-index" aria-labelledby="switch-review-index-title">
    <div className="switch-review-index-head">
      <div>
        <span>External review directory</span>
        <h2 id="switch-review-index-title">ThereminGoat switch scorecards</h2>
        <p>Search the public scorecard directory without mixing those reviews into Atlas product specs. Names, manufacturers, switch type, review date and source links stay attributed to ThereminGoat.</p>
      </div>
      <div className="switch-review-index-stat"><b>{thereminGoatSwitchReviews.length}</b><span>unique switches</span><small>{THEREMINGOAT_SWITCH_REVIEW_COUNT} score-sheet rows</small></div>
    </div>

    <div className="switch-review-index-source">
      <span>Source snapshot · Composite Overall Total Score Sheet</span>
      <a href={THEREMINGOAT_SWITCH_SOURCE} target="_blank" rel="noreferrer">Open source sheet ↗</a>
    </div>

    <div className="switch-type-quick" aria-label="Filter by switch type">
      <button type="button" className={type === "all" ? "active" : ""} onClick={() => setType("all")} aria-pressed={type === "all"}><span>All</span><b>{thereminGoatSwitchReviews.length}</b></button>
      {typeOrder.map(item => <button type="button" key={item} data-type={typeClass(item)} className={type === item ? "active" : ""} onClick={() => setType(item)} aria-pressed={type === item}><span>{item}</span><b>{typeCounts.get(item) ?? 0}</b></button>)}
    </div>

    <div className="switch-review-index-controls">
      <label className="switch-index-search"><span>Search</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Switch, manufacturer, type…"/></label>
      <label><span>Manufacturer</span><select value={manufacturer} onChange={event => setManufacturer(event.target.value)}><option value="all">All manufacturers</option>{manufacturers.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Sort</span><select value={sort} onChange={event => setSort(event.target.value as SortMode)}><option value="name">Name · A–Z</option><option value="manufacturer">Manufacturer</option><option value="newest">Newest review</option><option value="oldest">Oldest review</option></select></label>
      <div className="switch-index-summary"><b>{filtered.length}</b><span>of {thereminGoatSwitchReviews.length}</span>{hasFilters && <button type="button" onClick={reset}>Reset</button>}</div>
    </div>

    <div className="switch-alpha-rail" aria-label="Filter by first letter">
      <button type="button" className={letter === "all" ? "active" : ""} onClick={() => setLetter("all")} aria-pressed={letter === "all"}>All</button>
      {letters.map(item => <button type="button" key={item} className={letter === item ? "active" : ""} onClick={() => setLetter(item)} disabled={!letterCounts.get(item)} aria-pressed={letter === item} title={letterCounts.get(item) ? `${letterCounts.get(item)} switches` : "No matches"}>{item}</button>)}
    </div>

    <div className="switch-review-table" role="table" aria-label="External switch review directory">
      <div className="switch-review-row header" role="row">
        <span role="columnheader">Switch</span><span role="columnheader">Manufacturer</span><span role="columnheader">Type</span><span role="columnheader">Reviewed</span><span role="columnheader">Source</span>
      </div>
      {filtered.map((entry, index) => <Fragment key={`${entry.name}-${entry.reviewedAt}`}>
        <div className="switch-review-row" role="row">
          <div role="cell" data-label="Switch"><small>{String(index + 1).padStart(3, "0")}</small><b title={entry.name}>{entry.name}</b></div>
          <span role="cell" data-label="Manufacturer">{entry.manufacturer}</span>
          <span role="cell" data-label="Type" className="switch-review-type" data-type={typeClass(entry.type)}>{entry.type}</span>
          <time role="cell" data-label="Reviewed" dateTime={entry.reviewedAt}>{prettyDate(entry.reviewedAt)}</time>
          <span role="cell" data-label="Source"><a href={entry.reviewUrl} target="_blank" rel="noreferrer" title={entry.scorecardName ? `Source scorecard title: ${entry.scorecardName}` : undefined}>Scorecard ↗</a></span>
        </div>
      </Fragment>)}
    </div>
    {filtered.length === 0 && <div className="switch-review-empty">No switch reviews match those filters. <button type="button" onClick={reset}>Clear filters</button></div>}
  </section>;
}
