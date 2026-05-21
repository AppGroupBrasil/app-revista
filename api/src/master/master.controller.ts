import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/superadmin.guard';

class BloquearDto {
  @IsBoolean() bloqueado!: boolean;
  @IsOptional() @IsString() motivo?: string;
}

@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('master')
export class MasterController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get('condominios')
  async listarTodos() {
    return this.sql`
      SELECT id, dono_id, perfil, nome, endereco, cnpj,
             status_assinatura, bloqueado, bloqueado_motivo, criado_em
      FROM condominios ORDER BY criado_em DESC LIMIT 500
    `;
  }

  @Patch('condominios/:id/bloqueio')
  async bloquear(@Param('id', ParseUUIDPipe) id: string, @Body() dto: BloquearDto) {
    const [c] = await this.sql`
      UPDATE condominios
      SET bloqueado = ${dto.bloqueado}, bloqueado_motivo = ${dto.motivo || null}
      WHERE id = ${id}
      RETURNING id, nome, bloqueado, bloqueado_motivo
    `;
    return c;
  }

  @Patch('condominios/:id/assinatura')
  async mudarStatus(@Param('id', ParseUUIDPipe) id: string, @Body() body: { status: string }) {
    const [c] = await this.sql`
      UPDATE condominios SET status_assinatura = ${body.status}::status_assinatura
      WHERE id = ${id}
      RETURNING id, nome, status_assinatura
    `;
    return c;
  }
}
