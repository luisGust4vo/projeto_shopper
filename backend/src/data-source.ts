// src/data-source.ts

import { DataSource } from "typeorm";
import { Driver } from "./entities/Driver";

export const AppDataSource = new DataSource({
  type: "postgres", // ou o tipo do banco de dados que você está usando
  host: "localhost", // Endereço do banco de dados
  port: 5432, // Porta do banco de dados
  username: "postgres", // Usuário do banco
  password: "root", // Senha do banco
  database: "shopper", // Nome do banco
  synchronize: false, // Não sincroniza automaticamente, vamos usar migrations
  logging: true,
  entities: [Driver], // Adiciona suas entidades aqui
  migrations: ["src/migrations/*.ts"], // Caminho para suas migrations
  subscribers: [],
});
