import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageSetMigration1602627362419 implements MigrationInterface {
    name = 'ImageSetMigration1602627362419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar, "selectedImageId" integer, CONSTRAINT "UQ_330c0ab41c5b91cd1352b4560f2" UNIQUE ("selectedImageId"), CONSTRAINT "FK_fb95b5cae0a912507a396bf7bc4" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_image_set"("id", "name", "userName") SELECT "id", "name", "userName" FROM "image_set"`);
        await queryRunner.query(`DROP TABLE "image_set"`);
        await queryRunner.query(`ALTER TABLE "temporary_image_set" RENAME TO "image_set"`);
        await queryRunner.query(`CREATE TABLE "temporary_image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar, "selectedImageId" integer, CONSTRAINT "UQ_330c0ab41c5b91cd1352b4560f2" UNIQUE ("selectedImageId"), CONSTRAINT "FK_fb95b5cae0a912507a396bf7bc4" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e5d2a815323543de6e8f0e4fc91" FOREIGN KEY ("selectedImageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_image_set"("id", "name", "userName", "selectedImageId") SELECT "id", "name", "userName", "selectedImageId" FROM "image_set"`);
        await queryRunner.query(`DROP TABLE "image_set"`);
        await queryRunner.query(`ALTER TABLE "temporary_image_set" RENAME TO "image_set"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_set" RENAME TO "temporary_image_set"`);
        await queryRunner.query(`CREATE TABLE "image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar, "selectedImageId" integer, CONSTRAINT "UQ_330c0ab41c5b91cd1352b4560f2" UNIQUE ("selectedImageId"), CONSTRAINT "FK_fb95b5cae0a912507a396bf7bc4" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "image_set"("id", "name", "userName", "selectedImageId") SELECT "id", "name", "userName", "selectedImageId" FROM "temporary_image_set"`);
        await queryRunner.query(`DROP TABLE "temporary_image_set"`);
        await queryRunner.query(`ALTER TABLE "image_set" RENAME TO "temporary_image_set"`);
        await queryRunner.query(`CREATE TABLE "image_set" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL DEFAULT (''), "userName" varchar, CONSTRAINT "FK_fb95b5cae0a912507a396bf7bc4" FOREIGN KEY ("userName") REFERENCES "user" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "image_set"("id", "name", "userName") SELECT "id", "name", "userName" FROM "temporary_image_set"`);
        await queryRunner.query(`DROP TABLE "temporary_image_set"`);
    }

}
