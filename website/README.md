# Bonire Concepts Art website

Automotive design studio website implemented from `Bonire_Concepts_Art_Website_Drawing_Plan.pdf` in the BCA repository.

## Included

- Responsive homepage, project collection, four individual vehicle pages and keyboard-accessible image lightboxes.
- Studio, partnerships, early supporters, contact, draft privacy and terms pages.
- Five enquiry types with project context, server validation, consent, spam honeypot, hourly rate limits and persistent D1 records.
- Restricted studio desk: enquiry inbox, review statuses, project content editing, grant/revoke access and JSON backup export.
- Authenticated project rooms with per-email, per-project, expiring, revocable grants.
- Private PDFs/images in R2. Every download re-checks authorization and uses private/no-store response headers. No private files enter public assets.
- Administrative and private download audit records.

## Development

Requires Node 22.13+, pnpm and the Vinext/Cloudflare runtime.

```sh
pnpm install
pnpm exec tsc --noEmit
python3 tests/check_integrity.py
pnpm build
```

For managed Sites development use the maintained Sites setup, install, build and publication helpers. `.openai/hosting.json` binds D1 as `DB` and R2 as `BUCKET`. SQL migrations live under `drizzle/` and are applied by Sites at deployment. A standalone host must configure equivalent bindings and apply the migrations separately.

## Administrator setup

Set the runtime variable `STUDIO_ADMIN_EMAILS` to a comma-separated list of approved ChatGPT sign-in emails. There is intentionally no first-visitor admin registration and no default admin. Until this variable is set, the desk and all administrative API actions deny access. Do not put credentials in source.

1. Sign in at `/admin` with an approved email.
2. Review requests in Inbox. Review status alone does not grant access.
3. Create an explicit time-limited grant in Access, then share the selected `/private/<project-slug>` URL with the approved reviewer.
4. Upload selected private materials in Materials. Any confidentiality agreement is handled separately.
5. Revoke a grant when needed. The next download fails even if the recipient knows its URL.

Content edits and enquiries persist without rebuilding. Current content management edits the seeded project entries and selects 1-5 existing curated assets. Adding entirely new projects or uploading new public imagery requires a source update in this version.

## Launch inputs still required

- Confirm final vehicle names, categories, summaries and evidence-based development stages. All projects start as Concept Design.
- Restore selected IRIN public imagery. The deleted private research PDF is not needed and should not be added as a public asset.
- Confirm studio administrator email, founder biography, studio contact and final legal/data retention details.
- Configure an email delivery provider if email notifications are required. The persistent studio inbox works independently; this version does not send notification email.
- Approve final supporter programme terms. No payments, automatic investments or public supporter listings are implemented.
- Browser-based responsive and form/access workflow QA is still required before a public launch. This environment did not expose the supported Sites browser controller.

## Assets and confidentiality

Only 16 selected public concept renders were optimized to WebP. The original repository's source renders and videos are retained. Full CAD, research, engineering files and source videos are not bundled into the website. `docs/asset-manifest.json` maps each curated asset to its original repository path.

## Backups

The authenticated studio desk exports structured enquiry, grant, material metadata, content and audit data. File bytes remain in R2 and need a separate object backup. There is no scheduled backup or restore interface in this version.
