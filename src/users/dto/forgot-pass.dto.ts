import { IsEmail, IsString } from 'class-validator';

export class ForgotPass {
  @IsString()
  @IsEmail()
  email: string;
}
