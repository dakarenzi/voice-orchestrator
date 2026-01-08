
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';

export const GET: RequestHandler = async ({ params, platform }) => {
  const { id } = params; // This is the session_id
  const bucket = platform?.env?.BUCKET;

  if (!bucket) {
    return new Response('Storage not configured', { status: 500 });
  }

  try {
    const object = await bucket.get(`recordings/${id}.wav`);

    if (!object) {
      return new Response('Recording not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'private, max-age=3600');

    return new Response(object.body, {
      headers,
    });
  } catch (e: any) {
    logger.error('Failed to fetch recording', { id, error: e.message });
    return new Response('Internal Error', { status: 500 });
  }
};
