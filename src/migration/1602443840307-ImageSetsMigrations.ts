import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageSetsMigrations1602443840307 implements MigrationInterface {
    name = 'ImageSetsMigrations1602443840307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL DEFAULT (''), "imageSetId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_image"("id") SELECT "id" FROM "image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`ALTER TABLE "temporary_image" RENAME TO "image"`);
        await queryRunner.query(`CREATE TABLE "temporary_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL DEFAULT (''), "imageSetId" integer, CONSTRAINT "FK_0eabedee59a788e32d970c01bdb" FOREIGN KEY ("imageSetId") REFERENCES "image_set" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_image"("id", "url", "name", "imageSetId") SELECT "id", "url", "name", "imageSetId" FROM "image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`ALTER TABLE "temporary_image" RENAME TO "image"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME TO "temporary_image"`);
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL DEFAULT (''), "imageSetId" integer)`);
        await queryRunner.query(`INSERT INTO "image"("id", "url", "name", "imageSetId") SELECT "id", "url", "name", "imageSetId" FROM "temporary_image"`);
        await queryRunner.query(`DROP TABLE "temporary_image"`);
        await queryRunner.query(`ALTER TABLE "image" RENAME TO "temporary_image"`);
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
        await queryRunner.query(`INSERT INTO "image"("id") SELECT "id" FROM "temporary_image"`);
        await queryRunner.query(`DROP TABLE "temporary_image"`);
    }

}
