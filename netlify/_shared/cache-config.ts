const DEFAULT_MAX_AGE = 8;
const DEFAULT_STALE_DURATION = 60;

/**
 * Build the Netlify-CDN-Cache-Control header value from env vars.
 *
 * Global defaults (read from env):
 *   CACHE_MAX_AGE              — default max-age in seconds (default: 8)
 *   CACHE_STALE_WHILE_REVALIDATE — default stale-while-revalidate in seconds (default: 60)
 *
 * Per-function overrides (prefix e.g. SENTENCE_V1):
 *   CACHE_MAX_AGE_{PREFIX}
 *   CACHE_STALE_WHILE_REVALIDATE_{PREFIX}
 *
 * Falls back to the global default when the per-function override is not set or empty.
 */
export function getCacheHeader(prefix?: string): string {
  const globalMaxAge = Number(Netlify.env.get('CACHE_MAX_AGE')) || DEFAULT_MAX_AGE;
  const globalStale = Number(Netlify.env.get('CACHE_STALE_WHILE_REVALIDATE')) || DEFAULT_STALE_DURATION;

  let maxAge = globalMaxAge;
  let staleDuration = globalStale;

  if (prefix) {
    const overrideMaxAge = Number(Netlify.env.get(`CACHE_MAX_AGE_${prefix}`));
    const overrideStale = Number(Netlify.env.get(`CACHE_STALE_WHILE_REVALIDATE_${prefix}`));

    if (!Number.isNaN(overrideMaxAge)) maxAge = overrideMaxAge;
    if (!Number.isNaN(overrideStale)) staleDuration = overrideStale;
  }

  return `public, max-age=${maxAge}, stale-while-revalidate=${staleDuration}`;
}
