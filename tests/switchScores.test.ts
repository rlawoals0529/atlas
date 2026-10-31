import { strict as assert } from "node:assert";
import { test } from "node:test";
// @ts-expect-error The source importer is a build-time ESM utility.
import { parseCsv, scoreRows } from "../scripts/lib/score-sheets.mjs";
import data from "../src/shared/thereminGoatScores.json";

test("CSV handles multiline headers, escaped quotes and commas", () => {
  assert.deepEqual(parseCsv('a,"b\nc","d""e"\r\n1,"two,three",4'), [["a", "b\nc", 'd"e'], ["1", "two,three", "4"]]);
  assert.throws(() => parseCsv('"unclosed'));
});
test("score importer ignores adjacent manufacturer statistics and retains rescores", () => {
  const csv = 'Rank,Switch Name,Date,Manufacturer,Type,Timeless Total,Time Wtd. Total,,,Rank,Manufacturer\n1,Same,1/1/2026,Maker,Linear,60,59,,,1,Maker\n2,Same,1/1/2025,Maker,Linear,58,56\n,,,,,,,,,2,Other\n - LINEAR RANKINGS -\n1,Same,1/1/2026,Maker,Linear,60,59';
  assert.equal(scoreRows(csv, "overall").length, 2);
  assert.equal(scoreRows(csv, "overall")[1].weighted, 56);
});
test("three score scales and known source values remain separate", () => {
  for (const rows of Object.values(data.sheets)) assert.equal(rows.length, 474);
  assert.equal(data.sheets.overall[0].name, "Gateron G Pro 3.0 Yellow");
  assert.equal(data.sheets.overall[0].weighted, 82.8);
  assert.equal(data.sheets.hard[0].name, "Ball Bearing Blue");
  assert.equal(data.sheets.hard[0].timeless, 64);
  assert.equal(data.sheets.soft[0].weighted, 24.9);
  assert.ok(data.sheets.hard.every(row => row.weighted === null));
  for (const row of data.sheets.overall) {
    const match = (entry: { name: string; date: string }) => entry.name === row.name && entry.date === row.date;
    const hard = data.sheets.hard.find(match);
    const soft = data.sheets.soft.find(match);
    assert.ok(hard && soft, `All sheets must contain the same dated entry: ${row.name}`);
    assert.equal(hard.timeless + soft.timeless, row.timeless);
  }
});
