import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import constants from './constants';

/**
 * THIS IS NOT USED, KINDLY REMOVE IT FROM YOUR PROJECT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access_refresh') {
  // THIS IS NOT USED, KINDLY REMOVE IT FROM YOUR PROJECT
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.access_secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    console.log(req.headers);
    // return { id: payload.id, email: payload.email, fullname: payload.fullname };
    return payload;
  }
}
// THIS IS NOT USED, KINDLY REMOVE IT FROM YOUR PROJECT
