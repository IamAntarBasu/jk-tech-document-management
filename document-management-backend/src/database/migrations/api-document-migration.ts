import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentManagementMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE Action AS ENUM ('READ', 'WRITE', 'DELETE', 'UPDATE');

      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );

      CREATE TABLE IF NOT EXISTS permissions (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS roles_permissions (
        id SERIAL NOT NULL,
        role_id INT NOT NULL,
        access_type Action NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (id, role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
      );

      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        original_name VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        mimeType VARCHAR NOT NULL,
        uploadedAt TIMESTAMP DEFAULT now()
      );

      INSERT INTO roles (id, name) 
      VALUES (1, 'Admin'), (2, 'Editor'), (3, 'Viewer')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO permissions (id, name, description) 
      VALUES 
        (1, 'Document', 'Resource to manage Documents'), 
        (2, 'Ingestion', 'Able to Download a document'), 
        (3, 'User', 'Able to create a user')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO users (email, role_id, first_name, last_name, password)
      SELECT 'superadmin@admin.com', 1, 'Admin', 'Admin', 
        '$2a$10$yRrTPmvJdRhsx4RCWxlZs.N7QtwnBJNL/KddgnJ0C2.iMmhkWkAMi'
      WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE email = 'superadmin@admin.com'
      );

      INSERT INTO roles_permissions (role_id, permission_id, access_type) 
      VALUES 
        (1, 1, 'READ'), (1, 1, 'WRITE'), (1, 1, 'UPDATE'), (1, 1, 'DELETE'),
        (1, 2, 'READ'), (1, 2, 'WRITE'), (1, 2, 'UPDATE'), (1, 2, 'READ'),
        (1, 3, 'READ'), (1, 3, 'WRITE'), (1, 3, 'UPDATE'), (1, 3, 'DELETE'),
        (2, 1, 'READ'), (2, 1, 'WRITE'), (2, 1, 'UPDATE'), (2, 1, 'DELETE'),
        (2, 2, 'READ'), (2, 2, 'WRITE'),
        (3, 1, 'READ'), (3, 2, 'READ')
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'superadmin@admin.com';
      DELETE FROM roles_permissions WHERE (role_id, permission_id, access_type) IN (
        (1, 1, 'READ'), (1, 1, 'WRITE'), (1, 1, 'UPDATE'), (1, 1, 'DELETE'),
        (1, 2, 'READ'), (1, 2, 'WRITE'), (1, 2, 'UPDATE'), (1, 2, 'READ'),
        (1, 3, 'READ'), (1, 3, 'WRITE'), (1, 3, 'UPDATE'), (1, 3, 'DELETE'),
        (2, 1, 'READ'), (2, 1, 'WRITE'), (2, 1, 'UPDATE'), (2, 1, 'DELETE'),
        (2, 2, 'READ'), (2, 2, 'WRITE'),
        (3, 1, 'READ'), (3, 2, 'READ')
      );

      DELETE FROM permissions WHERE id IN (1, 2, 3);
      DELETE FROM roles WHERE id IN (1, 2, 3);

      DROP TABLE IF EXISTS documents;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS roles_permissions;
      DROP TABLE IF EXISTS roles;
      DROP TABLE IF EXISTS permissions;
      DROP TYPE IF EXISTS Action;
    `);
  }
}
