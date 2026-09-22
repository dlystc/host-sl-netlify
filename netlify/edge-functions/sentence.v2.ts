import { getCacheHeader } from "../_shared/cache-config.ts";
import { corsHeaders, handleOptions, errorResponse } from "../_shared/cors.ts";
import { spopSentence, parseSentenceEntry } from "../_shared/redis.ts";

const cacheHeader = getCacheHeader('SENTENCE_V2');

export default async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  const raw = await spopSentence();

  if (!raw) {
    return errorResponse({ error: 'No sentences available' }, 429);
  }

  const entry = parseSentenceEntry(raw);

  return new Response(JSON.stringify(entry), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Netlify-CDN-Cache-Control': cacheHeader
    }
  });
};

export const config = {
  path: "/api/v2/sentence",
  cache: "manual"
};