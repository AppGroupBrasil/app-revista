import { Body, Controller, Get, Inject, Ip, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

const CONTEXTOS = ['chamado', 'evento', 'geral', 'funcionario'] as const;
type Contexto = typeof CONTEXTOS[number];

class CriarAvaliacaoDto {
  @IsOptional() @IsString() @MaxLength(120) autor_nome?: string;
  @IsOptional() @IsString() @MaxLength(50) autor_unidade?: string;
  @IsOptional() @IsEnum(CONTEXTOS) contexto?: Contexto;
  @IsOptional() @IsUUID() referencia_id?: string;
  @IsInt() @Min(1) @Max(5) nota!: number;
  @IsOptional() @IsString() @MaxLength(1000) comentario?: string;
}

class ModerarDto {
  @IsOptional() @IsBoolean() publicada?: boolean;
  @IsOptional() @IsBoolean() destaque?: boolean;
}

// ── Rota PÚBLICA (sem JWT) — qualquer pessoa pode avaliar
@Controller('publico/condominios/:condoId/avaliacoes')
export class AvaliacoesPublicasController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Post()
  async criar(
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarAvaliacaoDto,
    @Ip() ip: string,
  ) {
    const [c] = await this.sql<{ id: string }[]>`SELECT id FROM condominios WHERE id = ${condoId} AND bloqueado = false`;
    if (!c) return { ok: false };
    await this.sql`
      INSERT INTO avaliacoes (condominio_id, autor_nome, autor_unidade, contexto, referencia_id, nota, comentario, ip_origem)
      VALUES (${condoId}, ${dto.autor_nome || null}, ${dto.autor_unidade || null},
              ${dto.contexto || 'geral'}, ${dto.referencia_id || null},
              ${dto.nota}, ${dto.comentario || null}, ${ip || null})
    `;
    return { ok: true, message: 'Avaliação registrada. Será analisada antes de publicar.' };
  }

  @Get('mural')
  async mural(@Param('condoId', ParseUUIDPipe) condoId: string) {
    return this.sql`
      SELECT id, autor_nome, autor_unidade, contexto, nota, comentario, destaque, criado_em
      FROM avaliacoes
      WHERE condominio_id = ${condoId} AND publicada = true
      ORDER BY destaque DESC, criado_em DESC LIMIT 100
    `;
  }
}

// ── Rota ADMIN (JWT do dono ou superadmin)
@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/avaliacoes')
export class AvaliacoesAdminController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT * FROM avaliacoes WHERE condominio_id = ${condoId}
      ORDER BY criado_em DESC LIMIT 500
    `;
  }

  @Get('stats')
  async stats(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [s] = await this.sql<{ total: number; media: number | null; promotores: number; detratores: number }[]>`
      SELECT
        COUNT(*)::int AS total,
        AVG(nota)::numeric(3,2) AS media,
        COUNT(*) FILTER (WHERE nota >= 4)::int AS promotores,
        COUNT(*) FILTER (WHERE nota <= 2)::int AS detratores
      FROM avaliacoes WHERE condominio_id = ${condoId}
    `;
    const nps = s.total > 0 ? Math.round(((s.promotores - s.detratores) / s.total) * 100) : 0;
    return { ...s, nps };
  }

  @Patch(':id')
  async moderar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ModerarDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = { moderado_em: new Date(), moderado_por: req.user.sub };
    for (const [k, v] of Object.entries(dto)) if (v !== undefined) updates[k] = v;
    const [a] = await this.sql`
      UPDATE avaliacoes SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId}
      RETURNING *
    `;
    return a;
  }
}
