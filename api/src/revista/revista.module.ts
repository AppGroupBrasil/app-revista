import { Module } from '@nestjs/common';
import { EdicoesController } from './edicoes.controller';
import { SecoesController } from './secoes.controller';
import { ParceirosController } from './parceiros.controller';
import { RevistaPublicaController } from './revista-publica.controller';

@Module({
  controllers: [EdicoesController, SecoesController, ParceirosController, RevistaPublicaController],
})
export class RevistaModule {}
