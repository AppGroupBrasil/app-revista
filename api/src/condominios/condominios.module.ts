import { Module } from '@nestjs/common';
import { CondominiosController } from './condominios.controller';

@Module({ controllers: [CondominiosController] })
export class CondominiosModule {}
