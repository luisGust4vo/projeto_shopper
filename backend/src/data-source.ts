import { DataSource } from "typeorm";
import { Driver } from "./entities/Driver";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "shopper",
  synchronize: false, // Importante deixar como false para usar migrações
  logging: true, // Habilita logs para depuração
  subscribers: [],
  entities: [__dirname + "/entities/*.ts"],
  migrations: [__dirname + "/migrations/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
