import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não definido — encerre o boot e configure a variável de ambiente.');
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api/v1');
  const corsOrigins =
    process.env.CORS_ORIGINS ||
    (process.env.NODE_ENV === 'production'
      ? 'https://apprevista.com.br,https://www.apprevista.com.br'
      : '*');
  app.enableCors({
    origin: corsOrigins.split(',').map((s) => s.trim()),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT || 3200);
  await app.listen(port);
  app.get(Logger).log(`apprevista-api rodando em http://localhost:${port}/api/v1`, 'Bootstrap');
}
bootstrap();
