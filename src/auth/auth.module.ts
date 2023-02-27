import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SessionsModule } from 'src/sessions/sessions.module';
import { AuthTokenProvider } from './utils/authToken.utils';
import { AuthTokensMiddleware } from './middleware/deserialize.middleware';
import { RequestUserMiddleware } from './middleware/requestUser.middleware';

@Module({
  imports: [UsersModule, JwtModule.register({}), SessionsModule],
  providers: [
    AuthService,
    AuthTokenProvider,
    AuthTokensMiddleware,
    RequestUserMiddleware,
  ],
  controllers: [AuthController],
  exports: [AuthTokensMiddleware, AuthTokenProvider, RequestUserMiddleware],
})
export class AuthModule {}
