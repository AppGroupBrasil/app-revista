// Cliente da apprevista-api (backend próprio)
import { tokens, refresh } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.apprevista.com.br/api/v1';

async function call(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const headers = new Headers(init.headers || {});
  if (!(init.body instanceof FormData) && init.body) headers.set('Content-Type', 'application/json');
  const t = tokens.access;
  if (t) headers.set('Authorization', `Bearer ${t}`);

  const r = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (r.status === 401 && retry) {
    const newToken = await refresh();
    if (newToken) return call(path, init, false);
  }
  return r;
}

export const api = {
  get: <T>(path: string) => call(path).then(handle<T>),
  post: <T>(path: string, body?: unknown) => call(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }).then(handle<T>),
  patch: <T>(path: string, body?: unknown) => call(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }).then(handle<T>),
  delete: <T>(path: string) => call(path, { method: 'DELETE' }).then(handle<T>),
};

async function handle<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const e = await r.json().catch(() => ({ message: r.statusText }));
    throw new Error(e.message || 'Erro na API');
  }
  return r.json();
}
