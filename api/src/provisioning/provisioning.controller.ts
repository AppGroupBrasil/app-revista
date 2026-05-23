import { Body, Controller, Headers, Inject, Post, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IsString, IsUUID, IsOptional, IsEmail } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

class ProvisioningUsuarioDto {
  @IsUUID() usuario_id!: string;
  @IsEmail() email!: string;
  @IsString() nome!: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() expira_em?: string | null;
  @IsOptional() metadata?: Record<string, any>;
}

@Controller('provisioning')
export class ProvisioningController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Post('usuario')
  async receber(
    @Body() dto: ProvisioningUsuarioDto,
    @Headers('x-provisioning-secret') secret?: string,
  ) {
    const expected = process.env.PROVISIONING_SECRET || process.env.WEBHOOK_SECRET;
    if (!expected) throw new BadRequestException('PROVISIONING_SECRET não configurado');
    if (!secret || secret !== expected) throw new ForbiddenException('Assinatura inválida');

    if (!dto.usuario_id || !dto.email || !dto.nome) {
      throw new BadRequestException('Campos obrigatórios ausentes');
    }
    await this.sql`
      INSERT INTO usuarios_cache (id, email, nome, atualizado_em)
      VALUES (${dto.usuario_id}, ${dto.email}, ${dto.nome}, NOW())
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, nome = EXCLUDED.nome, atualizado_em = NOW()
    `;
    await this.sql`
      INSERT INTO provisioning_log (evento, usuario_id, payload)
      VALUES (${'usuario_provisionado'}, ${dto.usuario_id}, ${this.sql.json({ ...dto })})
    `;
    return { ok: true, usuario_id: dto.usuario_id };
  }
}
