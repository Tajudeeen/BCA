declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BCA_OWNER_EMAIL?: string;
    BCA_OWNER_PASSWORD_HASH?: string;
    BCA_AUTH_SECRET?: string;
    BCA_FRONTEND_KEY?: string;
    BUCKET?: R2Bucket;
  }
}
