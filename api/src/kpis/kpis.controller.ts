import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

class CriarKpiDto {
  @IsString() @MinLength(2) @MaxLength(100) rotulo!: string;
  @IsString() @MinLength(1) @MaxLength(50) valor!: string;
  @IsOptional() @IsString() @MaxLength(200) descricao?: string;
  @IsOptional() @IsString() @MaxLength(10) icone?: string;
  @IsOptional() @IsString() cor?: string;
  @IsOptional() @IsInt() ordem?: number;
}

class AtualizarKpiDto {
  @IsOptional() @IsString() rotulo?: string;
  @IsOptional() @IsString() valor?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() icone?: string;
  @IsOptional() @IsString() cor?: string;
  @IsOptional() @IsInt() ordem?: number;
  @IsOptional() @IsBoolean() visivel?: boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/kpis')
export class KpisController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`SELECT * FROM kpis WHERE condominio_id = ${condoId} ORDER BY ordem, criado_em`;
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarKpiDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [k] = await this.sql`
      INSERT INTO kpis (condominio_id, rotulo, valor, descricao, icone, cor, ordem)
      VALUES (${condoId}, ${dto.rotulo}, ${dto.valor}, ${dto.descricao || null},
              ${dto.icone || null}, ${dto.cor || 'primary'}, ${dto.ordem ?? 0})
      RETURNING *
    `;
    return k;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarKpiDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dto)) if (v !== undefined) updates[k] = v;
    if (Object.keys(updates).length === 0) return { ok: true };
    const [k] = await this.sql`
      UPDATE kpis SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId}
      RETURNING *
    `;
    return k;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM kpis WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
