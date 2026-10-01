import assert from "node:assert/strict";
import test from "node:test";
import { parseSharedCompareIds, serializeSharedCompareIds } from "../src/shared/shareState";

test("parseSharedCompareIds keeps unique safe IDs in order", () => {
  assert.deepEqual(
    parseSharedCompareIds("mouse-a, mouse-b,mouse-a,mouse-c"),
    ["mouse-a", "mouse-b", "mouse-c"],
  );
});

test("parseSharedCompareIds rejects malformed IDs and caps the comparison at four", () => {
  assert.deepEqual(
    parseSharedCompareIds("one,two,../bad,three,four,five,space id"),
    ["one", "two", "three", "four"],
  );
});

test("parseSharedCompareIds handles empty input", () => {
  assert.deepEqual(parseSharedCompareIds(null), []);
  assert.deepEqual(parseSharedCompareIds(""), []);
});

test("serializeSharedCompareIds applies the same safety and dedupe contract", () => {
  assert.equal(
    serializeSharedCompareIds(["switch-one", "switch-one", "switch-two", "bad/id", "switch-three"]),
    "switch-one,switch-two,switch-three",
  );
});
