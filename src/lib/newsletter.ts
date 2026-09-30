/**
 * EmasKuy — newsletter signup through a hosted email provider.
 *
 * The site is static, so the form posts straight to the provider's public
 * form endpoint (Kit, MailerLite, Buttondown… see .env.example). The
 * provider sends a confirmation email (double opt-in). Without
 * VITE_NEWSLETTER_ACTION the signup is hidden rather than faked.
 */

const ACTION = import.meta.env.VITE_NEWSLETTER_ACTION ?? '';
const EMAIL_FIELD = import.meta.env.VITE_NEWSLETTER_EMAIL_FIELD || 'email';
/** Extra fixed fields some providers require, URL-encoded ("a=1&b=2"). */
const EXTRA = import.meta.env.VITE_NEWSLETTER_EXTRA ?? '';

export const newsletterEnabled = /^https:\/\/\S+$/.test(ACTION);

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/**
 * POST the address to the provider. The response is opaque (no-cors), so
 * success means "request delivered"; the provider confirms by email.
 */
export async function subscribe(email: string): Promise<boolean> {
  if (!newsletterEnabled) return false;
  const body = new URLSearchParams(EXTRA);
  body.set(EMAIL_FIELD, email.trim());
  try {
    await fetch(ACTION, { method: 'POST', mode: 'no-cors', body });
    return true;
  } catch {
    return false;
  }
}
