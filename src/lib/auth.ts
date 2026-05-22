// Cliente do auth-central (https://auth.appgroupbrasil.com.br)

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.appgroupbrasil.com.br/api/v1';
const APP_SLUG = 'app-revista';

export interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  role_global: 'superadmin' | 'usuario';
  apps: Array<{ slug: string; role: string; status: string; expira_em: string | null }>;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  usuario: { id: string; email: string; nome: string };
}

const STORAGE = {
  access: 'apprevista:access_token',
  refresh: 'apprevista:refresh_token',
};

export const tokens = {
  get access() { return typeof window === 'undefined' ? null : localStorage.getItem(STORAGE.access); },
  get refresh() { return typeof window === 'undefined' ? null : localStorage.getItem(STORAGE.refresh); },
  set(access: string, refresh: string) {
    localStorage.setItem(STORAGE.access, access);
    localStorage.setItem(STORAGE.refresh, refresh);
  },
  clear() {
    localStorage.removeItem(STORAGE.access);
    localStorage.removeItem(STORAGE.refresh);
  },
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return null; }
}

export function hasAccess(payload: JwtPayload | null): boolean {
  if (!payload) return false;
  if (payload.role_global === 'superadmin') return true;
  const lic = payload.apps?.find(a => a.slug === APP_SLUG);
  return !!lic && (lic.status === 'ativa' || lic.status === 'trial');
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const r = await fetch(`${AUTH_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({ message: 'Erro no login' }));
    throw new Error(e.message || 'Credenciais inválidas');
  }
  const data = await r.json();
  tokens.set(data.access_token, data.refresh_token);
  return data;
}

export async function registrar(input: { email: string; senha: string; nome: string; telefone?: string }) {
  const r = await fetch(`${AUTH_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, app_slug: APP_SLUG }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({ message: 'Erro no cadastro' }));
    const err = new Error(e.message || 'Falha ao cadastrar') as Error & { status?: number };
    err.status = r.status;
    throw err;
  }
  return r.json();
}

export async function logout() {
  const refresh_token = tokens.refresh;
  if (refresh_token) {
    await fetch(`${AUTH_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    }).catch(() => {});
  }
  tokens.clear();
}

export async function refresh(): Promise<string | null> {
  const refresh_token = tokens.refresh;
  if (!refresh_token) return null;
  const r = await fetch(`${AUTH_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  });
  if (!r.ok) { tokens.clear(); return null; }
  const data = await r.json();
  tokens.set(data.access_token, data.refresh_token);
  return data.access_token;
}
