import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_MEDIA_HTML_BYTES,
  fetchWithSafeRedirects,
  readBytesLimited,
  readTextLimited,
  safeHttpsUrl,
} from "../src/worker/mediaSecurity";

test("media URL validation rejects private, credentialed and non-HTTPS targets", () => {
  assert.equal(safeHttpsUrl("http://example.com/image.png"), null);
  assert.equal(safeHttpsUrl("https://localhost/image.png"), null);
  assert.equal(safeHttpsUrl("https://127.0.0.1/image.png"), null);
  assert.equal(safeHttpsUrl("https://10.0.0.1/image.png"), null);
  assert.equal(safeHttpsUrl("https://100.64.0.1/image.png"), null);
  assert.equal(safeHttpsUrl("https://[::1]/image.png"), null);
  assert.equal(safeHttpsUrl("https://user:pass@example.com/image.png"), null);
  assert.equal(safeHttpsUrl("https://example.com/image.png"), "https://example.com/image.png");
});

test("media redirects are revalidated before the next fetch", async () => {
  let calls = 0;
  const fetcher = (async () => {
    calls += 1;
    return new Response(null, {
      status: 302,
      headers: { location: "https://127.0.0.1/private.png" },
    });
  }) as typeof fetch;

  const response = await fetchWithSafeRedirects("https://example.com/start", {}, fetcher);
  assert.equal(response, null);
  assert.equal(calls, 1);
});

test("media redirect helper follows bounded public HTTPS redirects", async () => {
  const seen: string[] = [];
  const fetcher = (async (input: string | URL | Request) => {
    const value = String(input);
    seen.push(value);
    if (seen.length === 1) return new Response(null, { status: 302, headers: { location: "/final" } });
    return new Response("ok", { status: 200 });
  }) as typeof fetch;

  const response = await fetchWithSafeRedirects("https://example.com/start", {}, fetcher);
  assert.equal(response?.status, 200);
  assert.deepEqual(seen, ["https://example.com/start", "https://example.com/final"]);
});

test("bounded text reader rejects declared and streamed oversize bodies", async () => {
  const declared = new Response("small", { headers: { "content-length": String(MAX_MEDIA_HTML_BYTES + 1) } });
  assert.equal(await readTextLimited(declared), null);

  const streamed = new Response(new Uint8Array(32));
  assert.equal(await readTextLimited(streamed, 16), null);

  const accepted = new Response("atlas");
  assert.equal(await readTextLimited(accepted, 16), "atlas");
});

test("bounded byte reader returns exact bytes and rejects oversize bodies", async () => {
  const accepted = new Response(new Uint8Array([1, 2, 3, 4]));
  assert.deepEqual([...((await readBytesLimited(accepted, 4)) ?? [])], [1, 2, 3, 4]);

  const rejected = new Response(new Uint8Array([1, 2, 3, 4, 5]));
  assert.equal(await readBytesLimited(rejected, 4), null);
});
