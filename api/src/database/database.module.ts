import { Module, Global } from '@nestjs/common';
import postgres from 'postgres';

export const SQL = Symbol('SQL');

@Global()
@Module({
  providers: [{
    provide: SQL,
    useFactory: () => postgres(process.env.DATABASE_URL!, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
    }),
  }],
  exports: [SQL],
})
export class DatabaseModule {}
