import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1602442965332 implements MigrationInterface {
    name = 'UserMigration1602442965332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("name" varchar PRIMARY KEY NOT NULL, "pwHash" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar, CONSTRAINT "FK_fb95b5cae0a912507a396bf7bc4" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_image_set"("id", "name", "userName") SELECT "id", "name", "userName" FROM "image_set"`);
        await queryRunner.query(`DROP TABLE "image_set"`);
        await queryRunner.query(`ALTER TABLE "temporary_image_set" RENAME TO "image_set"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_set" RENAME TO "temporary_image_set"`);
        await queryRunner.query(`CREATE TABLE "image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar)`);
        await queryRunner.query(`INSERT INTO "image_set"("id", "name", "userName") SELECT "id", "name", "userName" FROM "temporary_image_set"`);
        await queryRunner.query(`DROP TABLE "temporary_image_set"`);
        await queryRunner.query(`DROP TABLE "image_set"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
