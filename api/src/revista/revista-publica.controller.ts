import { Controller, Get, Inject, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

@Controller('publico/condominios/:condoId/revista')
export class RevistaPublicaController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  // Última edição publicada + seções visíveis + parceiros ativos
  @Get('atual')
  async atual(@Param('condoId', ParseUUIDPipe) condoId: string) {
    const [c] = await this.sql<{ nome: string; theme_color: string; accent_color: string; bloqueado: boolean }[]>`
      SELECT nome, theme_color, accent_color, bloqueado FROM condominios WHERE id = ${condoId}
    `;
    if (!c || c.bloqueado) throw new NotFoundException();

    const [edicao] = await this.sql`
      SELECT * FROM edicoes WHERE condominio_id = ${condoId} AND publicada = true
      ORDER BY publicada_em DESC NULLS LAST, numero DESC LIMIT 1
    `;
    if (!edicao) return { condominio: c, edicao: null };

    const secoes = await this.sql`
      SELECT * FROM secoes WHERE edicao_id = ${edicao.id} AND visivel = true
      ORDER BY ordem, criado_em
    `;

    const parceiros = await this.sql`
      SELECT id, tipo, nome, descricao, categoria, logo_url, telefone, whatsapp, link, destaque
      FROM parceiros WHERE condominio_id = ${condoId} AND ativo = true
      ORDER BY destaque DESC, ordem, nome
    `;

    return { condominio: c, edicao: { ...edicao, secoes }, parceiros };
  }
}
