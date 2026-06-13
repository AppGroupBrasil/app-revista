import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SsoController } from './sso.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '24h', issuer: 'auth.appgroupbrasil.com.br' },
    }),
  ],
  controllers: [SsoController],
})
export class SsoModule {}
