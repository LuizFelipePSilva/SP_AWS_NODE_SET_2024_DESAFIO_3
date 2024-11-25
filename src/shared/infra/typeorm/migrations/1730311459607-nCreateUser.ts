import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class nCreateUser1730142890438 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'fullName', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
