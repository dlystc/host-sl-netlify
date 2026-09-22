/**
 * Perform a SPOP from the Redis sentence pool and return the raw string.
 * Returns null when the pool is empty.
 */
export async function spopSentence(): Promise<string | null> {
  const redisUrl = Netlify.env.get('UPSTASH_REDIS_REST_URL');
  const redisToken = Netlify.env.get('UPSTASH_REDIS_REST_TOKEN');
  const redisSet = Netlify.env.get('UPSTASH_REDIS_SET') || 'dlystc:sentences:pool';

  const response: { result: string | null } = await (await fetch(`${redisUrl}/spop/${redisSet}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${redisToken}` }
  })).json();

  return response.result ?? null;
}

/**
 * Parse a raw Redis value into a sentence entry object.
 * The stored value is a JSON string: { content, source, author, created_at }.
 * Fallback: if raw is not valid JSON, wrap it as content-only.
 */
export function parseSentenceEntry(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw);
  } catch {
    return { content: raw, source: null, author: null, created_at: null };
  }
}