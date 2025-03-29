import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { getConfig } from "./src/middlewares/services/app-config/configuration";

const {
  database: { host, port, password, user, dbName },
} = getConfig();

const config: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "documentManagementDB",
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/**/migrations/*.ts"],
  seeds: ["src/**/seeds/*.ts"],
  subscribers: ["src/**/subscribers/*.ts"],
};

const dataSource = new DataSource(config);

export default dataSource;
