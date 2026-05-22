import { Module } from '@nestjs/common';
import {
  FuncionariosAdminController,
  TarefasAdminController,
  TarefasPublicasController,
} from './funcionarios.controller';

@Module({
  controllers: [FuncionariosAdminController, TarefasAdminController, TarefasPublicasController],
})
export class FuncionariosModule {}
