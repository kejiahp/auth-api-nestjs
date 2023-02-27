import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import sendEmail from 'src/utils/mailer';
import { ForgotPass } from './dto/forgot-pass.dto';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { ResetPassBodyDto } from './dto/reset-pass.dto';
import { hashPassword } from './encryption/password.encrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  private readonly logger = new Logger(UsersController.name);

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    await sendEmail({
      from: this.configService.get('EMAIL'),
      to: user.email,
      subject: 'Please verifiy your account',
      text: `verification code ${user.verificationCode}|| id: ${user.id}`,
    });
    const { id, email, firstname, lastname } = user;
    return { id, email, firstname, lastname };
  }

  @Post('verify/:id/:verificationCode')
  async verifyUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationCode') verificationCode: string,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return "Couldn't verify user";
    }

    if (user.verfied) {
      return 'User is already verified';
    }

    if (user.verificationCode === verificationCode) {
      user.verfied = true;

      this.usersService.update(id, user);

      return 'User successfully verified';
    }

    return "Couldn't verify user";
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPassDto: ForgotPass) {
    const user = await this.usersService.findByEmail(forgotPassDto.email);

    if (!user) {
      return 'You will receive a password reset mail';
    }

    if (!user.verfied) {
      return 'User is not verified';
    }

    const passwordResetCode = nanoid();

    user.passwordResetCode = passwordResetCode;

    const updatedUser = await this.usersService.update(user.id, user);

    await sendEmail({
      from: this.configService.get('EMAIL'),
      to: updatedUser.email,
      subject: 'Password Reset Mail',
      text: `Password Reset Code ${passwordResetCode} || id: ${user.id}`,
    });

    this.logger.log(`Password reset email sent to ${updatedUser.email}`);

    return 'You will receive a password reset mail';
  }

  @Post('/reset-password')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('passResetCode') passResetCode: string,
    @Body() resetPasswordDto: ResetPassBodyDto,
  ) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      return "User Doesn't exist";
    }
    if (user.passwordResetCode === passResetCode) {
      user.passwordResetCode = null;

      const hash = await hashPassword(resetPasswordDto.password);

      user.password === hash;

      this.usersService.update(id, user);

      return 'Password successfully changed.';
    }

    return "Password couldn't be changed";
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
