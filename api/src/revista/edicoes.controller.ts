import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

class CriarEdicaoDto {
  @IsInt() @Min(1) numero!: number;
  @IsString() titulo!: string;
  @IsOptional() @IsString() mes?: string;
  @IsOptional() @IsInt() ano?: number;
  @IsOptional() @IsString() capa_url?: string;
  @IsOptional() @IsString() theme_color?: string;
  @IsOptional() @IsString() accent_color?: string;
}

class AtualizarEdicaoDto {
  @IsOptional() @IsString() titulo?: string;
  @IsOptional() @IsString() mes?: string;
  @IsOptional() @IsInt() ano?: number;
  @IsOptional() @IsString() capa_url?: string;
  @IsOptional() @IsString() theme_color?: string;
  @IsOptional() @IsString() accent_color?: string;
  @IsOptional() @IsBoolean() publicada?: boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/edicoes')
export class EdicoesController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`SELECT * FROM edicoes WHERE condominio_id = ${condoId} ORDER BY numero DESC`;
  }

  @Get(':id')
  async detalhe(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [e] = await this.sql`SELECT * FROM edicoes WHERE id = ${id} AND condominio_id = ${condoId}`;
    const secoes = await this.sql`SELECT * FROM secoes WHERE edicao_id = ${id} ORDER BY ordem, criado_em`;
    return { ...e, secoes };
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarEdicaoDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [e] = await this.sql`
      INSERT INTO edicoes (condominio_id, numero, titulo, mes, ano, capa_url, theme_color, accent_color)
      VALUES (${condoId}, ${dto.numero}, ${dto.titulo},
              ${dto.mes || null}, ${dto.ano || null},
              ${dto.capa_url || null}, ${dto.theme_color || '#1E3A5F'}, ${dto.accent_color || '#D4AF37'})
      RETURNING *
    `;
    return e;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarEdicaoDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = { ...dto };
    if (dto.publicada === true) updates.publicada_em = new Date();
    if (Object.keys(updates).length === 0) return { ok: true };
    const [e] = await this.sql`
      UPDATE edicoes SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId}
      RETURNING *
    `;
    return e;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM edicoes WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
