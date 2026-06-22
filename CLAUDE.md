# CLAUDE.md

Guidance for working in this repository (krile Medusa storefront — Next.js 15 / App Router).

## Architecture

- This repo is the **storefront** (frontend). The Medusa **backend** lives at `/Users/genjerator/Projects/krile_medusa` and runs on `http://localhost:9000`.
- The storefront binds to a Medusa **sales channel** via the publishable API key (`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`), not by channel name.
- There is a second storefront at `/Users/genjerator/Projects/planetagmbh_medusa-storefront`. SEO/tracking/config changes apply to **both** storefronts; design changes are krile-only.

## Local development

- Package manager: **pnpm** (not npm — npm fails on this repo's peer deps / lockfile).
- Dev server: `pnpm dev` (port 8000). Production build: `pnpm build`.

### Database (local)

The backend Postgres runs as a Docker container `krile_medusa-postgres-1` (postgres:17, port 5432).

```sh
PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-v2 -P pager=off -c "<SQL>"
```

Connection string (local dev defaults, from the backend's `.env`):
`postgres://postgres:postgres@localhost:5432/medusa-v2`

Run backend scripts from the backend dir with `npx medusa exec ./src/scripts/<file>.ts`.
## Storefront diary

Changes in this repo are logged to a shared diary in the backend repo:
`/Users/genjerator/Projects/krile_medusa/storefront-diary.md`. A git
`post-commit` hook here auto-appends a factual entry on every commit.
**After you (Claude) create a commit in this repo during a session, enrich the
just-added diary entry** with a short paragraph on the *why*, notable decisions,
and follow-ups. Keep the auto-generated factual lines; append context below them.
Do not rewrite older entries.
