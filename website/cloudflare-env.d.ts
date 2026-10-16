declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    STUDIO_ADMIN_EMAILS?: string;
    STUDIO_FILM_IMPORT_TOKEN?: string;
    BUCKET?: R2Bucket;
  }
}
