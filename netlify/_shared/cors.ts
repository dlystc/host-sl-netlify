export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/**
 * Handle OPTIONS preflight request.
 * Returns a Response (204) if it is an OPTIONS request, or null to continue.
 */
export function handleOptions(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  return null;
}

/**
 * Build a no-store error response with CORS headers.
 */
export function errorResponse(body: string | Record<string, unknown>, status: number, extraHeaders?: Record<string, string>): Response {
  const isJson = typeof body !== 'string';
  const bodyString = isJson ? JSON.stringify(body) : body;
  return new Response(bodyString, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': isJson ? 'application/json' : 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    }
  });
}