import { Module } from '@nestjs/common';
import { CaronasAdminController, CaronasPublicasController } from './caronas.controller';

@Module({ controllers: [CaronasAdminController, CaronasPublicasController] })
export class CaronasModule {}
