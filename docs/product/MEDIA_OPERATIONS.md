# Product media operations

Atlas prefers explicit manufacturer product images when a source is stable enough to pin. Other current mice and keyboards may use the Worker-side official-source resolver; current switches require explicit media.

## When production media verification fails

Do not remove the failing record from the production smoke test.

1. Confirm the canonical product source still resolves to the intended manufacturer page.
2. Check whether the page exposes a current first-party product image through OpenGraph metadata or an equivalent manufacturer-owned asset.
3. Prefer `og:image:secure_url` over an HTTP-only OpenGraph URL.
4. Add the stable HTTPS asset to the presentation-only media registry with:
   - the canonical Atlas product ID;
   - official source page;
   - useful alt text;
   - manufacturer image credit.
5. Run `npm run media:validate` and the full CI suite.
6. Merge only when the normal production media smoke test passes after deploy.

## Why Atlas pins some storefront media

Storefront pages can render normally in a browser while blocking or varying server-side fetches from Workers. If a canonical source repeatedly fails Worker-side image discovery, Atlas pins the current manufacturer asset rather than weakening the media verifier or substituting a third-party image.

## Provenance boundary

The media registry is presentation metadata. Adding or changing an image does not change canonical product specifications, evidence confidence, review scores, or product status.

Manufacturer imagery remains owned by its respective source. Public repository visibility does not relicense those assets.
