import { Body, Controller, Headers, Inject, Post, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { IsString, IsUUID, IsObject, IsOptional } from 'class-validator';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

class UsuarioEventoDto {
  @IsString() evento!: 'licenca_criada' | 'licenca_atualizada' | 'licenca_revogada' | 'usuario_criado';
  @IsUUID() usuario_id!: string;
  @IsOptional() @IsObject() dados?: Record<string, any>;
}

@Controller('provisioning')
export class ProvisioningController {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  @Post('usuario')
  async receber(
    @Body() dto: UsuarioEventoDto,
    @Headers('x-webhook-signature') sig?: string,
  ) {
    const secret = process.env.WEBHOOK_SECRET;
    if (!secret) throw new BadRequestException('WEBHOOK_SECRET não configurado');
    if (!sig) throw new UnauthorizedException('Assinatura ausente');

    const expected = createHmac('sha256', secret).update(JSON.stringify(dto)).digest('hex');
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(sig, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Assinatura inválida');
    }

    await this.sql`
      INSERT INTO provisioning_log (evento, usuario_id, payload)
      VALUES (${dto.evento}, ${dto.usuario_id}, ${this.sql.json(dto.dados || {})})
    `;
    return { ok: true };
  }
}
