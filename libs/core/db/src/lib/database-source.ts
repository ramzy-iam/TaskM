import { DataSource } from 'typeorm';

export const DataBaseSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'],
  port: process.env['DATABASE_PORT']
    ? Number.parseInt(process.env['DATABASE_PORT'])
    : 5432,
  username: process.env['DATABASE_USERNAME'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  schema: process.env['DATABASE_SCHEMA'],
  synchronize: false,
});
