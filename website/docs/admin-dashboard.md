# Studio Desk dashboard

Open /admin. ChatGPT sign-in and the existing STUDIO_ADMIN_EMAILS allowlist are required. Both the shared layout and data pages enforce access. Every mutation and backup export separately checks administrator access. The owner must supply the approved sign-in email(s) before activation. No account has been automatically promoted.

## Screens

- Overview: real database totals for enquiries, published/draft articles, active grants and private files. Recent enquiries, recent actions and shortcuts. These are studio records, not visitor analytics.
- Enquiries: server-side search, type/project/status filters and 20-row pagination. Open a record, reply through an email client, change review status, and save private notes. Notes and status use an optimistic revision check. An approved enquiry does not automatically grant access.
- Portfolio: edit the five existing project names, categories, summaries, full descriptions, phases and approved gallery selections. Project URLs, variants and concept films are preserved. Revision checks reject stale saves. Adding entirely new projects and arbitrary public asset uploads are not included.
- Blog posts: the existing protected draft/preview/publish/unpublish editor, integrated into the dashboard shell.
- Access grants: search/filter/paginate, grant access for 1 to 90 days, renew expiration from the current time, and revoke. Revoked grants cannot be renewed. Share the linked private room URL separately with the approved person.
- Private files: upload PDF/PNG/JPEG/WebP up to 10 MB, rename, download and remove. File signatures are checked against MIME type. Removal detaches database access before deleting the stored object. A failed object cleanup leaves no downloadable database record and is reported. File storage keys are omitted from dashboard list data.
- Activity log: searchable, paginated administrative actions and private downloads. Actor identifiers are account IDs, not fabricated names.
- Settings: current signed-in administrator, service binding availability, search resources and backup export. Domain/audience changes, administrator provisioning and external search verification remain owner-managed. Service labels are not uptime checks.

## Safety and data

Mutations require matching Origin. Invalid actions and missing records return explicit errors. Concurrent enquiry/project edits return 409 rather than silently overwriting changes. Files require project-specific grants at download time. The application does not send enquiry replies or grant emails. Mail links open the administrator's email client.

The existing backup includes enquiry notes, grants, project content, blog posts, materials metadata and audit history. It contains private data. Stored file bytes are not included.

Migrations append notes and updated_at to enquiries with constant defaults, preserving existing rows. Refresh pulls current records. Unsaved review/project edits prompt before page unload, changing selections or manually refreshing. Blog drafts retain their existing unsaved-change protection.

## Verification

- tests/check-admin-dashboard.mjs: actual mutation handler with an isolated in-memory adapter, covering admin/origin denial, enquiry notes and stale revisions, grant creation/renew/revoke, cross-project asset rejection, content revisions, file signatures/rename/removal, audit calls and server rendering of all dashboard views.
- tests/check-admin-queries.mjs: actual Drizzle query builders against an in-memory SQLite adapter with all migrations applied. Verifies totals, search, combined filters, pagination clamping, grant states and exclusion of object keys.
- Existing blog and commission enquiry tests remain applicable.
- TypeScript and the production build must pass before deployment. Browser visual/interactive QA is unavailable in the current managed environment. Authenticated production dashboard interaction is pending approved administrator configuration.
