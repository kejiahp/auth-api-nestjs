require('dotenv').config();
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: config.get<string>(process.env.DB_NAME),
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
