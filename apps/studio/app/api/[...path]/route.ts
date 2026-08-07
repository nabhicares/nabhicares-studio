// ponytail: one serverless fn for all /api/* — Hobby plan caps at 12 functions.
import { NextRequest } from 'next/server';
import { json } from '@/lib/api';

export const runtime = 'nodejs';

type Ctx = { params: { path: string[] } };
type Handler = (
  req: NextRequest,
  ctx?: { params: Record<string, string> },
) => Promise<Response>;

async function dispatch(
  req: NextRequest,
  { params }: Ctx,
): Promise<Response> {
  const p = params.path ?? [];
  const [a, b, c, d] = p;
  const method = req.method.toUpperCase();

  const call = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modPromise: Promise<any>,
    name: string,
    routeParams?: Record<string, string>,
  ): Promise<Response> => {
    const mod = await modPromise;
    const fn = mod[name] as Handler | undefined;
    if (!fn) return json({ error: `Method ${name} not allowed` }, 405);
    if (routeParams) return fn(req, { params: routeParams });
    return fn(req);
  };

  if (a === 'auth' && b === 'login' && !c) {
    return call(import('@/lib/api-handlers/auth-login'), method);
  }
  if (a === 'auth' && b === 'logout' && !c) {
    return call(import('@/lib/api-handlers/auth-logout'), method);
  }
  if (a === 'auth' && b === 'me' && !c) {
    return call(import('@/lib/api-handlers/auth-me'), method);
  }

  if (a === 'hospitals' && !b) {
    return call(import('@/lib/api-handlers/hospitals'), method);
  }

  if (a === 'hospitals' && b) {
    const hospitalId = b;
    if (c === 'pages' && d === 'reorder' && !p[4]) {
      return call(import('@/lib/api-handlers/hospital-pages-reorder'), method, {
        hospitalId,
      });
    }
    if (c === 'pages' && !d) {
      return call(import('@/lib/api-handlers/hospital-pages'), method, {
        hospitalId,
      });
    }
    if (c === 'design' && !d) {
      return call(import('@/lib/api-handlers/hospital-design'), method, {
        hospitalId,
      });
    }
    if (c === 'media' && !d) {
      return call(import('@/lib/api-handlers/hospital-media'), method, {
        hospitalId,
      });
    }
    if (c === 'preview' && !d) {
      return call(import('@/lib/api-handlers/hospital-preview'), method, {
        hospitalId,
      });
    }
    if (c === 'publish' && !d) {
      return call(import('@/lib/api-handlers/hospital-publish'), method, {
        hospitalId,
      });
    }
    if (c === 'rollback' && !d) {
      return call(import('@/lib/api-handlers/hospital-rollback'), method, {
        hospitalId,
      });
    }
    if (c === 'import-bundle' && !d) {
      return call(import('@/lib/api-handlers/hospital-import-bundle'), method, {
        hospitalId,
      });
    }
    if (c === 'appointment-requests' && d && !p[4]) {
      return call(import('@/lib/api-handlers/hospital-appointment-request'), method, {
        hospitalId,
        requestId: d,
      });
    }
    if (c === 'appointment-requests' && !d) {
      return call(import('@/lib/api-handlers/hospital-appointment-requests'), method, {
        hospitalId,
      });
    }
    if (!c) {
      return call(import('@/lib/api-handlers/hospital'), method, { hospitalId });
    }
  }

  if (a === 'public' && b === 'hospitals' && c && d === 'appointment-requests' && !p[4]) {
    return call(import('@/lib/api-handlers/public-appointment-requests'), method, {
      slug: c,
    });
  }

  if (a === 'pages' && b) {
    const pageId = b;
    if (c === 'sections' && !d) {
      return call(import('@/lib/api-handlers/page-sections'), method, { pageId });
    }
    if (c === 'reorder' && !d) {
      return call(import('@/lib/api-handlers/page-reorder'), method, { pageId });
    }
    if (!c) {
      return call(import('@/lib/api-handlers/page'), method, { pageId });
    }
  }

  if (a === 'sections' && b) {
    const sectionId = b;
    if (c === 'duplicate' && !d) {
      return call(import('@/lib/api-handlers/section-duplicate'), method, {
        sectionId,
      });
    }
    if (!c) {
      return call(import('@/lib/api-handlers/section'), method, { sectionId });
    }
  }

  if (a === 'publishes' && b && !c) {
    return call(import('@/lib/api-handlers/publish'), method, {
      publishId: b,
    });
  }

  if (a === 'section-types' && !b) {
    return call(import('@/lib/api-handlers/section-types'), method);
  }
  if (a === 'templates' && !b) {
    return call(import('@/lib/api-handlers/templates'), method);
  }

  return json({ error: 'Not found' }, 404);
}

export const GET = dispatch;
export const POST = dispatch;
export const PUT = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
export const OPTIONS = dispatch;
