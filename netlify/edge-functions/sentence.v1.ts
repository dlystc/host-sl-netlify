import { getCacheHeader } from "../_shared/cache-config.ts";
import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { spopSentence, parseSentenceEntry } from "../_shared/redis.ts";

const cacheHeader = getCacheHeader('SENTENCE_V1');

export default async (request: Request) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  const raw = await spopSentence();

  if (!raw) {
    return new Response("No sentences available", {
      status: 429,
      headers: { ...corsHeaders, 'Cache-Control': 'no-store' }
    });
  }

  const content = parseSentenceEntry(raw).content as string;

  return new Response(content, {
    headers: { ...corsHeaders, 'Netlify-CDN-Cache-Control': cacheHeader }
  });
};

export const config = {
  path: "/api/v1/sentence",
  cache: "manual"
};