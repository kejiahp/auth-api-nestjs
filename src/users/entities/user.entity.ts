import { nanoid } from 'nanoid';
import { Sessions } from 'src/sessions/entities/sessions.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @Column()
  verificationCode: string = nanoid();

  @Column({ nullable: true })
  passwordResetCode: string;

  @Column({ type: 'boolean', default: false })
  verfied: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => Sessions, (sessions) => sessions.user)
  sessions: Sessions[];
}
