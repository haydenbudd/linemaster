import { projectId } from '/utils/supabase/info';

const PROXY_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a6e7a38d/image-proxy`;

// Routes linemaster.com images through the Supabase edge function proxy
// to avoid CORS/CSP issues in the Figma Make embedded iframe.
export function getProxiedImageUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('linemaster.com')) {
      return `${PROXY_BASE}?url=${encodeURIComponent(url)}`;
    }
  } catch {
    // Not a valid URL, return as-is
  }
  return url;
}
