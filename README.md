# Bonire Concepts Art

### Shaping Africa's Automotive Identity.

Bonire Concepts Art (BCA) is an independent automotive design and intellectual property development studio with African roots and global ambition. This repository contains its original vehicle concept assets and the source for its studio website.

The website introduces the company, presents its vehicle design portfolio, supports design commissions and partnerships, and gives the studio a protected workspace for managing enquiries, articles and approved project access.

## Website and source

| Resource | Location |
| --- | --- |
| Current hosted website | [Bonire Concepts Art](https://bonire-concepts-art.deeen-code.chatgpt.site) |
| Vehicle portfolio | [Projects](https://bonire-concepts-art.deeen-code.chatgpt.site/projects) |
| Studio journal | [Blog](https://bonire-concepts-art.deeen-code.chatgpt.site/blog) |
| Administration | [Studio Desk](https://bonire-concepts-art.deeen-code.chatgpt.site/admin) |
| Website source | [`website/`](website/) |
| Original website brief | [Website drawing plan](Bonire_Concepts_Art_Website_Drawing_Plan.pdf) |

## Company direction

### Vision

To shape the future of automotive design and mobility through original ideas, bold innovation, and globally relevant intellectual property emerging from Africa.

### Mission

To research, design, and develop original automotive concepts and mobility solutions informed by real-world needs, advancing promising ideas toward engineering development, prototyping, and commercialization through technical collaboration and strategic partnerships.

BCA's African roots inform its design perspective without limiting its potential markets. The website presents the studio's work as original automotive concepts. It does not claim that a render proves engineering validation, road certification, production readiness or manufacturing capability.

## Vehicle portfolio

| Project | Design direction | Website presentation |
| --- | --- | --- |
| IRIN | Intercity passenger and cargo transport, with dedicated space for goods alongside passenger travel | Project description, exterior/interior gallery and enquiry links |
| ORANGE CRUISER | An expressive crossover SUV concept exploring electric mobility | Project gallery and concept film |
| ARA | A sedan concept exploring CNG and electric powertrain directions | Separate EV and CNG sections, render galleries and the CNG concept film |
| AMI | A full-size pickup truck concept focused on utility and versatility | Project gallery and concept film |
| MACE FREEDOM | A rugged, boxy vehicle identity across SUV and truck body styles | Separate SUV and truck sections with their own render galleries |

Existing URLs are retained even where approved display names changed: `/projects/orange-cruise`, `/projects/irin`, `/projects/ara-1`, `/projects/ami` and `/projects/mace-freedomm`.

## What the website includes

### Public studio website

- A homepage introducing BCA, its tagline, vision, mission and collaboration direction.
- A dedicated Projects collection and an individual page for each concept.
- An About page explaining the studio's identity and development ambition.
- Partnership and support pages with enquiry paths for technical, strategic and commercial discussions.
- A Contact page with WhatsApp, email and the studio's Instagram, Facebook, TikTok and X accounts.
- A “Commission a project” flow for paid automotive design briefs.
- The approved symbol-only logo, its sampled brand blue, supplied static page underlays and a responsive footer.
- Draft privacy and terms pages awaiting launch review.

The homepage introduces the studio. Project galleries live in the Projects section. Background imagery acts as a decorative underlay and does not reserve a separate block of page height.

### Project images and animations

Project galleries support image selection and keyboard-accessible lightboxes. The collection can show muted concept-film previews while in view, with reduced-motion and data-saving preferences respected. Dedicated project players provide native controls and sound.

Three optimized films are currently integrated: ORANGE CRUISER, AMI and ARA CNG. Media streaming supports byte ranges for seeking, HEAD requests and ETags. IRIN and MACE FREEDOM currently use still galleries. Original MP4 assets remain in the source collection.

### Blog and publishing

The studio journal includes a Blog tab, article pages, categories, cover images, reading-time estimates, publication dates and an RSS feed at `/blog/feed.xml`.

The protected blog editor supports drafts, previews, publishing, updates and moving an article back to drafts. Only published posts appear on the public blog, RSS feed and sitemap. Article URLs stay fixed after the first save, and stale editing sessions cannot overwrite newer changes. There are no seeded or fabricated articles.

### Studio Desk admin dashboard

Studio Desk is a separate responsive administrative workspace at `/admin`.

| Area | Available controls |
| --- | --- |
| Overview | Actual enquiry, article, active-grant and private-file counts, recent enquiries, activity and shortcuts |
| Enquiries | Search, type/project/status filters, pagination, record details, review status and internal notes |
| Portfolio | Names, categories, short and full descriptions, development phases and approved gallery selections |
| Blog posts | Draft, preview, publish, update and unpublish articles |
| Access grants | Create time-limited project access, renew expiration, revoke access and filter grant states |
| Private files | Upload, download, rename and remove project materials |
| Activity log | Searchable administrative actions and private download records |
| Settings and backup | Signed-in account, service-binding availability, search resources and structured JSON export |

Overview numbers describe studio records. Website traffic analytics and conversion tracking are not installed.

### Enquiries and private project rooms

Visitors can submit general questions, commissioned design briefs, design-access requests, IP/licensing enquiries, partnership proposals and support offers. Forms validate submissions server-side, require privacy consent and apply honeypot and hourly rate-limit checks. Accepted submissions persist in the studio database.

Private rooms use `/private/<project-slug>`. Access is tied to a signed-in email, a specific project and an expiration time. Grants can be revoked. Each private file download rechecks authorization, and internal review status alone never grants access. Confidentiality agreements and commercial terms are handled separately.

The application records enquiries but does not send email notifications or automatic replies. Reply links open the administrator's email client.

## Technology and architecture

| Layer | Implementation |
| --- | --- |
| Interface | React 19, TypeScript, responsive CSS and local SVG/Lucide icons |
| Routing and rendering | Vinext with Next.js App Router-compatible application structure |
| Hosted runtime | Cloudflare Workers through Sites |
| Database | Cloudflare D1 with Drizzle ORM and tracked SQL migrations |
| File storage | Cloudflare R2, with private downloads checked by the application |
| Identity | Hosted ChatGPT sign-in and a studio administrator email allowlist |
| Public imagery | Curated WebP assets |
| Concept films | Optimized H.264/AAC MP4s in R2 |

Application records are stored in D1. Enquiries, blog posts and project-content edits do not require a rebuild. Original artwork remains in the repository, while approved website assets are kept under `website/public/`.

## Repository layout

```text
BCA/
  README.md
  Bonire_Concepts_Art_Website_Drawing_Plan.pdf
  AMI/
  ORANGE CRUISE/
  MACE FREEDOMM/
  ara 1/
  irin website/
  website/
    app/          Public pages, dashboard, private rooms and API routes
    components/   Website and management interface components
    lib/          Studio copy, project data, access and publishing logic
    db/           Database schema and binding access
    drizzle/      SQL migrations and schema metadata
    public/       Approved public logos, underlays, images and posters
    tests/        Management, publishing, query and media checks
    docs/         Implementation, security, media and launch notes
```

## Running and maintaining the application

Use Node.js 22.13 or later and pnpm. Node 24 is recommended for the full test suite because the SQL query tests use Node's built-in SQLite module.

```sh
git clone https://github.com/Tajudeeen/BCA.git
cd BCA
cd website
pnpm install
pnpm exec tsc --noEmit
pnpm build
```

This is a Cloudflare/Vinext application. Running it requires the runtime and bindings, not just a static file server. See the [website setup guide](website/README.md) for local development, migration commands and runtime configuration.

The original PDF and MP4 assets may be Git LFS pointers in a clone. Retrieve them with Git LFS when needed. A pointer file is not the actual document or video.

## Administrator activation

Studio Desk uses `STUDIO_ADMIN_EMAILS` to identify approved ChatGPT sign-in emails. No first visitor becomes an administrator, and the public contact address does not automatically receive admin rights.

After activation, sign in at `/admin`, review enquiries, publish studio articles, maintain portfolio copy and grant approved reviewers access to private materials.

## Search visibility

The build includes unique page titles and descriptions, canonical URLs, social previews, structured data, a sitemap with project images and crawler directives. Published blog articles receive article metadata and sitemap entries. Administrative, private and draft-policy pages are excluded from indexing.

Search configuration includes canonical-domain settings, crawler access and search-platform ownership verification. Ranking depends on content relevance, discoverability and the wider web.

## Verification

The website includes TypeScript checks, production builds and focused tests for:

- Administrator permissions, request origins and invalid management actions.
- Enquiry notes, project edits and stale-save conflicts.
- Grant creation, expiration, renewal and revocation.
- Private upload formats, file removal and storage-key exclusion.
- Blog draft visibility, publishing and escaped article content.
- Actual Drizzle SQL queries against migrated in-memory SQLite, including counts, filtering, search and pagination.
- Commission enquiries and video byte-range behavior.

## Website operations

- Maintain approved administrator access and review grants regularly.
- Keep project descriptions and development phases aligned with studio evidence.
- Publish original design articles through the studio journal.
- Review privacy terms, retention decisions and backup procedures.
- Maintain domain settings, search ownership and the website sitemap.
- Verify responsive layouts and signed-in workflows when releasing changes.
- Configure a notification provider if studio email delivery is required.

There is no vehicle checkout, payment collection, automated investment flow, CAD editor, public commenting system or automatic project-room approval. New vehicle projects and arbitrary public image uploads currently require source changes.

## Intellectual property and private materials

This repository contains original BCA concept assets. Repository access or public viewing of a render does not grant reproduction, manufacturing, distribution or licensing rights. No open-source license or design-rights grant is asserted by this README.

Do not add confidential research, CAD or engineering files to `website/public/`. The studio backup exports database records and private-file metadata, not R2 file contents. File bytes require a separate backup.

## Contact

- Email: [infobonireconceptsart@gmail.com](mailto:infobonireconceptsart@gmail.com)
- WhatsApp: [09039533343](https://wa.me/2349039533343)
- Instagram: [@bonireconceptsart](https://www.instagram.com/bonireconceptsart/)
- Facebook: [Bonire Concepts Art](https://www.facebook.com/profile.php?id=61590610898201)
- TikTok: [@boniredesignsseries](https://www.tiktok.com/@boniredesignsseries)
- X: [@The_B_C_A](https://x.com/The_B_C_A)
