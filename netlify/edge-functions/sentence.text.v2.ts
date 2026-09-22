import { getCacheHeader } from "../_shared/cache-config.ts";
import { corsHeaders, handleOptions } from "../_shared/cors.ts";

const FULL_TEMPLATE = '{content} {author} {source}';
const DEFAULT_TEMPLATE = '{content}';

const cacheHeader = getCacheHeader('SENTENCE_TEXT_V2');

export default async (request: Request, context: { site: { url: string } }) => {
  const preflight = handleOptions(request);
  if (preflight) return preflight;

  const url = new URL(request.url);
  const format = url.searchParams.get('format') || DEFAULT_TEMPLATE;
  const template = format === 'full' ? FULL_TEMPLATE : format;

  const v2Response = await fetch(`${context.site.url}/api/v2/sentence`);
  if (!v2Response.ok) {
    return new Response('Upstream unavailable', {
      status: 502,
      headers: { ...corsHeaders, 'Cache-Control': 'no-store' }
    });
  }

  let entry: Record<string, unknown>;
  try {
    entry = await v2Response.json();
  } catch {
    return new Response('Invalid upstream response', {
      status: 502,
      headers: { ...corsHeaders, 'Cache-Control': 'no-store' }
    });
  }

  const result = template.replace(/\{(\w+)\}/g, (_, field: string) => {
    const value = entry[field];
    return value != null ? String(value) : '';
  });

  return new Response(result, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'Netlify-CDN-Cache-Control': cacheHeader
    }
  });
};

export const config = {
  path: "/api/v2/sentence/text",
  cache: "manual"
};