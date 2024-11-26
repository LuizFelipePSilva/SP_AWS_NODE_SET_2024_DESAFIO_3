import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCarItem1730647606554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criação da tabela 'car_item'
    await queryRunner.createTable(
      new Table({
        name: 'car_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'car_id', type: 'uuid', isNullable: false }, // Define car_id como uuid e não nulo
        ],
      })
    );

    // Adiciona a chave estrangeira
    await queryRunner.createForeignKey(
      'car_items',
      new TableForeignKey({
        columnNames: ['car_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cars',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a chave estrangeira primeiro
    await queryRunner.dropForeignKey('car_items', 'FK_car_item_car_id');

    // Exclui a tabela 'car_item'
    await queryRunner.dropTable('car_items');
  }
}
