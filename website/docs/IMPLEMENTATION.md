# Blueprint implementation

The six-page planning PDF calls for a studio presentation site, selective public galleries, manually reviewed access, commercial enquiry routes and supporter proposals. This build implements those visitor journeys without inventing production specifications or commercial claims.

## Public portfolio decisions

Orange Cruise is the initial hero, followed by AMI, Mace Freedomm and Ara 1. Repository folder names determine provisional naming. The PDF uses Orange Cruiser while the repository uses ORANGE CRUISE; the website currently follows the repository. AMI's category remains provisional. Ara 1's EV/CNG-labelled studies do not establish a validated powertrain.

IRIN is acknowledged as a planned portfolio item without a fabricated render. A founder profile will be added after approved biography text is supplied.

## Access boundary

Hosting remains owner-private for review. Studio administration additionally requires an authenticated email explicitly listed in STUDIO_ADMIN_EMAILS. These checks remain in place if the site audience is later changed. Viewer grants match normalized authenticated email, project, unrevoked state and future expiration. Private object keys are stored server-side. No direct R2 URLs are exposed.

No access is automatically granted on form submission or review-status change. Request records, access grants and confidentiality agreements have distinct meanings.

## Validation performed

TypeScript, production compilation, SQL migration application in SQLite and explicit grant-isolation/expiry/revocation checks. Asset integrity confirms all 16 selected renders exist. Browser QA and end-to-end hosted notification delivery have not been claimed.

## Further work before public launch

Approved identity/contact/legal content, real notification delivery, ability to add projects/upload curated public assets from the CMS, scheduled object/database backups with tested restore, configurable retention and deletion controls, and full authenticated role-based browser QA.
