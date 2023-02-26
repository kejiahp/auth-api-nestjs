import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from './encryption/password.encrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userRepo.findOneBy({
      email: createUserDto.email,
    });

    if (isExist) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'a user with this email already exists',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    let { passwordConfirmation, password, ...userPayload } = createUserDto;
    password = await hashPassword(password);
    const user = this.userRepo.create({ password, ...userPayload });
    return this.userRepo.save(user);
  }

  //Not Really Needed
  // async verifyUser(id: number, verificationCode: string) {
  //   const user = await this.findOne(id);
  //   if (!user) {
  //     return "Couldn't verify user";
  //   }

  //   if (user.verfied) {
  //     return 'User is already verified';
  //   }

  //   if (user.verificationCode === verificationCode) {
  //     user.verfied = 'true';

  //     this.userRepo.save(user);

  //     return 'User successfully verified';
  //   }

  //   return "Couldn't verify user";
  // }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return this.userRepo.save({ ...user, ...updateUserDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
