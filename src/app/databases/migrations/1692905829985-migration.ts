import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692905829985 implements MigrationInterface {
    name = 'Migration1692905829985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "path" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "path"`);
    }

}
