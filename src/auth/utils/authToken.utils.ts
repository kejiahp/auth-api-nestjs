import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../constants';
import { AuthService } from '../auth.service';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class AuthTokenProvider {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private sessionsService: SessionsService,
  ) {}
  getAccessToken(request: any) {
    try {
      const access_token = request
        .get('authorization')
        .replace('Bearer', ' ')
        .trim();

      return access_token;
    } catch (e) {
      return null;
    }
  }

  getRefreshToken(request: any) {
    try {
      const refresh_token = request.get('x-refresh');
      return refresh_token;
    } catch (e) {
      return null;
    }
  }

  verifyAccessToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: constants.access_secret,
      });

      return decoded;
    } catch (e) {
      return null;
    }
  }

  verifyRefreshTokens(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: constants.refresh_secret,
      });

      return decoded;
    } catch (e) {
      return null;
    }
  }

  async reissueAccessToken(token: any) {
    const session = await this.sessionsService.findSession(token.id);

    const user = await this.sessionsService.userWithSessionCheck(
      session.user.id,
    );

    const payload = {
      id: user.id,
      email: user.email,
      fullname: `${user.lastname} ${user.firstname}`,
    };

    const newAccessToken = this.authService.generateAccessToken(payload);

    return newAccessToken;
  }
}
