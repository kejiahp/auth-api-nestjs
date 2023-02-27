import { MigrationInterface, QueryRunner } from "typeorm";

export class migration41677490488355 implements MigrationInterface {
    name = 'migration41677490488355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "valid" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_sessions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "valid" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sessions"("id", "valid", "createdAt", "updatedAt", "userId") SELECT "id", "valid", "createdAt", "updatedAt", "userId" FROM "sessions"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`ALTER TABLE "temporary_sessions" RENAME TO "sessions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" RENAME TO "temporary_sessions"`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "valid" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "sessions"("id", "valid", "createdAt", "updatedAt", "userId") SELECT "id", "valid", "createdAt", "updatedAt", "userId" FROM "temporary_sessions"`);
        await queryRunner.query(`DROP TABLE "temporary_sessions"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
    }

}
