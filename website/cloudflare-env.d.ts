declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    STUDIO_ADMIN_EMAILS?: string;
    BUCKET?: R2Bucket;
  }
}
