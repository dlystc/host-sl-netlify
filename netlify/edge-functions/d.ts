export default async (request: Request, context: { site: { url: string } }) => {
  try {
    const response = await fetch(`${context.site.url}/api/v1/sentence`);
    if (!response.ok) {
      return new Response('Debug proxy: upstream unavailable', {
        status: 502,
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    return response;
  } catch (err) {
    return new Response('Debug proxy: fetch failed', {
      status: 502,
      headers: { 'Cache-Control': 'no-store' }
    });
  }
};

export const config = {
  path: "/debug/stctext",
};