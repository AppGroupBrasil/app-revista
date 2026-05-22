import { Module } from '@nestjs/common';
import { ClassificadosAdminController, ClassificadosPublicosController } from './classificados.controller';

@Module({ controllers: [ClassificadosAdminController, ClassificadosPublicosController] })
export class ClassificadosModule {}
