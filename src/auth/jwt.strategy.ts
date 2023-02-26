import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import constants from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access_refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.access_secret,
    });
  }

  validate(payload: any) {
    console.log(payload);
    return { id: payload.id, email: payload.email, fullname: payload.fullname };
  }
}
