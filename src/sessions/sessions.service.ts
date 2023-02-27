import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Sessions } from './entities/sessions.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Sessions)
    private sessionsRepository: Repository<Sessions>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async userWithSessionCheck(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('Invalid User');
    }

    return user;
  }

  async prevSessionExist(userId: number) {
    const user = await this.userWithSessionCheck(userId);

    const session = await this.sessionsRepository.findOne({
      where: {
        user: user.sessions,
        valid: true,
      },
      relations: ['user'],
    });

    return session;
  }

  async createSession(userId: number) {
    const user = await this.userWithSessionCheck(userId);

    //checking if a session for that user exist
    const prevSessionExist = await this.prevSessionExist(user.id);

    if (prevSessionExist) {
      return prevSessionExist;
    }

    const session = this.sessionsRepository.create({
      user,
    });

    return await this.sessionsRepository.save(session);
  }

  findSession(id: number) {
    const session = this.sessionsRepository.findOne({
      where: {
        id,
        valid: true,
      },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Cant find session');
    }

    return session;
  }

  async invalidateSession(id: number) {
    const session = await this.findSession(id);
    session.valid = false;

    this.sessionsRepository.save(session);

    return 'Session invalidated';
  }
}
