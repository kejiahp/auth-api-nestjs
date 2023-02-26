import { IsNumber, IsString, MinLength, Validate } from 'class-validator';
import { SamePasswordValidator } from '../custom-validators/samepassword.validator';

export class ResetPassBodyDto {
  @IsString()
  @MinLength(6)
  password: string;

  @Validate(SamePasswordValidator)
  passwordConfirmation: string;
}
