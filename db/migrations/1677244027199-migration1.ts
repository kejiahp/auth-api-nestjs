import { MigrationInterface, QueryRunner } from "typeorm";

export class migration11677244027199 implements MigrationInterface {
    name = 'migration11677244027199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "password" varchar NOT NULL, "verificationCode" varchar NOT NULL, "passwordResetCode" varchar, "verfied" varchar NOT NULL DEFAULT ('false'), "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "updatedDate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
