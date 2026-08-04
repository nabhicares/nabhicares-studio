import { CSRF_HEADER, CSRF_HEADER_VALUE } from '@/lib/csrf';

/** fetch() for Studio mutations — always sends CSRF marker header. */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const headers = new Headers(init?.headers);
  if (method !== 'GET' && method !== 'HEAD') {
    headers.set(CSRF_HEADER, CSRF_HEADER_VALUE);
  }
  return fetch(input, { ...init, headers, credentials: init?.credentials ?? 'same-origin' });
}
