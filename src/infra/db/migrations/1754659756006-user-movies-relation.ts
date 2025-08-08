import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMoviesRelation1754659756006 implements MigrationInterface {
  name = 'UserMoviesRelation1754659756006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_64a78407424745d6c053e93cc36" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT "FK_64a78407424745d6c053e93cc36"`,
    );
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "userId"`);
  }
}
