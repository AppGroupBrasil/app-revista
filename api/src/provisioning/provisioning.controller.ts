import { Body, Controller, Headers, Inject, Post, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IsString, IsUUID, IsOptional, IsEmail } from 'class-validator';
import { timingSafeEqual } from 'crypto';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

function secretValido(recebido: string | undefined, esperado: string): boolean {
  if (!recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

class ProvisioningUsuarioDto {
  @IsUUID() usuario_id!: string;
  @IsEmail() email!: string;
  @IsString() nome!: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() expira_em?: string | null;
  @IsOptional() metadata?: Record<string, unknown>;
}

@Controller('provisioning')
export class ProvisioningController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Post('usuario')
  async receber(
    @Body() dto: ProvisioningUsuarioDto,
    @Headers('x-provisioning-secret') secret?: string,
  ) {
    const expected = process.env.PROVISIONING_SECRET || process.env.WEBHOOK_SECRET;
    if (!expected) throw new BadRequestException('PROVISIONING_SECRET não configurado');
    if (!secretValido(secret, expected)) throw new ForbiddenException('Assinatura inválida');

    if (!dto.usuario_id || !dto.email || !dto.nome) {
      throw new BadRequestException('Campos obrigatórios ausentes');
    }
    await this.sql`
      INSERT INTO usuarios_cache (id, email, nome, atualizado_em)
      VALUES (${dto.usuario_id}, ${dto.email}, ${dto.nome}, NOW())
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, nome = EXCLUDED.nome, atualizado_em = NOW()
    `;
    await this.sql`
      INSERT INTO provisioning_log (evento, usuario_id, payload)
      VALUES (${'usuario_provisionado'}, ${dto.usuario_id}, ${this.sql.json({ ...dto } as postgres.JSONValue)})
    `;
    return { ok: true, usuario_id: dto.usuario_id };
  }

  // Receiver do push de cadastro da central (Fase 2 SSO). Espelho read-only:
  // usuarios_cache (casa por email). upsert atualiza nome; delete revoga
  // removendo a linha. Idempotente; nunca cria usuário (entra por SSO).
  @Post('cadastro')
  async cadastro(
    @Body() ev: any,
    @Headers('x-provisioning-secret') secret?: string,
  ) {
    const expected = process.env.PROVISIONING_SECRET || process.env.WEBHOOK_SECRET;
    if (!expected) throw new BadRequestException('PROVISIONING_SECRET não configurado');
    if (!secretValido(secret, expected)) throw new ForbiddenException('Assinatura inválida');
    const d = ev?.dados || {};
    if (ev?.entidade === 'morador' || ev?.entidade === 'funcionario') {
      const email = String(d.email || '').toLowerCase().trim();
      if (!email) return { ok: true, ignorado: 'sem email' };
      if (ev.acao === 'delete') {
        await this.sql`DELETE FROM usuarios_cache WHERE lower(email) = ${email}`;
        return { ok: true };
      }
      if (d.nome) {
        await this.sql`UPDATE usuarios_cache SET nome = ${d.nome}, atualizado_em = NOW() WHERE lower(email) = ${email}`;
      }
      return { ok: true };
    }
    return { ok: true, ignorado: ev?.entidade };
  }
}
