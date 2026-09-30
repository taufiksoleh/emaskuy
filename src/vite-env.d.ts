/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Newsletter provider form endpoint (https). Unset → signup hidden. */
  readonly VITE_NEWSLETTER_ACTION?: string;
  /** Name of the email field the provider expects (default "email"). */
  readonly VITE_NEWSLETTER_EMAIL_FIELD?: string;
  /** Extra fixed form fields, URL-encoded. */
  readonly VITE_NEWSLETTER_EXTRA?: string;
  /** Cloudflare Web Analytics beacon token. Unset → no analytics. */
  readonly VITE_CF_BEACON_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
