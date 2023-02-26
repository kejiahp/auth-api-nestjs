import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from 'src/users/encryption/password.encrypt';
import { UsersService } from 'src/users/users.service';
import constants from './constants';
import { UserAuthDto } from './dto/user-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateAccessToken(payload: {
    id: number;
    email: string;
    fullname: string;
  }) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: constants.access_secret,
      expiresIn: 60 * 15,
    });

    return refreshToken;
  }

  genereteRefreshToken() {}

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

    const payload = {
      id: user.id,
      email: user.email,
      fullname: `${user.lastname} ${user.firstname}`,
    };

    const access_token = this.generateAccessToken(payload);

    return { access_token };
  }
}
