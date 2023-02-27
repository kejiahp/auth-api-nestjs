import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { SessionsModule } from './sessions/sessions.module';
import { AuthTokensMiddleware } from './auth/middleware/deserialize.middleware';
import { RequestUserMiddleware } from './auth/middleware/requestUser.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokensMiddleware, RequestUserMiddleware)
      .exclude(
        'users/verify/:id/:verificationCode',
        'auth/login',
        'users/forgot-password',
        'users/reset-password',
        {
          path: 'users',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
