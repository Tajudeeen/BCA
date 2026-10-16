# Blueprint implementation

The six-page planning PDF calls for a studio presentation site, selective public galleries, manually reviewed access, commercial enquiry routes and supporter proposals. This build implements those visitor journeys without inventing production specifications or commercial claims.

## Public portfolio decisions

Orange Cruise is the initial hero, followed by IRIN, AMI, Mace Freedomm and Ara 1. Repository folder names determine provisional naming. The PDF uses Orange Cruiser while the repository uses ORANGE CRUISE; the website currently follows the repository. AMI's category remains provisional. Ara 1's EV/CNG-labelled studies do not establish a validated powertrain.

IRIN is integrated as a minibus / shared mobility concept, using four restored repository renders. Its detailed research PDF and drawings remain outside the public website bundle. A founder profile will be added after approved biography text is supplied.

## Access boundary

Hosting remains owner-private for review. Studio administration additionally requires an authenticated email explicitly listed in STUDIO_ADMIN_EMAILS. These checks remain in place if the site audience is later changed. Viewer grants match normalized authenticated email, project, unrevoked state and future expiration. Private object keys are stored server-side. No direct R2 URLs are exposed.

No access is automatically granted on form submission or review-status change. Request records, access grants and confidentiality agreements have distinct meanings.

## Validation performed

TypeScript, production compilation, SQL migration application in SQLite and explicit grant-isolation/expiry/revocation checks. Asset integrity confirms all 20 selected renders exist. Browser QA and end-to-end hosted notification delivery have not been claimed.

## Further work before public launch

Approved identity/contact/legal content, real notification delivery, ability to add projects/upload curated public assets from the CMS, scheduled object/database backups with tested restore, configurable retention and deletion controls, and full authenticated role-based browser QA.


## Concept film integration

Three original animations were recovered from the repository's pre-LFS commit and verified against the current LFS SHA-256 pointers. Optimized derivatives preserve duration and audio, use browser-compatible H.264/AAC with fast-start metadata, and are served from R2 rather than embedded in the Git repository. Seek requests use HTTP byte ranges. Source MP4s total approximately 133 MB; the web derivatives total approximately 32 MB.

The IRIN video exists as an LFS pointer but the media retrieval returned 404. Its original bytes were not recovered, so no IRIN video is represented as working. The gallery remains available.
