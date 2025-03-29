import { DataSource, DataSourceOptions } from 'typeorm';

import { getConfig } from './src/configuration/configuration';

const {
  database: { host, port, password, user, dbName },
} = getConfig();

// console.log({ host, port, password, user, dbName });

const config: DataSourceOptions = {
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "docManagementDB",
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/**/migrations/*.ts'],
  subscribers: ['src/**/subscribers/*.ts'],
};

const dataSource = new DataSource(config);

export default dataSource;
