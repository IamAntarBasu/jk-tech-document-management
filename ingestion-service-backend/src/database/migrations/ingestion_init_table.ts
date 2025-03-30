import { MigrationInterface, QueryRunner } from 'typeorm';

export class IngestionTableMigration1743335505603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
          CREATE TYPE "Status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ingestions (
        id SERIAL PRIMARY KEY,
        document_id INTEGER UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        status Status NOT NULL DEFAULT 'PENDING',
        ingested_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE ingestions;');
    await queryRunner.query('DROP TYPE Status;');
  }
}
