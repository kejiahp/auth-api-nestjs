import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Sessions } from './entities/sessions.entity';
import { SessionsService } from './sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions, User])],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
