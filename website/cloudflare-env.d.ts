declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    STUDIO_ADMIN_EMAILS?: string;
    BCA_FRONTEND_KEY?: string;
    BUCKET?: R2Bucket;
  }
}
