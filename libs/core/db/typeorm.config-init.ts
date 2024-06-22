import { DataSource } from 'typeorm';
import baseSource from './typeorm.config';


const source = new DataSource({
  ...baseSource.options,
  migrations: [
    'libs/core/db/migration-script/data-init-db/1719064828251-SeedToInitDataBase.ts',
  ],
});

export default source;
