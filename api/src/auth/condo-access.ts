import { ForbiddenException, NotFoundException } from '@nestjs/common';
import postgres from 'postgres';
import { JwtUser } from './jwt.strategy';

export async function cacheUser(sql: postgres.Sql, user: JwtUser) {
  if (!user?.sub || !user?.email) return;
  try {
    await sql`
      INSERT INTO usuarios_cache (id, email, nome)
      VALUES (${user.sub}, ${user.email}, ${user.nome || user.email})
      ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email, nome = EXCLUDED.nome, atualizado_em = NOW()
    `;
  } catch {
    /* silencioso — não bloquear request por falha de cache */
  }
}

export async function assertCondoAccess(sql: postgres.Sql, user: JwtUser, condoId: string) {
  const [c] = await sql<{ dono_id: string; bloqueado: boolean }[]>`
    SELECT dono_id, bloqueado FROM condominios WHERE id = ${condoId}
  `;
  if (!c) throw new NotFoundException('Condomínio não encontrado');
  if (user.role_global === 'superadmin') return c;
  if (c.dono_id !== user.sub) throw new ForbiddenException('Sem acesso a este condomínio');
  if (c.bloqueado) throw new ForbiddenException('Condomínio bloqueado');
  await cacheUser(sql, user);
  return c;
}
