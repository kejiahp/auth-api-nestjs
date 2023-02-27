import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user) {
      throw new UnauthorizedException('invalid access or refresh token');
    }
    next();
  }
}
