# Bonire Concepts Art website

BCA's studio website, automotive concept portfolio, publishing tools and protected administration dashboard. The company is an independent automotive design and intellectual property development studio with African roots and global ambition.

**Tagline:** Shaping Africa's Automotive Identity.

The original brief is `Bonire_Concepts_Art_Website_Drawing_Plan.pdf` in the BCA repository. The latest approved studio copy is in `lib/studio.ts`, and project descriptions are in `lib/projects.ts`.

## Website access

- Website: https://bonireconceptsart.vercel.app
- Portfolio: `/projects`
- Journal: `/blog`
- Administration: `/admin`
- Article editor: `/admin/blog`

The public website presents BCA’s work. Studio administration and private project materials use authenticated access.

## Product features

| Area | Implemented behavior |
| --- | --- |
| Home | Studio identity, motto, short mission/vision and project/collaboration links over a static decorative underlay |
| Projects | Five concept pages, approved descriptions, image galleries/lightboxes and available concept films |
| Variants | Separate ARA EV/CNG and MACE FREEDOM SUV/Truck sections |
| About | Full vision, mission, studio positioning and development approach |
| Partnerships and support | Technical, strategic, IP/licensing and support enquiry paths |
| Contact | Studio email, WhatsApp, social accounts and persistent enquiry forms |
| Commissions | Dedicated design-brief selection through `/contact?kind=commission` |
| Blog | Published article index, individual articles, categories, approved covers and RSS |
| Studio Desk | Overview, enquiries, portfolio, articles, access grants, private files, audit history and backup resources |
| Project rooms | Per-email, per-project, expiring and revocable private-material access |
| Search metadata | Titles, descriptions, canonicals, social previews, structured data, robots and sitemap |

The work is presented as design concepts. Images and animations do not establish engineering validation, road certification, production readiness or certified performance.

## Vehicle concepts

| Display name | Existing slug | Direction |
| --- | --- | --- |
| ORANGE CRUISER | `orange-cruise` | Electric crossover SUV concept |
| IRIN | `irin` | Intercity passenger and cargo transport |
| AMI | `ami` | Full-size pickup truck concept |
| MACE FREEDOM | `mace-freedomm` | Boxy SUV and truck variants |
| ARA | `ara-1` | Sedan concept with EV and CNG variants |

Display names use the approved wording while existing links remain stable. All projects start at Concept Design. Administrators should advance a development phase only when the studio has supporting evidence.

## Stack and request flow

- React 19 and TypeScript for the interface.
- Vinext with a Next.js App Router-compatible structure.
- Cloudflare Workers for server rendering and API handlers.
- Cloudflare D1 and Drizzle ORM for persistent records.
- Cloudflare R2 for concept films and private project files.
- Company owner email/password authentication with Better Auth, persisted sessions, secure cookies and database-backed rate limits. Approved external project-room viewers retain hosted sign-in.
- Responsive CSS, the approved BCA mark and brand blue sampled from the supplied raster logo.

Public pages load source defaults merged with saved project-content overrides. Forms save validated enquiries in D1. The journal reads only published rows. Administrative routes check the signed-in email against the studio allowlist. Private file routes check an active project grant before streaming an R2 object.

The source manifest `.openai/hosting.json` declares D1 as `DB` and R2 as `BUCKET`. It also identifies the existing Sites project. Do not replace that identity when updating the hosted site.

## Development requirements

Use Node.js 22.13+ and pnpm. Node 24 is recommended to run `tests/check-admin-queries.mjs`, which uses the built-in `node:sqlite` module.

From the repository root:

```sh
cd website
pnpm install
pnpm exec tsc --noEmit
pnpm build
```

For a standalone local checkout, `pnpm dev` runs the configured Vinext development workflow. The scripts select the checkout's execution profile. Production-style local preview uses `pnpm start` after a build, with Wrangler and local binding state.

### Local database migrations

SQL migrations live in `drizzle/`. Build first to generate `dist/server/wrangler.json`, then apply each migration that has not already been applied to the local database:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_classy_korg.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_robust_ma_gnuci.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_brave_santa_claus.sql
```

Do not replay an already-applied migration. These commands affect local preview state only. Sites applies hosted migrations through its publication workflow. A standalone Cloudflare deployment must provision the actual bindings and manage production migrations separately.

After changing `db/schema.ts`, generate a new migration with `pnpm db:generate`, inspect its SQL and metadata, and append it to source control. Do not edit applied migration history.

## Runtime configuration

| Name | Purpose | Required for |
| --- | --- | --- |
| `DB` | D1 database binding | Enquiries, saved content, articles, grants and audit records |
| `BUCKET` | R2 object binding | Concept films and private materials |
| `BCA_OWNER_EMAIL` | Provisioned company owner email | Sole administrator identity |
| `BCA_OWNER_PASSWORD_HASH` | Better Auth password hash used for initial provisioning | Never place plaintext passwords in source |
| `BCA_AUTH_SECRET` | Random secret with at least 32 characters | Session authentication |
| Hosted identity headers | Supplied by the trusted Sites sign-in layer | Approved external project-room viewer identity only |

`DB` and `BUCKET` are runtime bindings, not ordinary string environment variables. Copying names into a generic Node host does not create equivalent services.

The company owner account is provisioned explicitly by the deployment operator. Public registration is disabled. Initial provisioning never resets a password subsequently changed by the owner. Keep secrets outside source control. Dashboard APIs require an active company owner session and mutations also require a valid Origin.

## Studio Desk operating guide

1. Open `/sign-in` on the production website and sign in with the provisioned company owner credentials.
2. Use Overview for actual database counts and recent studio activity.
3. Search and filter enquiries, open the record, update its review status and save internal notes. Reply links open an email client.
4. Edit approved project descriptions, phase and gallery selections under Portfolio. New projects and arbitrary public asset uploads require source changes.
5. Open Blog posts to write a draft, preview it and publish when approved.
6. Create a project-specific grant for an approved reviewer's exact sign-in email. Grants last 1 to 90 days, can be renewed from the current time and can be revoked.
7. Upload selected private PDFs/images under Private files. Share the appropriate `/private/<slug>` room link separately.
8. Use Activity log to review administrative actions and private downloads. Export a structured backup when required.

An approved enquiry does not grant access. Confidentiality agreements, commercial contracts and licensing terms are handled separately. Revoked grants cannot be renewed. A fresh approved grant is required.

The dashboard shows studio-record counts, not visitor analytics. Settings reports binding availability rather than measuring service uptime. Administrator provisioning, domain/audience changes and search-platform ownership verification are owner-managed.

## Journal publishing

- `/blog` lists published articles.
- `/blog/<slug>` renders the article and its metadata.
- `/blog/feed.xml` exposes an RSS feed.
- `/admin/blog` manages drafts and publication.

Blank lines separate paragraphs. `##` starts a heading, `-` starts a list line and `>` starts a quote. React escapes article text. Embedded HTML and scripts are not executed.

Published posts need a summary and article text. Cover selection uses the approved asset library and requires alt text. Post URLs are fixed after the first save. First publication time is retained, and updates have modification dates. Stale sessions return a conflict instead of overwriting newer edits. Drafts are excluded from public reads, RSS and sitemap entries. No demonstration posts are seeded.

## Storage, media and IP

`public/` contains only approved public logos, background underlays, optimized renders and video posters. The original repository artwork stays in its source folders. `docs/asset-manifest.json` records the initial curated asset mapping, and the variant modules identify the additional ARA CNG and MACE truck galleries.

ORANGE CRUISER, AMI and ARA CNG have optimized films in R2. Collection previews can play muted while visible and respect reduced-motion/data-saving preferences. Project players support native controls, sound and seeking. `/api/films/[slug]` handles byte ranges, HEAD and ETags. Film keys, source checksums and encoding notes are documented under `lib/films.ts` and `docs/video-*.json`.

IRIN and MACE FREEDOM currently use still galleries. Original media assets remain in the repository source collection.

Concept-film ingestion is restricted to an authorized maintenance workflow. The public site does not accept film imports.

Private materials are stored in R2 and require application authorization at download time. Private uploads are limited to 10 MB and supported PDF/PNG/JPEG/WebP formats with file-signature checks. Removing a material detaches its database access before attempting object cleanup.

Never put confidential CAD, research or engineering material in `public/`. Access to the repository or a public visualization does not grant design reproduction, manufacturing or licensing rights.

## Important routes

| Route | Purpose |
| --- | --- |
| `/`, `/about`, `/projects`, `/projects/<slug>` | Studio and portfolio pages |
| `/partnerships`, `/support`, `/contact` | Collaboration and enquiries |
| `/blog`, `/blog/<slug>`, `/blog/feed.xml` | Public journal and RSS |
| `/admin`, `/admin/blog` | Protected dashboard and editor |
| `/private/<slug>` | Approved project room |
| `POST /api/enquiries` | Validated, rate-limited enquiry submission |
| `POST /api/admin` | Authorized review, content, grant and file actions |
| `POST /api/admin/blog` | Authorized article writes |
| `GET /api/admin/export` | Authorized structured backup |
| `GET /api/materials/<id>` | Per-request authorized private download |
| `/api/films/<slug>` | Public concept film streaming |
| `/robots.txt`, `/sitemap.xml` | Search discovery resources |

## Data protection and backups

Enquiries require consent and use origin validation, a spam honeypot and hashed hourly network rate limits. Administrative mutations require origin and administrator checks. Enquiry/project revisions and article versions reject stale writes.

Backup export contains enquiries and notes, access grants, project content, blog posts, private-file metadata and audit records. It contains private information and must be stored accordingly. R2 file bytes need a separate backup. There is no scheduled backup or restore interface.

The application does not send emails, collect payments, issue automatic investment rights, provide vehicle checkout or automatically approve private access.

## Checks

Run from `website/`:

```sh
pnpm exec tsc --noEmit
node tests/check-admin-dashboard.mjs
node tests/check-admin-queries.mjs
node tests/check-owner-auth.mjs
node tests/check-blog.mjs
node tests/check-commission-enquiries.mjs
node tests/check-video-ranges.mjs
pnpm build
```

The dashboard handler tests use isolated adapters. The query tests execute actual Drizzle queries against in-memory SQLite with migrations applied. They do not create production enquiries, grants or blog posts.

The test suite covers permissions, management workflows, publishing, database queries and media delivery. Release checks should also exercise responsive layouts and signed-in browser workflows.

## Website operations

- Maintain the company owner credentials and change the password from Studio Desk settings when required.
- Review legal identity, privacy/terms and retention decisions.
- Maintain the public domain and hosting access settings.
- Update `siteOrigin` in `lib/seo.ts` if the canonical public origin changes.
- Maintain Search Console/Bing ownership and submit `/sitemap.xml`.
- Publish approved studio articles and maintain curated concept media.
- Complete responsive browser testing and signed-in form/access workflows.
- Configure a notification provider only if email delivery is required.

Private hosting prevents crawling even when SEO metadata allows indexing. Search work improves eligibility and understanding. It does not guarantee placement for broad automotive searches.

## Further implementation notes

- [Admin dashboard](docs/admin-dashboard.md)
- [Blog workflow](docs/blog.md)
- [Search launch](docs/seo-launch.md)
- [Implementation overview](docs/IMPLEMENTATION.md)
- [Video provenance](docs/video-sources.json)
- [Video encoding](docs/video-encoding.json)
