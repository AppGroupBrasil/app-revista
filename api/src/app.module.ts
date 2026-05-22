import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CondominiosModule } from './condominios/condominios.module';
import { ProvisioningModule } from './provisioning/provisioning.module';
import { MasterModule } from './master/master.module';
import { DiarioModule } from './diario/diario.module';
import { KpisModule } from './kpis/kpis.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { UploadsModule } from './uploads/uploads.module';
import { RevistaModule } from './revista/revista.module';
import { ChamadosModule } from './chamados/chamados.module';
import { ClassificadosModule } from './classificados/classificados.module';
import { CaronasModule } from './caronas/caronas.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    DatabaseModule,
    AuthModule,
    CondominiosModule,
    ProvisioningModule,
    MasterModule,
    DiarioModule,
    KpisModule,
    AvaliacoesModule,
    UploadsModule,
    RevistaModule,
    ChamadosModule,
    ClassificadosModule,
    CaronasModule,
    FuncionariosModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
