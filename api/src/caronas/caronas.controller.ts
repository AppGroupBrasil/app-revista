import {
  Body, Controller, Delete, Get, Header, Inject, Ip, NotFoundException, Param, ParseUUIDPipe,
  Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import {
  IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength,
} from 'class-validator';
import { customAlphabet } from 'nanoid';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

const TIPOS = ['oferta', 'procura'] as const;
type Tipo = typeof TIPOS[number];
const gerarCodigo = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

class CriarPublicoDto {
  @IsEnum(TIPOS) tipo!: Tipo;
  @IsString() @MinLength(2) @MaxLength(200) origem!: string;
  @IsString() @MinLength(2) @MaxLength(200) destino!: string;
  @IsDateString() data_partida!: string;
  @IsString() @MaxLength(10) horario!: string;
  @IsOptional() @IsInt() @Min(1) vagas?: number;
  @IsOptional() @IsBoolean() recorrente?: boolean;
  @IsOptional() @IsNumber() @Min(0) valor?: number;
  @IsOptional() @IsString() @MaxLength(2000) observacoes?: string;
  @IsOptional() @IsString() @MaxLength(120) autor_nome?: string;
  @IsOptional() @IsString() @MaxLength(50) autor_unidade?: string;
  @IsOptional() @IsString() @MaxLength(120) autor_contato?: string;
}

class AtualizarDto {
  @IsOptional() @IsBoolean() ativo?: boolean;
  @IsOptional() @IsBoolean() publicado?: boolean;
}

@Controller('publico')
export class CaronasPublicasController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Post('condominios/:condoId/caronas')
  async criar(
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarPublicoDto,
    @Ip() ip: string,
  ) {
    const [c] = await this.sql<{ id: string }[]>`SELECT id FROM condominios WHERE id = ${condoId} AND bloqueado = false`;
    if (!c) throw new NotFoundException();
    const codigo = gerarCodigo();
    const [it] = await this.sql`
      INSERT INTO caronas
        (condominio_id, codigo, tipo, origem, destino, data_partida, horario, vagas,
         recorrente, valor, observacoes, autor_nome, autor_unidade, autor_contato, ip_origem)
      VALUES
        (${condoId}, ${codigo}, ${dto.tipo}, ${dto.origem}, ${dto.destino},
         ${dto.data_partida}, ${dto.horario}, ${dto.vagas ?? 1},
         ${dto.recorrente ?? false}, ${dto.valor ?? null}, ${dto.observacoes || null},
         ${dto.autor_nome || null}, ${dto.autor_unidade || null}, ${dto.autor_contato || null},
         ${ip || null})
      RETURNING id, codigo
    `;
    return { ok: true, codigo: it.codigo, id: it.id };
  }

  @Get('condominios/:condoId/caronas')
  @Header('Cache-Control', 'public, max-age=60, s-maxage=180')
  async listar(@Param('condoId', ParseUUIDPipe) condoId: string) {
    return this.sql`
      SELECT id, codigo, tipo, origem, destino, data_partida, horario, vagas,
             recorrente, valor, observacoes,
             autor_nome, autor_unidade, autor_contato, criado_em
      FROM caronas
      WHERE condominio_id = ${condoId} AND publicado = true AND ativo = true
        AND (recorrente = true OR data_partida >= CURRENT_DATE)
      ORDER BY recorrente DESC, data_partida ASC, horario ASC LIMIT 200
    `;
  }
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/caronas')
export class CaronasAdminController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT * FROM caronas WHERE condominio_id = ${condoId}
      ORDER BY data_partida DESC LIMIT 500
    `;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dto)) if (v !== undefined) updates[k] = v;
    if (Object.keys(updates).length === 0) {
      const [it] = await this.sql`SELECT * FROM caronas WHERE id = ${id} AND condominio_id = ${condoId}`;
      return it;
    }
    const [it] = await this.sql`
      UPDATE caronas SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId} RETURNING *
    `;
    return it;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM caronas WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
