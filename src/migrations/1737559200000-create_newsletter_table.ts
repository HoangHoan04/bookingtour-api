import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNewsletterTable1737559200000 implements MigrationInterface {
  name = 'CreateNewsletterTable1737559200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'newsletter',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'subscribedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'unsubscribedAt',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'createdBy',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedBy',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'isDeleted',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    // Tạo unique index cho email
    await queryRunner.createIndex(
      'newsletter',
      new TableIndex({
        name: 'IDX_NEWSLETTER_EMAIL',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('newsletter', 'IDX_NEWSLETTER_EMAIL');
    await queryRunner.dropTable('newsletter');
  }
}
