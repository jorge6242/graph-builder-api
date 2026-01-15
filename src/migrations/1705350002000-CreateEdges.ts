import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique, TableCheck } from 'typeorm';

export class CreateEdges1705350002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'edges',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'graph_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'source_topic_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'target_topic_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'score',
            type: 'decimal',
            precision: 6,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'strategy',
            type: 'varchar',
            length: '40',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_graph_source_target',
            columnNames: ['graph_id', 'source_topic_id', 'target_topic_id'],
          }),
        ],
        checks: [
          new TableCheck({
            name: 'CHK_source_less_than_target',
            expression: '"source_topic_id" < "target_topic_id"',
          }),
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'edges',
      new TableForeignKey({
        columnNames: ['graph_id'],
        referencedTableName: 'graphs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'edges',
      new TableForeignKey({
        columnNames: ['source_topic_id'],
        referencedTableName: 'topics',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'edges',
      new TableForeignKey({
        columnNames: ['target_topic_id'],
        referencedTableName: 'topics',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('edges');
  }
}
