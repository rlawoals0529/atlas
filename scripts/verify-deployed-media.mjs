const base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  console.error("Usage: node scripts/verify-deployed-media.mjs <base-url>");
  process.exit(2);
}

const probes = [
  ["mouse", "mouse-deathadder-v4-pro"],
  ["keyboard", "keyboard-wooting-80he-plus"],
  ["switch", "switch-wooting-lekker-v2-l45"],
];

for (const [kind, id] of probes) {
  const response = await fetch(`${base}/api/media/${id}`, { redirect: "follow" });
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("image/")) {
    console.error(`${kind} media probe failed for ${id}: HTTP ${response.status}, content-type ${contentType || "(none)"}`);
    process.exit(1);
  }
  await response.body?.cancel();
  console.log(`${kind} media probe PASS: ${id} (${contentType})`);
}
