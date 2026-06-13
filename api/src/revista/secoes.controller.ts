import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsArray, IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

export const CATEGORIAS = [
  // existentes (mantidas para compatibilidade)
  'mensagem_sindico', 'realizacoes', 'aquisicoes', 'comunicados',
  'dicas', 'telefones_uteis', 'eventos', 'galeria_imagens',
  'ocorrencias_finalizadas', 'manutencoes_finalizadas',
  'sugestoes_reclamacoes_elogios',
  // novas (marketing)
  'achados_perdidos', 'agendamento_mudancas', 'agendamento_reformas',
  'antes_depois', 'avaliacoes', 'boas_vindas', 'benfeitorias',
  'capa_revista', 'caronas_coletivas', 'classificados',
  'conheca_sindico', 'editorial', 'enquetes_pesquisas',
  'espaco_morador', 'espaco_kids', 'financeiro', 'gestao_funcionarios',
  'links', 'mural_qrcodes', 'mural_recados', 'nossa_equipe',
  'obras_manutencao', 'parceiros_convenios', 'pets',
  'prestadores_servico', 'publicidade_local', 'qrcodes_publicos',
  'regras_regulamento', 'saude_bemestar', 'seguranca',
  'semana_condominio', 'sustentabilidade',
] as const;
type Categoria = typeof CATEGORIAS[number];

class CriarSecaoDto {
  @IsEnum(CATEGORIAS) categoria!: Categoria;
  @IsString() titulo!: string;
  @IsOptional() @IsString() conteudo?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsObject() dados?: Record<string, unknown>;
  @IsOptional() @IsInt() ordem?: number;
}

class AtualizarSecaoDto {
  @IsOptional() @IsEnum(CATEGORIAS) categoria?: Categoria;
  @IsOptional() @IsString() titulo?: string;
  @IsOptional() @IsString() conteudo?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsObject() dados?: Record<string, unknown>;
  @IsOptional() @IsInt() ordem?: number;
  @IsOptional() @IsBoolean() visivel?: boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/edicoes/:edicaoId/secoes')
export class SecoesController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  private async assertEdicao(condoId: string, edicaoId: string) {
    const [e] = await this.sql<{ id: string }[]>`SELECT id FROM edicoes WHERE id = ${edicaoId} AND condominio_id = ${condoId}`;
    if (!e) throw new Error('Edição não encontrada');
  }

  @Get()
  async listar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('edicaoId', ParseUUIDPipe) edicaoId: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.assertEdicao(condoId, edicaoId);
    return this.sql`SELECT * FROM secoes WHERE edicao_id = ${edicaoId} ORDER BY ordem, criado_em`;
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('edicaoId', ParseUUIDPipe) edicaoId: string,
    @Body() dto: CriarSecaoDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.assertEdicao(condoId, edicaoId);
    const [s] = await this.sql`
      INSERT INTO secoes (edicao_id, categoria, titulo, conteudo, fotos, dados, ordem)
      VALUES (${edicaoId}, ${dto.categoria}, ${dto.titulo},
              ${dto.conteudo || null}, ${this.sql.json(dto.fotos || [])},
              ${this.sql.json((dto.dados ?? {}) as postgres.JSONValue)}, ${dto.ordem ?? 0})
      RETURNING *
    `;
    return s;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('edicaoId', ParseUUIDPipe) edicaoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarSecaoDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.assertEdicao(condoId, edicaoId);
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dto)) if (v !== undefined) updates[k] = v;
    if (dto.fotos !== undefined) updates.fotos = this.sql.json(dto.fotos);
    if (dto.dados !== undefined) updates.dados = this.sql.json(dto.dados as postgres.JSONValue);
    if (Object.keys(updates).length === 0) return { ok: true };
    const [s] = await this.sql`
      UPDATE secoes SET ${this.sql(updates)}
      WHERE id = ${id} AND edicao_id = ${edicaoId}
      RETURNING *
    `;
    return s;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('edicaoId', ParseUUIDPipe) edicaoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.assertEdicao(condoId, edicaoId);
    await this.sql`DELETE FROM secoes WHERE id = ${id} AND edicao_id = ${edicaoId}`;
    return { ok: true };
  }
}
