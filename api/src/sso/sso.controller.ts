import { Body, Controller, Inject, Post, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IsString } from 'class-validator';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

// ─────────────────────────────────────────────────────────────────────────────
// SSO da central (App Condomínio) — login único.
// A central assina o token com a chave PRIVADA (RS256); aqui verificamos só pela
// chave PÚBLICA do JWKS — nada a vazar. Fluxo: o hub redireciona para
// ${site}/sso?token=<JWT curto> → a SPA faz POST /api/v1/sso { token } aqui →
// verifica RS256/JWKS → JIT upsert em usuarios_cache → re-emite um access_token
// LOCAL (HS256, mesmo formato do login da central: role_global + apps[]) que o
// front e a JwtStrategy já entendem. O id local É o sub (UUID) da central.
// ─────────────────────────────────────────────────────────────────────────────

const ISS = 'auth-central';
const APP_SLUG = 'app-revista';
const AUDIENCE = process.env.SSO_AUDIENCE || APP_SLUG;
const JWKS_URL = process.env.SSO_JWKS_URL || 'https://auth.appgroupbrasil.com.br/api/v1/sso/jwks.json';

const JWKS_TTL = 5 * 60 * 1000;
let jwksCache: Map<string, string> | null = null;
let jwksCacheAt = 0;

async function carregarJwks(): Promise<Map<string, string>> {
  if (jwksCache && Date.now() - jwksCacheAt < JWKS_TTL) return jwksCache;
  const res = await fetch(JWKS_URL, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`JWKS ${res.status}`);
  const body: any = await res.json();
  const pems = new Map<string, string>();
  for (const k of body.keys || []) {
    if (k.kty !== 'RSA') continue;
    const pem = crypto.createPublicKey({ key: k, format: 'jwk' }).export({ type: 'spki', format: 'pem' }) as string;
    pems.set(k.kid || 'default', pem);
  }
  jwksCache = pems;
  jwksCacheAt = Date.now();
  return pems;
}

function lerKid(token: string): string | null {
  try {
    const head = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8'));
    return head.kid || null;
  } catch { return null; }
}

async function verificarSso(token: string): Promise<any> {
  const pems = await carregarJwks();
  const kid = lerKid(token);
  const candidatos = kid && pems.has(kid) ? [pems.get(kid)!] : [...pems.values()];
  if (candidatos.length === 0) throw new Error('JWKS sem chave RSA');
  let ultimoErro: unknown;
  for (const pem of candidatos) {
    try {
      return jwt.verify(token, pem, { algorithms: ['RS256'], issuer: ISS, audience: AUDIENCE });
    } catch (e) { ultimoErro = e; }
  }
  throw ultimoErro || new Error('assinatura inválida');
}

class SsoDto {
  @IsString() token!: string;
}

@Controller('sso')
export class SsoController {
  constructor(
    @Inject(SQL) private sql: postgres.Sql,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  async trocar(@Body() dto: SsoDto) {
    if (!dto?.token) throw new BadRequestException('Token ausente');

    let c: any;
    try {
      c = await verificarSso(dto.token);
    } catch (err: any) {
      console.error('[SSO] falha:', err?.message || err);
      throw new UnauthorizedException('SSO inválido');
    }

    const sub = String(c.sub);
    const email = (c.email || '').toLowerCase().trim();
    const nome = c.nome || email || 'Usuário';

    await this.sql`
      INSERT INTO usuarios_cache (id, email, nome, atualizado_em)
      VALUES (${sub}, ${email}, ${nome}, NOW())
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, nome = EXCLUDED.nome, atualizado_em = NOW()
    `;

    const perfil = (c.perfil || '').toLowerCase();
    const role_global = perfil === 'master' || perfil === 'superadmin' ? 'superadmin' : 'usuario';
    const access_token = this.jwt.sign({
      sub,
      email,
      nome,
      role_global,
      apps: [{ slug: APP_SLUG, role: perfil || 'usuario', status: 'ativa', expira_em: null }],
    });

    return { access_token, refresh_token: '', usuario: { id: sub, email, nome } };
  }
}
