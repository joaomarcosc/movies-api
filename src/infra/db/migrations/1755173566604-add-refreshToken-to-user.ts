import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1755173566604 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1755173566604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "hashedRefreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hashedRefreshToken"`);
    }

}
