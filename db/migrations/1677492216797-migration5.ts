import { MigrationInterface, QueryRunner } from "typeorm";

export class migration51677492216797 implements MigrationInterface {
    name = 'migration51677492216797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "password" varchar NOT NULL, "verificationCode" varchar NOT NULL, "passwordResetCode" varchar, "verfied" boolean NOT NULL DEFAULT (0), "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "updatedDate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "email", "firstname", "lastname", "password", "verificationCode", "passwordResetCode", "verfied", "createdDate", "updatedDate") SELECT "id", "email", "firstname", "lastname", "password", "verificationCode", "passwordResetCode", "verfied", "createdDate", "updatedDate" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "password" varchar NOT NULL, "verificationCode" varchar NOT NULL, "passwordResetCode" varchar, "verfied" boolean NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "updatedDate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "email", "firstname", "lastname", "password", "verificationCode", "passwordResetCode", "verfied", "createdDate", "updatedDate") SELECT "id", "email", "firstname", "lastname", "password", "verificationCode", "passwordResetCode", "verfied", "createdDate", "updatedDate" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

}
