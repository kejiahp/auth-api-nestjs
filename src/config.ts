export const config = () => ({
  database: {
    type: 'sqlite',
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
  },
});
