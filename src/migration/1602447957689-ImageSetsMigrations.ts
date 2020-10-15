import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageSetsMigrations1602447957689 implements MigrationInterface {
    name = 'ImageSetsMigrations1602447957689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("name" varchar PRIMARY KEY NOT NULL, "pwHash" varchar NOT NULL, "imageDirectory" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("name", "pwHash") SELECT "name", "pwHash" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("name" varchar PRIMARY KEY NOT NULL, "pwHash" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user"("name", "pwHash") SELECT "name", "pwHash" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
