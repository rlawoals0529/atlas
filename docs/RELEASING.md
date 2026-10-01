# Releasing Atlas

Atlas releases should describe a verified product state, not simply tag whichever commit is newest.

## Before release

1. Merge only green pull requests.
2. Confirm `main` passes:
   - Atlas CI;
   - Security baseline;
   - CodeQL;
   - dependency review when GitHub Dependency Graph is enabled.
3. Wait for **Deploy Atlas** to succeed on the exact intended release commit.
4. Confirm the production deploy reports:
   - matching release metadata;
   - matching canonical catalog counts;
   - required API security headers;
   - all current media probes passing.
5. Run or confirm:
   ```bash
   npm ci
   npm run verify
   npm run sbom:generate
   ```
6. Update `CHANGELOG.md` and add checked-in release notes under `docs/releases/`.

## Versioning

Atlas uses semantic-looking product versions, but a version should correspond to a coherent product/research milestone.

- **patch** — corrections, reliability/security fixes, small UX fixes with no meaningful product-scope change;
- **minor** — new product/category workflows, substantial catalog/research capabilities, or meaningful public-product expansion;
- **major** — reserved for a materially incompatible product/data contract.

Do not bump a version solely because the catalog gained a few sourced products.

## Publishing

Create the GitHub release from the exact `main` SHA that has already passed production verification.

The release should include:

- user-visible product changes;
- catalog/evidence changes;
- compatibility or methodology changes;
- meaningful accessibility/performance/security changes;
- explicit boundaries for anything Atlas does not claim.

Do not publish generated analytics, fabricated validation results, or third-party review scores as Atlas findings.

## After release

1. Verify the GitHub tag targets the intended commit.
2. Verify the release is visible from the public repository.
3. Keep `CHANGELOG.md` moving under **Unreleased** for subsequent work.
4. If the release changes public counts or evidence requirements, keep README/reviewer docs synchronized through the existing CI guards.
