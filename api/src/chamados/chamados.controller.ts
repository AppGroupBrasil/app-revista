import {
  Body, Controller, Delete, Get, Header, Inject, Ip, NotFoundException, Param, ParseUUIDPipe,
  Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import {
  IsArray, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength,
} from 'class-validator';
import { customAlphabet } from 'nanoid';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';
import { NotificationsService } from '../notifications/notifications.service';

const STATUS = ['aberto', 'em_andamento', 'resolvido', 'problema'] as const;
type Status = typeof STATUS[number];
const PRIORIDADES = ['baixa', 'media', 'alta', 'urgente'] as const;
type Prioridade = typeof PRIORIDADES[number];
const CATEGORIAS = ['manutencao', 'limpeza', 'seguranca', 'infra', 'outro'] as const;

const gerarCodigo = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

class CriarPublicoDto {
  @IsEnum(CATEGORIAS) categoria!: typeof CATEGORIAS[number];
  @IsString() @MinLength(3) @MaxLength(200) titulo!: string;
  @IsOptional() @IsString() @MaxLength(4000) descricao?: string;
  @IsOptional() @IsString() @MaxLength(120) autor_nome?: string;
  @IsOptional() @IsString() @MaxLength(50) autor_unidade?: string;
  @IsOptional() @IsString() @MaxLength(120) autor_contato?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsEnum(PRIORIDADES) prioridade?: Prioridade;
}

class AtualizarDto {
  @IsOptional() @IsEnum(STATUS) status?: Status;
  @IsOptional() @IsEnum(PRIORIDADES) prioridade?: Prioridade;
  @IsOptional() @IsString() @MaxLength(4000) resposta?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(200) titulo?: string;
  @IsOptional() @IsString() @MaxLength(4000) descricao?: string;
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
}

// ── PÚBLICO (sem JWT) ─ abertura via QR Code + tracking
@Controller('publico')
export class ChamadosPublicosController {
  constructor(
    @Inject(SQL) private sql: postgres.Sql,
    private notifications: NotificationsService,
  ) {}

  @Post('condominios/:condoId/chamados')
  async abrir(
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: CriarPublicoDto,
    @Ip() ip: string,
  ) {
    const [c] = await this.sql<{ id: string }[]>`
      SELECT id FROM condominios WHERE id = ${condoId} AND bloqueado = false
    `;
    if (!c) throw new NotFoundException('Condomínio não disponível');

    const codigo = gerarCodigo();
    const [ch] = await this.sql`
      INSERT INTO chamados
        (condominio_id, codigo, categoria, titulo, descricao, prioridade,
         autor_nome, autor_unidade, autor_contato, fotos, ip_origem)
      VALUES
        (${condoId}, ${codigo}, ${dto.categoria}, ${dto.titulo}, ${dto.descricao || null},
         ${dto.prioridade || 'media'},
         ${dto.autor_nome || null}, ${dto.autor_unidade || null}, ${dto.autor_contato || null},
         ${this.sql.json(dto.fotos || [])}, ${ip || null})
      RETURNING id, codigo, criado_em
    `;
    this.notifications
      .chamadoNovo(condoId, ch.codigo, dto.titulo, dto.prioridade || 'media')
      .catch(() => null);
    return { ok: true, codigo: ch.codigo, id: ch.id };
  }

  @Get('chamados/:codigo')
  @Header('Cache-Control', 'public, max-age=30, s-maxage=60')
  async acompanhar(@Param('codigo') codigo: string) {
    const [ch] = await this.sql<
      {
        codigo: string; categoria: string; titulo: string; descricao: string | null;
        status: Status; prioridade: Prioridade; resposta: string | null;
        resolvido_em: Date | null; criado_em: Date; atualizado_em: Date;
        condominio_nome: string;
      }[]
    >`
      SELECT ch.codigo, ch.categoria, ch.titulo, ch.descricao, ch.status, ch.prioridade,
             ch.resposta, ch.resolvido_em, ch.criado_em, ch.atualizado_em,
             c.nome AS condominio_nome
      FROM chamados ch
      JOIN condominios c ON c.id = ch.condominio_id
      WHERE ch.codigo = ${codigo.toUpperCase()}
    `;
    if (!ch) throw new NotFoundException('Chamado não encontrado');
    return ch;
  }
}

// ── ADMIN (JWT)
@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/chamados')
export class ChamadosAdminController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT * FROM chamados WHERE condominio_id = ${condoId}
      ORDER BY
        CASE prioridade WHEN 'urgente' THEN 0 WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
        criado_em DESC
      LIMIT 500
    `;
  }

  @Get('stats')
  async stats(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [s] = await this.sql<
      { total: number; abertos: number; em_andamento: number; resolvidos: number; problemas: number }[]
    >`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE status = 'aberto')::int AS abertos,
             COUNT(*) FILTER (WHERE status = 'em_andamento')::int AS em_andamento,
             COUNT(*) FILTER (WHERE status = 'resolvido')::int AS resolvidos,
             COUNT(*) FILTER (WHERE status = 'problema')::int AS problemas
      FROM chamados WHERE condominio_id = ${condoId}
    `;
    return s;
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
    if (dto.status !== undefined) {
      updates.status = dto.status;
      if (dto.status === 'resolvido') updates.resolvido_em = new Date();
    }
    if (dto.prioridade !== undefined) updates.prioridade = dto.prioridade;
    if (dto.resposta !== undefined) updates.resposta = dto.resposta;
    if (dto.titulo !== undefined) updates.titulo = dto.titulo;
    if (dto.descricao !== undefined) updates.descricao = dto.descricao;
    if (dto.fotos !== undefined) updates.fotos = this.sql.json(dto.fotos);
    if (Object.keys(updates).length === 0) {
      const [ch] = await this.sql`SELECT * FROM chamados WHERE id = ${id} AND condominio_id = ${condoId}`;
      return ch;
    }
    const [ch] = await this.sql`
      UPDATE chamados SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId}
      RETURNING *
    `;
    return ch;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM chamados WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}
