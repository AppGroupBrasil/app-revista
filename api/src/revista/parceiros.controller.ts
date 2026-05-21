import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

const TIPOS = ['fornecedor', 'parceiro', 'prestador'] as const;
type Tipo = typeof TIPOS[number];

class CriarParceiroDto {
  @IsEnum(TIPOS) tipo!: Tipo;
  @IsString() @MaxLength(150) nome!: string;
  @IsOptional() @IsString() @MaxLength(300) descricao?: string;
  @IsOptional() @IsString() @MaxLength(80) categoria?: string;
  @IsOptional() @IsString() logo_url?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsUrl() link?: string;
  @IsOptional() @IsBoolean() destaque?: boolean;
  @IsOptional() @IsInt() ordem?: number;
}

class AtualizarParceiroDto {
  @IsOptional() @IsEnum(TIPOS) tipo?: Tipo;
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() categoria?: string;
  @IsOptional() @IsString() logo_url?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsUrl() link?: string;
  @IsOptional() @IsBoolean() destaque?: boolean;
  @IsOptional() @IsInt() ordem?: number;
  @IsOptional() @IsBoolean() ativo?: boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/parceiros')
export class ParceirosController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`SELECT * FROM parceiros WHERE condominio_id = ${condoId} ORDER BY destaque DESC, ordem, nome`;
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarParceiroDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [p] = await this.sql`
      INSERT INTO parceiros (condominio_id, tipo, nome, descricao, categoria, logo_url, telefone, whatsapp, link, destaque, ordem)
      VALUES (${condoId}, ${dto.tipo}, ${dto.nome}, ${dto.descricao || null}, ${dto.categoria || null},
              ${dto.logo_url || null}, ${dto.telefone || null}, ${dto.whatsapp || null}, ${dto.link || null},
              ${dto.destaque ?? false}, ${dto.ordem ?? 0})
      RETURNING *
    `;
    return p;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarParceiroDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = { ...dto };
    if (Object.keys(updates).length === 0) return { ok: true };
    const [p] = await this.sql`
      UPDATE parceiros SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId}
      RETURNING *
    `;
    return p;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM parceiros WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
