//THIS IS NO LONGER USED IN THE APPLICATION
import { User } from './users/entities/user.entity';

export const config = () => ({
  database: {
    type: 'sqlite',
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
  },
});
//THIS IS NO LONGER USED IN THE APPLICATION
