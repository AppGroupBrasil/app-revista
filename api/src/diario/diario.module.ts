import { Module } from '@nestjs/common';
import { DiarioController } from './diario.controller';

@Module({ controllers: [DiarioController] })
export class DiarioModule {}
