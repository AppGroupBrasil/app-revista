import { Module } from '@nestjs/common';
import { AvaliacoesAdminController, AvaliacoesPublicasController } from './avaliacoes.controller';

@Module({ controllers: [AvaliacoesAdminController, AvaliacoesPublicasController] })
export class AvaliacoesModule {}
