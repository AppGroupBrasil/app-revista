import {
  Body, Controller, Delete, Get, Header, Inject, Ip, NotFoundException, Param, ParseUUIDPipe,
  Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import {
  IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength,
} from 'class-validator';
import { customAlphabet } from 'nanoid';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

const TIPOS = ['venda', 'aluguel', 'doacao', 'servico', 'outro'] as const;
type Tipo = typeof TIPOS[number];
const gerarCodigo = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

class CriarPublicoDto {
  @IsEnum(TIPOS) tipo!: Tipo;
  @IsString() @MinLength(3) @MaxLength(200) titulo!: string;
  @IsOptional() @IsString() @MaxLength(4000) descricao?: string;
  @IsOptional() @IsNumber() @Min(0) preco?: number;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsString() @MaxLength(120) autor_nome?: string;
  @IsOptional() @IsString() @MaxLength(50) autor_unidade?: string;
  @IsOptional() @IsString() @MaxLength(120) autor_contato?: string;
}

class AtualizarDto {
  @IsOptional() @IsBoolean() publicado?: boolean;
  @IsOptional() @IsBoolean() ativo?: boolean;
  @IsOptional() @IsEnum(TIPOS) tipo?: Tipo;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(200) titulo?: string;
  @IsOptional() @IsString() @MaxLength(4000) descricao?: string;
  @IsOptional() @IsNumber() @Min(0) preco?: number;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
}

@Controller('publico')
export class ClassificadosPublicosController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Post('condominios/:condoId/classificados')
  async criar(
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarPublicoDto,
    @Ip() ip: string,
  ) {
    const [c] = await this.sql<{ id: string }[]>`
      SELECT id FROM condominios WHERE id = ${condoId} AND bloqueado = false
    `;
    if (!c) throw new NotFoundException();
    const codigo = gerarCodigo();
    const [it] = await this.sql`
      INSERT INTO classificados
        (condominio_id, codigo, tipo, titulo, descricao, preco, fotos,
         autor_nome, autor_unidade, autor_contato, ip_origem)
      VALUES
        (${condoId}, ${codigo}, ${dto.tipo}, ${dto.titulo}, ${dto.descricao || null},
         ${dto.preco ?? null}, ${this.sql.json(dto.fotos || [])},
         ${dto.autor_nome || null}, ${dto.autor_unidade || null}, ${dto.autor_contato || null},
         ${ip || null})
      RETURNING id, codigo
    `;
    return { ok: true, codigo: it.codigo, id: it.id, message: 'Anúncio recebido. Aguarda moderação.' };
  }

  @Get('condominios/:condoId/classificados')
  @Header('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
  async listar(@Param('condoId', ParseUUIDPipe) condoId: string) {
    return this.sql`
      SELECT id, codigo, tipo, titulo, descricao, preco, fotos,
             autor_nome, autor_unidade, autor_contato, criado_em
      FROM classificados
      WHERE condominio_id = ${condoId} AND publicado = true AND ativo = true AND expira_em > NOW()
      ORDER BY criado_em DESC LIMIT 200
    `;
  }
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/classificados')
export class ClassificadosAdminController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT * FROM classificados WHERE condominio_id = ${condoId}
      ORDER BY publicado ASC, criado_em DESC LIMIT 500
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
    for (const [k, v] of Object.entries(dto)) {
      if (v === undefined) continue;
      updates[k] = k === 'fotos' ? this.sql.json(v as string[]) : v;
    }
    if (Object.keys(updates).length === 0) {
      const [it] = await this.sql`SELECT * FROM classificados WHERE id = ${id} AND condominio_id = ${condoId}`;
      return it;
    }
    const [it] = await this.sql`
      UPDATE classificados SET ${this.sql(updates)}
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
    await this.sql`DELETE FROM classificados WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
