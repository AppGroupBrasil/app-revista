import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';
import { cacheUser } from '../auth/condo-access';

class CriarCondominioDto {
  @IsEnum(['sindico', 'administradora']) perfil!: 'sindico' | 'administradora';
  @IsString() @MinLength(3) nome!: string;
  @IsOptional() @IsString() endereco?: string;
  @IsOptional() @IsString() cnpj?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('condominios')
export class CondominiosController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Get()
  async listarMeus(@Req() req: { user: JwtUser }) {
    return this.sql`
      SELECT id, perfil, nome, endereco, cnpj, logo_url, theme_color, accent_color,
             status_assinatura, bloqueado, criado_em
      FROM condominios WHERE dono_id = ${req.user.sub} ORDER BY criado_em DESC
    `;
  }

  @Post()
  async criar(@Req() req: { user: JwtUser }, @Body() dto: CriarCondominioDto) {
    await cacheUser(this.sql, req.user);
    const [novo] = await this.sql`
      INSERT INTO condominios (dono_id, perfil, nome, endereco, cnpj)
      VALUES (${req.user.sub}, ${dto.perfil}, ${dto.nome}, ${dto.endereco || null}, ${dto.cnpj || null})
      RETURNING id, perfil, nome, status_assinatura
    `;
    return novo;
  }

  @Get(':id')
  async detalhe(@Req() req: { user: JwtUser }, @Param('id', ParseUUIDPipe) id: string) {
    const [c] = await this.sql`
      SELECT * FROM condominios
      WHERE id = ${id} AND (dono_id = ${req.user.sub} OR ${req.user.role_global} = 'superadmin')
    `;
    return c || null;
  }
}
