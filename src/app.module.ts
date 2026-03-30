import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { ContextMiddleware, LoggerMiddleware } from 'src/middlewares';
import * as allModules from 'src/modules';
import { AppController } from './app.controller';
import { CustomThrottlerGuard } from './common/guards';

const globalModules = [
  ThrottlerModule.forRoot([
    {
      name: 'short',
      ttl: 1000,
      limit: Number(process.env.LIMIT_RQ_PER_SECOND_PER_IP) || 10,
    },
    {
      name: 'long',
      ttl: 60000,
      limit: Number(process.env.LIMIT_RQ_PER_MINUTE_PER_IP) || 100,
    },
  ]),
];

const modules = Object.values(allModules);

@Module({
  imports: [
    ...globalModules,
    ...modules,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.prod'
          : process.env.NODE_ENV === 'development'
            ? '.env.dev'
            : '.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
