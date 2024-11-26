import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDriversTable1698302764281 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO drivers (name, description, car, rating, min_distance, price_per_km) VALUES
      ('Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 'Plymouth Valiant 1973 rosa e enferrujado', 2.0, 1, 2.50),
      ('Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 'Dodge Charger R/T 1970 modificado', 4.0, 5, 5.00),
      ('James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 'Aston Martin DB5 clássico', 5.0, 10, 10.00);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE drivers");
  }
}
