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
## Client change diary (REQUIRED after every commit)

There is a **human-friendly diary for the client** at the absolute path
`/Users/genjerator/Projects/storefront-diary.md` (the parent `Projects` folder).
**Whenever you (Claude) create a commit in this repo during a session, immediately
add a plain-language entry to that client diary** under today's date
(`## <Month Day, Year>`) in the **### Krile Online Shop** subsection. If today's
date heading already exists, append bullets under that subsection instead of making
a new date. Write for a non-technical client: describe the user-facing effect, no
jargon, no commit hashes, no file names. Newest dates at the bottom; never rewrite
past entries.

**Every** commit in this repo must result in a client-diary entry — including
commits made directly in the terminal, not only ones Claude makes. A separate raw
commit log inside the backend repo is auto-maintained by a git `post-commit` hook
and captures terminal commits too; near the start of a session (or when asked),
reconcile the client diary against `git log` and fill any missing days (skip purely
technical commits with no user-facing effect).
