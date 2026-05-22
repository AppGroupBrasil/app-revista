import {
  Body, Controller, Delete, Get, Inject, Ip, NotFoundException, Param, ParseUUIDPipe,
  Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import {
  IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, IsUrl, MaxLength, Min, MinLength,
} from 'class-validator';
import { customAlphabet } from 'nanoid';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { assertCondoAccess } from '../auth/condo-access';

const TIPOS = ['tarefa', 'checklist', 'vistoria'] as const;
type Tipo = typeof TIPOS[number];
const FREQS = ['unica', 'diaria', 'semanal', 'mensal'] as const;
type Freq = typeof FREQS[number];
const gerarToken = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16);

class FuncionarioDto {
  @IsString() @MinLength(2) @MaxLength(150) nome!: string;
  @IsOptional() @IsString() @MaxLength(120) cargo?: string;
  @IsOptional() @IsString() @MaxLength(120) contato?: string;
  @IsOptional() @IsUrl() foto_url?: string;
  @IsOptional() @IsBoolean() ativo?: boolean;
}

class TarefaDto {
  @IsOptional() @IsUUID() funcionario_id?: string;
  @IsEnum(TIPOS) tipo!: Tipo;
  @IsString() @MinLength(3) @MaxLength(200) titulo!: string;
  @IsOptional() @IsString() @MaxLength(4000) descricao?: string;
  @IsOptional() @IsString() @MaxLength(200) local?: string;
  @IsEnum(FREQS) frequencia!: Freq;
  @IsOptional() @IsArray() @IsString({ each: true }) checklist?: string[];
}

class TarefaPatchDto {
  @IsOptional() @IsUUID() funcionario_id?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(200) titulo?: string;
  @IsOptional() @IsString() @MaxLength(4000) descricao?: string;
  @IsOptional() @IsString() @MaxLength(200) local?: string;
  @IsOptional() @IsEnum(FREQS) frequencia?: Freq;
  @IsOptional() @IsArray() @IsString({ each: true }) checklist?: string[];
  @IsOptional() @IsBoolean() ativo?: boolean;
}

class ExecucaoDto {
  @IsOptional() @IsUUID() funcionario_id?: string;
  @IsOptional() @IsString() @MaxLength(150) executor_nome?: string;
  @IsOptional() @IsArray() @IsInt({ each: true }) @Min(0, { each: true }) itens_marcados?: number[];
  @IsOptional() @IsArray() @IsUrl({}, { each: true }) fotos?: string[];
  @IsOptional() @IsString() @MaxLength(4000) observacoes?: string;
}

// ── PÚBLICO: scan do QR para ver a tarefa + registrar execução
@Controller('publico')
export class TarefasPublicasController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get('vistorias/:token')
  async ver(@Param('token') token: string) {
    const [t] = await this.sql<
      {
        id: string; condominio_id: string; tipo: Tipo; titulo: string; descricao: string | null;
        local: string | null; frequencia: Freq; checklist: string[];
        condominio_nome: string;
      }[]
    >`
      SELECT t.id, t.condominio_id, t.tipo, t.titulo, t.descricao, t.local, t.frequencia, t.checklist,
             c.nome AS condominio_nome
      FROM tarefas t
      JOIN condominios c ON c.id = t.condominio_id
      WHERE t.qr_token = ${token} AND t.ativo = true AND c.bloqueado = false
    `;
    if (!t) throw new NotFoundException('Tarefa não encontrada');
    const recentes = await this.sql`
      SELECT id, executor_nome, observacoes, executado_em, fotos, itens_marcados
      FROM tarefa_execucoes WHERE tarefa_id = ${t.id}
      ORDER BY executado_em DESC LIMIT 10
    `;
    return { ...t, execucoes_recentes: recentes };
  }

  @Post('vistorias/:token/registro')
  async registrar(
    @Param('token') token: string,
    @Body() dto: ExecucaoDto,
    @Ip() ip: string,
  ) {
    const [t] = await this.sql<{ id: string; condominio_id: string }[]>`
      SELECT id, condominio_id FROM tarefas WHERE qr_token = ${token} AND ativo = true
    `;
    if (!t) throw new NotFoundException();
    const [e] = await this.sql`
      INSERT INTO tarefa_execucoes
        (tarefa_id, condominio_id, funcionario_id, executor_nome,
         itens_marcados, fotos, observacoes, ip_origem)
      VALUES
        (${t.id}, ${t.condominio_id}, ${dto.funcionario_id || null}, ${dto.executor_nome || null},
         ${this.sql.json(dto.itens_marcados || [])}, ${this.sql.json(dto.fotos || [])},
         ${dto.observacoes || null}, ${ip || null})
      RETURNING id, executado_em
    `;
    return { ok: true, id: e.id, executado_em: e.executado_em };
  }
}

// ── ADMIN: funcionários
@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/funcionarios')
export class FuncionariosAdminController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT * FROM funcionarios WHERE condominio_id = ${condoId}
      ORDER BY ativo DESC, nome
    `;
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: FuncionarioDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [f] = await this.sql`
      INSERT INTO funcionarios (condominio_id, nome, cargo, contato, foto_url, ativo)
      VALUES (${condoId}, ${dto.nome}, ${dto.cargo || null}, ${dto.contato || null},
              ${dto.foto_url || null}, ${dto.ativo ?? true})
      RETURNING *
    `;
    return f;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<FuncionarioDto>,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dto)) if (v !== undefined) updates[k] = v;
    if (Object.keys(updates).length === 0) {
      const [f] = await this.sql`SELECT * FROM funcionarios WHERE id = ${id} AND condominio_id = ${condoId}`;
      return f;
    }
    const [f] = await this.sql`
      UPDATE funcionarios SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId} RETURNING *
    `;
    return f;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM funcionarios WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }
}

// ── ADMIN: tarefas + execuções
@UseGuards(JwtAuthGuard)
@Controller('condominios/:condoId/tarefas')
export class TarefasAdminController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listar(@Req() req: { user: JwtUser }, @Param('condoId', ParseUUIDPipe) condoId: string) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT t.*, f.nome AS funcionario_nome
      FROM tarefas t LEFT JOIN funcionarios f ON f.id = t.funcionario_id
      WHERE t.condominio_id = ${condoId}
      ORDER BY t.ativo DESC, t.criado_em DESC
    `;
  }

  @Post()
  async criar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Body() dto: TarefaDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const [t] = await this.sql`
      INSERT INTO tarefas
        (condominio_id, funcionario_id, tipo, titulo, descricao, local, frequencia, checklist, qr_token)
      VALUES
        (${condoId}, ${dto.funcionario_id || null}, ${dto.tipo}, ${dto.titulo},
         ${dto.descricao || null}, ${dto.local || null}, ${dto.frequencia},
         ${this.sql.json(dto.checklist || [])}, ${gerarToken()})
      RETURNING *
    `;
    return t;
  }

  @Patch(':id')
  async atualizar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TarefaPatchDto,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dto)) {
      if (v === undefined) continue;
      updates[k] = k === 'checklist' ? this.sql.json(v as string[]) : v;
    }
    if (Object.keys(updates).length === 0) {
      const [t] = await this.sql`SELECT * FROM tarefas WHERE id = ${id} AND condominio_id = ${condoId}`;
      return t;
    }
    const [t] = await this.sql`
      UPDATE tarefas SET ${this.sql(updates)}
      WHERE id = ${id} AND condominio_id = ${condoId} RETURNING *
    `;
    return t;
  }

  @Delete(':id')
  async deletar(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    await this.sql`DELETE FROM tarefas WHERE id = ${id} AND condominio_id = ${condoId}`;
    return { ok: true };
  }

  @Get(':id/execucoes')
  async execucoes(
    @Req() req: { user: JwtUser },
    @Param('condoId', ParseUUIDPipe) condoId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await assertCondoAccess(this.sql, req.user, condoId);
    return this.sql`
      SELECT e.*, f.nome AS funcionario_nome
      FROM tarefa_execucoes e LEFT JOIN funcionarios f ON f.id = e.funcionario_id
      WHERE e.tarefa_id = ${id} AND e.condominio_id = ${condoId}
      ORDER BY executado_em DESC LIMIT 100
    `;
  }
}
