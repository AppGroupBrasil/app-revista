import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

const CATEGORIAS = ['obra', 'manutencao', 'evento', 'aviso', 'conquista'] as const;
type Categoria = typeof CATEGORIAS[number];

class CriarPostDto {
  @IsEnum(CATEGORIAS) categoria!: Categoria;
  @IsString() @MinLength(3) titulo!: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsBoolean() antes_depois?: boolean;
  @IsOptional() @IsBoolean() publicado?: boolean;
}

class AtualizarPostDto {
  @IsOptional() @IsEnum(CATEGORIAS) categoria?: Categoria;
  @IsOptional() @IsString() @MinLength(3) titulo?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsBoolean() antes_depois?: boolean;
  @IsOptional() @IsBoolean() publicado?: boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/posts')
export class DiarioController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Query('categoria') categoria?: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    if (categoria && CATEGORIAS.includes(categoria as Categoria)) {
      return this.sql`
        SELECT * FROM posts WHERE condominio_id = ${condoId} AND categoria = ${categoria}
        ORDER BY criado_em DESC LIMIT 200
      `;
    }
    return this.sql`
      SELECT * FROM posts WHERE condominio_id = ${condoId}
      ORDER BY criado_em DESC LIMIT 200
    `;
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarPostDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [p] = await this.sql`
      INSERT INTO posts (condominio_id, autor_id, categoria, titulo, descricao, fotos, antes_depois, publicado)
      VALUES (${condoId}, ${req.user.sub}, ${dto.categoria}, ${dto.titulo},
              ${dto.descricao || null}, ${this.sql.json(dto.fotos || [])},
              ${dto.antes_depois ?? false}, ${dto.publicado ?? true})
      RETURNING *
    `;
    return p;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarPostDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = {};
    if (dto.categoria !== undefined) updates.categoria = dto.categoria;
    if (dto.titulo !== undefined) updates.titulo = dto.titulo;
    if (dto.descricao !== undefined) updates.descricao = dto.descricao;
    if (dto.fotos !== undefined) updates.fotos = this.sql.json(dto.fotos);
    if (dto.antes_depois !== undefined) updates.antes_depois = dto.antes_depois;
    if (dto.publicado !== undefined) updates.publicado = dto.publicado;
    const [p] = await this.sql`
      UPDATE posts SET ${this.sql(updates)}
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
    await this.sql`DELETE FROM posts WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
