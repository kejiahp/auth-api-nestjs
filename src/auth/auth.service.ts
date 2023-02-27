import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';
import { verifyPassword } from 'src/users/encryption/password.encrypt';
import { UsersService } from 'src/users/users.service';
import constants from './constants';
import { UserAuthDto } from './dto/user-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  generateAccessToken(payload: {
    id: number;
    email: string;
    fullname: string;
  }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: constants.access_secret,
      expiresIn: 60 * 15,
    });

    return accessToken;
  }

  genereteRefreshToken(payload: { id: number; user: number }) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: constants.refresh_secret,
      expiresIn: 60 * 30,
    });

    return refreshToken;
  }

  async validateUser(userAuthDto: UserAuthDto) {
    const user = await this.userService.findByEmail(userAuthDto.email);

    if (!user || !user.verfied) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isSame = await verifyPassword(user.password, userAuthDto.password);

    if (!isSame) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (user && isSame) {
      const { id, email, firstname, lastname } = user;

      const result = { id, email, firstname, lastname };

      return result;
    }
  }

  async login(userAuthDto: UserAuthDto) {
    const user = await this.validateUser(userAuthDto);
    const session = await this.sessionsService.createSession(user.id);

    const access_payload = {
      id: user.id,
      email: user.email,
      fullname: `${user.lastname} ${user.firstname}`,
    };

    const refresh_payload = {
      id: session.id,
      user: session.user.id,
    };

    const access_token = this.generateAccessToken(access_payload);
    const refresh_token = this.genereteRefreshToken(refresh_payload);

    return { access_token, refresh_token };
  }
}
