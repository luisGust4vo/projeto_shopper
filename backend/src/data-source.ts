// src/data-source.ts

import { DataSource } from "typeorm";
import { Driver } from "./entities/Driver";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "shopper",
  synchronize: false,
  logging: true,
  entities: [Driver],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
