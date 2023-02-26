import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { migration11677244027199 } from './migrations/1677244027199-migration1';
import { migration21677428291316 } from './migrations/1677428291316-migration2';
import { migration31677443790722 } from './migrations/1677443790722-migration3';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: configService.get<string>('DB_NAME'),
  entities: [User],
  synchronize: false,
  migrations: [
    migration11677244027199,
    migration21677428291316,
    migration31677443790722,
  ],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
