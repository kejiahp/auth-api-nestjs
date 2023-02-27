import { Injectable } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

/**
 * THIS IS NOT USED, KINDLY REMOVE IT FROM YOUR PROJECT
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('access_refresh') {}
//THIS IS NOT USED, KINDLY REMOVE IT FROM YOUR PROJECT
