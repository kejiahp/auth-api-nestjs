import { Injectable } from '@nestjs/common';
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
    let { passwordConfirmation, password, ...userPayload } = createUserDto;
    password = await hashPassword(password);
    const user = this.userRepo.create({ password, ...userPayload });
    return this.userRepo.save(user);
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
