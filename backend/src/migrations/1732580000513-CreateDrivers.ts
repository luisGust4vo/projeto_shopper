import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDrivers1732580000513 implements MigrationInterface {
  name = "CreateDrivers1732580000513";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "car" character varying NOT NULL, "rating" double precision NOT NULL, "minDistance" double precision NOT NULL, "pricePerKm" double precision NOT NULL, CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "drivers"`);
  }
}
