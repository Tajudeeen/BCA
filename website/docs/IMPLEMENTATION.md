# Website implementation overview

Bonire Concepts Art’s website presents the studio, its original vehicle concepts, design commissions and collaboration opportunities. Source defaults use the approved mission, vision, tagline and project descriptions.

## Public experience

Home introduces the company. Projects presents IRIN, ORANGE CRUISER, ARA, AMI and MACE FREEDOM with dedicated galleries. ARA has EV and CNG sections. MACE FREEDOM has SUV and truck sections. About explains the studio’s African roots and global ambition. Partnerships, Support and Contact guide visitors toward the appropriate enquiry. Blog publishes approved studio articles.

The visual system uses the symbol-only logo, its sampled blue, supplied static image underlays and responsive layouts. Home keeps project galleries in the dedicated portfolio area.

## Studio workflows

Studio Desk contains the overview, enquiry management, portfolio editing, blog publishing, access grants, private materials and activity history. Enquiries persist in D1. Administrator sign-in and the approved email allowlist protect management pages and actions.

Private project rooms require an active grant for the exact signed-in email and project. Downloads recheck authorization. Review status alone never grants file access. Grants are expiring and revocable.

## Application structure

- `app/`: pages, protected rooms and API handlers.
- `components/`: public and administrative interfaces.
- `lib/`: studio copy, project records, publishing, access and metadata logic.
- `db/` and `drizzle/`: D1 schema and migrations.
- `public/`: approved public imagery, marks, underlays and posters.
- `tests/`: permissions, management, queries, publishing and media checks.

## Data and media

D1 stores enquiries, notes, content overrides, articles, grants, material references and audit events. R2 stores concept films and private materials. Public WebP renders are curated from the studio’s source assets. Original PDFs and MP4s are retained separately in the repository asset collection.

Concept films for ORANGE CRUISER, AMI and ARA CNG stream with range/seek support. IRIN and MACE FREEDOM use still galleries. Confidential research, CAD and engineering materials belong in approved private storage, never in public assets.

## Maintenance

Use additive schema migrations. Preserve project URLs, approved media and access controls when editing content. Keep administrator access current, review retention and backups, and verify responsive and signed-in workflows with each release. Detailed procedures are in the website README, admin guide, blog guide and search guide.
