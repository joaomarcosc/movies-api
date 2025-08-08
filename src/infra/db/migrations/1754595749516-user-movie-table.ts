import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMovieTable1754595749516 implements MigrationInterface {
  name = 'UserMovieTable1754595749516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "duration" character varying NOT NULL, "language" character varying NOT NULL, "genres" text array NOT NULL, "popularity" double precision NOT NULL DEFAULT '0', "votes" integer NOT NULL DEFAULT '0', "releaseDate" date NOT NULL, "budget" double precision NOT NULL DEFAULT '0', "revenue" double precision NOT NULL DEFAULT '0', "profit" double precision NOT NULL DEFAULT '0', "images" text array NOT NULL, "trailer" character varying, CONSTRAINT "UQ_5aa0bbd146c0082d3fc5a0ad5d8" UNIQUE ("title"), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
