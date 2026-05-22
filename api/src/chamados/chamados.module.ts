import { Module } from '@nestjs/common';
import { ChamadosAdminController, ChamadosPublicosController } from './chamados.controller';

@Module({ controllers: [ChamadosAdminController, ChamadosPublicosController] })
export class ChamadosModule {}
