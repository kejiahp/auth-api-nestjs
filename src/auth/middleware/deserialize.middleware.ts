import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { AuthTokenProvider } from '../utils/authToken.utils';

@Injectable()
export class AuthTokensMiddleware implements NestMiddleware {
  constructor(private authTokenProvider: AuthTokenProvider) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const access_token = this.authTokenProvider.getAccessToken(request);
    const refresh_token = this.authTokenProvider.getRefreshToken(request);

    //IF ACCESS TOKEN DOESNT EXIST
    if (!access_token) {
      return next();
    }

    //IF ACCESS TOKEN EXISTS
    const access_decode =
      this.authTokenProvider.verifyAccessToken(access_token);

    //IF ACCESS TOKEN EXISTS AND IS NOT DECODE-ABLE
    if (!access_decode) {
      if (!refresh_token) {
        return next();
      }

      const refresh_decode =
        this.authTokenProvider.verifyRefreshTokens(refresh_token);

      if (!refresh_decode) {
        return next();
      }

      const newAccessToken = await this.authTokenProvider.reissueAccessToken(
        refresh_decode,
      );

      response.setHeader('x-new-access', newAccessToken);

      const decoded = this.authTokenProvider.verifyAccessToken(newAccessToken);

      response.locals.user = decoded;

      return next();
    }

    response.locals.user = access_decode;

    return next();
  }
}
