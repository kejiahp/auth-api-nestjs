import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { SamePasswordValidator } from '../custom-validators/samepassword.validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  @MinLength(6)
  password: string;

  @Validate(SamePasswordValidator)
  passwordConfirmation: string;
}
