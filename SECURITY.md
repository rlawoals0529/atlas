# Atlas security baseline

Atlas is a read-mostly gaming-peripheral research application deployed on Cloudflare Workers. Repository visibility does not change the application security model. The current production runtime has no user accounts, private per-user records, required database binding, file uploads, webhooks, or paid AI endpoint. Controls that depend on those features (password storage, RLS, per-user authorization, CSRF for authenticated mutations, private buckets, webhook signatures) are not applicable until those features are introduced.

## Reporting a security issue

Do not post credentials, private tokens, private user data, or an exploit containing sensitive material in a public issue.

If GitHub shows a private vulnerability-reporting option for this repository, use that channel. Otherwise, contact the repository owner through the GitHub profile before publishing sensitive details. Ordinary non-sensitive bugs can use the public bug-report template.

## Current requirements

- Keep API keys and Cloudflare credentials out of source and browser bundles. Deployment credentials belong in encrypted GitHub Actions secrets or Cloudflare-managed secrets.
- `.env*`, `.dev.vars`, Wrangler state, logs, build output, and generated data artifacts stay out of git.
- Validate every request on the Worker. Browser controls are convenience, not authorization or validation.
- Public API parameters are bounded by length/range. The recommendation POST endpoint accepts only bounded JSON and is rate limited.
- Do not add wildcard CORS. Same-origin browser access is the default unless a documented external API use case is introduced.
- API responses include CSP/clickjacking/MIME/referrer/permissions/HSTS security headers and generic server errors.
- Do not log request bodies, profile payloads, credentials, or secrets. Error logs should contain only the minimum information needed for diagnosis.
- Dependency CI must run the existing catalog/build/Worker checks and an npm production-dependency vulnerability audit.
- New packages must be resolvable from the package registry and should be pinned through the normal package manifest/lockfile workflow.
- Any future AI/tool feature must treat retrieved/user content as untrusted, use explicit tool allowlists and argument bounds, and have rate/spend limits before launch.

## Deployment controls

Cloudflare edge rate limiting, HTTPS redirect/HSTS policy, account spend/usage alerts, and secret rotation are configured outside this repository. GitHub secret scanning and push protection should be enabled when available, especially before or when the repository is made public.

If any real credential is ever committed or printed into a public log, revoke/rotate it immediately. Removing it from the current file is not sufficient because git history may retain it.

## Security regression checks

Before deployment, run:

```bash
npm ci --no-audit --no-fund
npm run data:validate
npm run data:report
npm run data:seed
npm run check
npm audit --omit=dev --audit-level=high
```
