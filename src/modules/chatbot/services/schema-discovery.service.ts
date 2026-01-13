import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DATA_SOURCE } from 'src/constants';
import { DataSource, EntityMetadata } from 'typeorm';

@Injectable()
export class SchemaDiscoveryService implements OnModuleInit {
  private readonly logger = new Logger(SchemaDiscoveryService.name);
  private entitySchemas: Map<string, EntitySchemaInfo> = new Map();
  private relationshipGraph: Map<string, string[]> = new Map();

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.discoverSchema();
  }

  private async discoverSchema() {
    try {
      const entities = this.dataSource.entityMetadatas;
      this.logger.log(`🔍 Đang quét ${entities.length} entities...`);

      for (const entity of entities) {
        const schemaInfo = this.analyzeEntity(entity);
        this.entitySchemas.set(entity.tableName, schemaInfo);
        this.buildRelationshipGraph(entity);
      }

      this.logger.log(`Quét xong ${this.entitySchemas.size} entities`);
      this.logger.log(
        `Phát hiện ${this.relationshipGraph.size} entities có relations`,
      );
    } catch (error) {
      this.logger.error(`Lỗi quét schema: ${error.message}`);
    }
  }

  private analyzeEntity(metadata: EntityMetadata): EntitySchemaInfo {
    const columns: ColumnInfo[] = metadata.columns.map((col) => ({
      name: col.propertyName,
      databaseName: col.databaseName,
      type: col.type as string,
      isPrimary: col.isPrimary,
      isNullable: col.isNullable,
      isUnique: metadata.uniques.some((unique) =>
        unique.columns.some(
          (uniqueCol) => uniqueCol.propertyName === col.propertyName,
        ),
      ),
      comment: col.comment,
    }));

    const relations: RelationInfo[] = metadata.relations.map((rel) => ({
      name: rel.propertyName,
      type: rel.relationType,
      targetEntity: rel.inverseEntityMetadata.tableName,
      targetEntityName: rel.inverseEntityMetadata.name,
      isNullable: rel.isNullable,
      inverseSide: rel.inverseSidePropertyPath,
    }));

    return {
      tableName: metadata.tableName,
      entityName: metadata.name,
      targetName: metadata.targetName,
      columns,
      relations,
      primaryColumns: columns.filter((c) => c.isPrimary),
      searchableColumns: this.identifySearchableColumns(columns),
      displayColumns: this.identifyDisplayColumns(columns),
    };
  }

  private identifySearchableColumns(columns: ColumnInfo[]): string[] {
    const searchableTypes = [
      'varchar',
      'text',
      'character varying',
      'string',
      'nvarchar',
    ];
    return columns
      .filter(
        (col) =>
          searchableTypes.some((type) =>
            col.type.toString().toLowerCase().includes(type),
          ) && !col.isPrimary,
      )
      .map((col) => col.name);
  }

  private identifyDisplayColumns(columns: ColumnInfo[]): string[] {
    const priorityFields = [
      'name',
      'fullName',
      'title',
      'code',
      'email',
      'phone',
      'description',
      'status',
    ];

    const displayCols = columns
      .filter((col) => {
        const lowerName = col.name.toLowerCase();
        return (
          priorityFields.some((field) => lowerName.includes(field)) ||
          !col.isPrimary
        );
      })
      .map((col) => col.name);

    return displayCols.slice(0, 10);
  }

  private buildRelationshipGraph(metadata: EntityMetadata) {
    const tableName = metadata.tableName;
    const relatedTables = metadata.relations.map(
      (rel) => rel.inverseEntityMetadata.tableName,
    );

    if (relatedTables.length > 0) {
      this.relationshipGraph.set(tableName, relatedTables);
    }
  }

  getEntitySchema(tableName: string): EntitySchemaInfo | undefined {
    return this.entitySchemas.get(tableName);
  }

  getAllEntities(): EntitySchemaInfo[] {
    return Array.from(this.entitySchemas.values());
  }

  findEntitiesByName(searchTerm: string): EntitySchemaInfo[] {
    const term = searchTerm.toLowerCase();
    return this.getAllEntities().filter(
      (entity) =>
        entity.tableName.toLowerCase().includes(term) ||
        entity.entityName.toLowerCase().includes(term),
    );
  }

  getRelatedEntities(tableName: string): string[] {
    return this.relationshipGraph.get(tableName) || [];
  }

  generateSchemaContext(): string {
    const entities = this.getAllEntities();
    const context = entities
      .map((entity) => {
        const columns = entity.columns
          .map((col) => `${col.name} (${col.type})`)
          .join(', ');
        const relations = entity.relations
          .map((rel) => `${rel.name} -> ${rel.targetEntity}`)
          .join(', ');

        return ` Table: ${entity.tableName} (${entity.entityName})
                Columns: ${columns}
                Relations: ${relations || 'none'}
                Searchable: ${entity.searchableColumns.join(', ')}`;
      })
      .join('\n');

    return `
        DATABASE SCHEMA OVERVIEW Total Entities: ${entities.length} ${context}`;
  }

  generateCompactSchemaContext(): string {
    const entities = this.getAllEntities();
    return entities
      .map((e) => {
        const mainFields = e.displayColumns.slice(0, 5).join(', ');
        const relCount = e.relations.length;
        return `${e.tableName}: [${mainFields}] (${relCount} relations)`;
      })
      .join('\n');
  }

  findPathBetweenEntities(source: string, target: string): string[] | null {
    if (source === target) return [source];

    const queue: { entity: string; path: string[] }[] = [
      { entity: source, path: [source] },
    ];
    const visited = new Set<string>([source]);

    while (queue.length > 0) {
      const { entity, path } = queue.shift()!;
      const related = this.relationshipGraph.get(entity) || [];

      for (const relatedEntity of related) {
        if (relatedEntity === target) {
          return [...path, relatedEntity];
        }

        if (!visited.has(relatedEntity)) {
          visited.add(relatedEntity);
          queue.push({
            entity: relatedEntity,
            path: [...path, relatedEntity],
          });
        }
      }
    }

    return null;
  }

  getEntityMetadata(tableName: string): EntityMetadata | undefined {
    return this.dataSource.entityMetadatas.find(
      (meta) => meta.tableName === tableName,
    );
  }
}

export interface EntitySchemaInfo {
  tableName: string;
  entityName: string;
  targetName: string;
  columns: ColumnInfo[];
  relations: RelationInfo[];
  primaryColumns: ColumnInfo[];
  searchableColumns: string[];
  displayColumns: string[];
}

export interface ColumnInfo {
  name: string;
  databaseName: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  comment?: string;
}

export interface RelationInfo {
  name: string;
  type: string;
  targetEntity: string;
  targetEntityName: string;
  isNullable: boolean;
  inverseSide?: string;
}
