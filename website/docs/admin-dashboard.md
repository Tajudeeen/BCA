# Studio Desk dashboard

Open `/sign-in` on the company website. Better Auth verifies the provisioned company email and password and persists an eight-hour owner session in the studio database. Secure HttpOnly SameSite cookies carry the session. The dashboard layout, data pages, mutations and backup export each check the owner session. Personal developer accounts and hosted ChatGPT identities have no administrator privilege. Public sign-up is disabled. `/sign-up` explains the private owner registration policy.

## Screens

- Overview: real database totals for enquiries, published/draft articles, active grants and private files. Recent enquiries, recent actions and shortcuts. These are studio records, not visitor analytics.
- Enquiries: server-side search, type/project/status filters and 20-row pagination. Open a record, reply through an email client, change review status, and save private notes. Notes and status use an optimistic revision check. An approved enquiry does not automatically grant access.
- Portfolio: edit the five existing project names, categories, summaries, full descriptions, phases and approved gallery selections. Project URLs, variants and concept films are preserved. Revision checks reject stale saves. Adding entirely new projects and arbitrary public asset uploads are not included.
- Blog posts: the existing protected draft/preview/publish/unpublish editor, integrated into the dashboard shell.
- Access grants: search/filter/paginate, grant access for 1 to 90 days, renew expiration from the current time, and revoke. Revoked grants cannot be renewed. Share the linked private room URL separately with the approved person.
- Private files: upload PDF/PNG/JPEG/WebP up to 10 MB, rename, download and remove. File signatures are checked against MIME type. Removal detaches database access before deleting the stored object. A failed object cleanup leaves no downloadable database record and is reported. File storage keys are omitted from dashboard list data.
- Activity log: searchable, paginated administrative actions and private downloads. Actor identifiers are account IDs, not fabricated names.
- Settings: current signed-in administrator, service binding availability, search resources and backup export. Password changes require the current password and revoke other sessions. Domain/audience changes and external search verification remain owner-managed. Service labels are not uptime checks.

## Safety and data

Mutations require matching Origin. Invalid actions and missing records return explicit errors. Concurrent enquiry/project edits return 409 rather than silently overwriting changes. Files require project-specific grants at download time. The application does not send enquiry replies or grant emails. Mail links open the administrator's email client.

The existing backup includes enquiry notes, grants, project content, blog posts, materials metadata and audit history. It contains private data. Stored file bytes are not included.

Migrations append notes and updated_at to enquiries with constant defaults, preserving existing rows. Refresh pulls current records. Unsaved review/project edits prompt before page unload, changing selections or manually refreshing. Blog drafts retain their existing unsaved-change protection.

## Verification

- tests/check-admin-dashboard.mjs: actual mutation handler with an isolated in-memory adapter, covering admin/origin denial, enquiry notes and stale revisions, grant creation/renew/revoke, cross-project asset rejection, content revisions, file signatures/rename/removal, audit calls and server rendering of all dashboard views.
- tests/check-admin-queries.mjs: actual Drizzle query builders against an in-memory SQLite adapter with all migrations applied. Verifies totals, search, combined filters, pagination clamping, grant states and exclusion of object keys.
- Existing blog and commission enquiry tests remain applicable.
- Run TypeScript, production builds and responsive signed-in workflow checks when releasing dashboard changes.

## Owner authentication deployment

Configure `BCA_OWNER_EMAIL`, `BCA_OWNER_PASSWORD_HASH` and `BCA_AUTH_SECRET` as protected backend environment variables, then deploy the authentication migration. The password hash uses Better Auth's password hasher. The initial account is inserted only when absent. Changing the password from Settings updates the credential in the database, and later deployments preserve it.

Vercel serves `/sign-in`, `/admin` and `/admin/blog` on the company domain. Server code forwards only allowlisted authentication and administrative paths to the fixed private backend using server-only service credentials. The browser never receives backend service credentials or identity-header privileges. The backend verifies owner sessions again for all data and file operations. Sign-in and password-change rate limits use shared database records.

The company owner's email/password login is independent of ChatGPT sign-in. Infrastructure account ownership and approved external private-room viewer identities are separate from company administrator access.

Password recovery by email requires a transactional email provider and is not enabled. The signed-in owner can change their password in Settings. Deployment operators can perform a controlled credential recovery when needed.
