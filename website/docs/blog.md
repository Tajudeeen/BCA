# Studio journal

Public routes: /blog, /blog/[slug], /blog/feed.xml. Only published rows are returned to the public routes, metadata, RSS and sitemap. Missing and draft slugs produce a 404. No sample articles or invented studio news are seeded.

Manage posts at /admin/blog, linked from Studio desk. The owner must configure STUDIO_ADMIN_EMAILS with approved sign-in emails. This value is intentionally not inferred from the owner account or public contact email. The editor requires ChatGPT sign-in and the same admin allowlist as the existing desk. POST /api/admin/blog also requires matching Origin.

The editor supports new posts, safe plain-text formatting, local article previews, approved cover selection with alt text, drafts, publish, update, and moving published articles back to drafts. URLs become fixed after saving. Concurrent edits and slug collisions return 409. First publication time is preserved, and public modification dates track saves. Use Studio desk Export backup to export all posts including drafts.

Formatting: blank lines separate blocks; ## introduces a heading; - introduces each list line; > introduces a quote. HTML is escaped by React. No embedded HTML or scripts are executed. Covers currently come from approved site assets, not arbitrary uploads. Studio articles use Bonire Concepts Art as organization author. No public comments or subscriptions collecting email addresses are included. RSS provides subscriptions through feed readers.

Public launch remains dependent on the site audience and final domain. Publicly available published articles receive canonical metadata, Article Open Graph data, BlogPosting JSON-LD and sitemap entries.
