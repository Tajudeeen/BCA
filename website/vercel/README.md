# BCA Vercel website

This native Next.js build serves BCA’s public website on Vercel. `prepare.mjs` derives pages, components and assets from the main website source, preserving the approved design and content.

Project settings: Root `website/vercel`, source files outside root enabled, Next.js framework, Node 22.x, `npm install`, `npm run build`, default output directory.

Server-only sensitive variables: `BCA_BACKEND_SERVICE_TOKEN` supplies service access to the existing private studio backend. `BCA_FRONTEND_KEY` authorizes the limited public-content/enquiry bridge. `BCA_PUBLIC_ORIGIN` defines canonical public URLs. Credentials never enter browser code.

Public pages read project and published article data through the bridge. Enquiries use the existing validated database workflow. Films stream through range-aware routes. Admin and private-room links redirect to the existing authenticated Studio Desk. Public request identity headers are never trusted or forwarded. D1 records and R2 media remain in their existing services.

Run `npm install` and `npm run build` here for native `.next` output. Generated application directories and build artifacts are ignored. Runtime backend credentials are needed for dynamic content, forms and films.
