// CSV exports contain quoted multiline headers and a second statistics table.
export function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(field); field = ""; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export function scoreRows(text, kind) {
  const rows = parseCsv(text);
  const headerIndex = rows.findIndex(row => row[0] === "Rank" && row[1] === "Switch Name");
  if (headerIndex < 0) throw new Error("Score sheet header missing");
  const headers = rows[headerIndex].map(cell => cell.replace(/\s+/g, " ").trim());
  const totalIndex = headers.indexOf("Timeless Total");
  const weightedIndex = headers.indexOf("Time Wtd. Total");
  const max = kind === "hard" ? 70 : kind === "soft" ? 30 : 100;
  const end = rows.findIndex((row, index) => index > headerIndex && row[0].includes("RANKINGS"));
  return rows.slice(headerIndex + 1, end < 0 ? undefined : end).filter(row => /^\d+$/.test(row[0]) && row[1] && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(row[2])).map(row => {
    const timeless = Number(row[totalIndex]);
    const weighted = weightedIndex < 0 ? null : Number(row[weightedIndex]);
    if (!row[totalIndex]?.trim() || !Number.isFinite(timeless) || timeless < 0 || timeless > max || (weighted !== null && (!row[weightedIndex]?.trim() || !Number.isFinite(weighted) || weighted > timeless))) throw new Error(`Invalid ${kind} score: ${row[1]}`);
    return { rank: Number(row[0]), name: row[1], date: row[2], manufacturer: row[3], type: row[4], timeless, weighted };
  });
}
