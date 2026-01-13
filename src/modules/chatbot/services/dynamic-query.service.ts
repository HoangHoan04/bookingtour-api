import { Inject, Injectable, Logger } from '@nestjs/common';
import { DATA_SOURCE } from 'src/constants';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { SchemaDiscoveryService } from './schema-discovery.service';

@Injectable()
export class DynamicQueryService {
  private readonly logger = new Logger(DynamicQueryService.name);

  constructor(
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    private readonly schemaService: SchemaDiscoveryService,
  ) {}

  async count(params: CountQueryParams): Promise<number> {
    try {
      const schema = this.schemaService.getEntitySchema(params.tableName);
      if (!schema) {
        throw new Error(`Entity ${params.tableName} không tồn tại`);
      }

      const metadata = this.schemaService.getEntityMetadata(params.tableName);
      const repository = this.dataSource.getRepository(metadata!.target);

      let queryBuilder = repository.createQueryBuilder(params.tableName);
      if (params.filters) {
        queryBuilder = this.applyFilters(
          queryBuilder,
          params.tableName,
          params.filters,
        );
      }

      return await queryBuilder.getCount();
    } catch (error) {
      this.logger.error(`Lỗi count query: ${error.message}`);
      throw error;
    }
  }

  async find(params: FindQueryParams): Promise<any[]> {
    try {
      const schema = this.schemaService.getEntitySchema(params.tableName);
      if (!schema) {
        throw new Error(`Entity ${params.tableName} không tồn tại`);
      }

      const metadata = this.schemaService.getEntityMetadata(params.tableName);
      const repository = this.dataSource.getRepository(metadata!.target);

      let queryBuilder = repository.createQueryBuilder(params.tableName);
      if (params.includeRelations) {
        queryBuilder = this.autoJoinRelations(
          queryBuilder,
          params.tableName,
          schema,
          params.includeRelations,
        );
      }
      if (params.filters) {
        queryBuilder = this.applyFilters(
          queryBuilder,
          params.tableName,
          params.filters,
        );
      }
      if (params.searchTerm) {
        queryBuilder = this.applyTextSearch(
          queryBuilder,
          params.tableName,
          schema,
          params.searchTerm,
        );
      }
      if (params.selectColumns && params.selectColumns.length > 0) {
        const selections = params.selectColumns.map(
          (col) => `${params.tableName}.${col}`,
        );
        queryBuilder.select(selections);
      }
      if (params.limit) {
        queryBuilder.take(params.limit);
      }
      if (params.offset) {
        queryBuilder.skip(params.offset);
      }
      if (params.orderBy) {
        for (const [column, direction] of Object.entries(params.orderBy)) {
          queryBuilder.addOrderBy(
            `${params.tableName}.${column}`,
            direction as 'ASC' | 'DESC',
          );
        }
      }

      const results = await queryBuilder.getMany();
      return results;
    } catch (error) {
      this.logger.error(`Lỗi find query: ${error.message}`);
      throw error;
    }
  }

  async findOne(params: FindOneQueryParams): Promise<any | null> {
    try {
      const schema = this.schemaService.getEntitySchema(params.tableName);
      if (!schema) {
        throw new Error(`Entity ${params.tableName} không tồn tại`);
      }

      const metadata = this.schemaService.getEntityMetadata(params.tableName);
      const repository = this.dataSource.getRepository(metadata!.target);

      let queryBuilder = repository.createQueryBuilder(params.tableName);
      if (params.includeRelations) {
        queryBuilder = this.autoJoinRelations(
          queryBuilder,
          params.tableName,
          schema,
          params.includeRelations,
        );
      }
      if (params.filters) {
        queryBuilder = this.applyFilters(
          queryBuilder,
          params.tableName,
          params.filters,
        );
      }

      return await queryBuilder.getOne();
    } catch (error) {
      this.logger.error(`Lỗi findOne query: ${error.message}`);
      throw error;
    }
  }

  async aggregate(params: AggregateQueryParams): Promise<any[]> {
    try {
      const schema = this.schemaService.getEntitySchema(params.tableName);
      if (!schema) {
        throw new Error(`Entity ${params.tableName} không tồn tại`);
      }

      const metadata = this.schemaService.getEntityMetadata(params.tableName);
      const repository = this.dataSource.getRepository(metadata!.target);

      let queryBuilder = repository.createQueryBuilder(params.tableName);
      if (params.groupBy && params.groupBy.length > 0) {
        params.groupBy.forEach((col) => {
          queryBuilder.addGroupBy(`${params.tableName}.${col}`);
        });
      }
      const selections: string[] = [];
      if (params.groupBy) {
        params.groupBy.forEach((col) => {
          selections.push(`${params.tableName}.${col}`);
        });
      }

      if (params.aggregations) {
        params.aggregations.forEach((agg) => {
          const alias = agg.alias || `${agg.function}_${agg.column}`;
          selections.push(
            `${agg.function.toUpperCase()}(${params.tableName}.${agg.column}) as ${alias}`,
          );
        });
      }

      if (selections.length > 0) {
        queryBuilder.select(selections);
      }
      if (params.filters) {
        queryBuilder = this.applyFilters(
          queryBuilder,
          params.tableName,
          params.filters,
        );
      }

      return await queryBuilder.getRawMany();
    } catch (error) {
      throw error;
    }
  }

  private autoJoinRelations(
    queryBuilder: SelectQueryBuilder<any>,
    tableName: string,
    schema: any,
    includeRelations: boolean | string[],
  ): SelectQueryBuilder<any> {
    if (includeRelations === true) {
      schema.relations.forEach((rel: any) => {
        queryBuilder.leftJoinAndSelect(`${tableName}.${rel.name}`, rel.name);
      });
    } else if (Array.isArray(includeRelations)) {
      includeRelations.forEach((relName) => {
        const relation = schema.relations.find((r: any) => r.name === relName);
        if (relation) {
          queryBuilder.leftJoinAndSelect(`${tableName}.${relName}`, relName);
        }
      });
    }
    return queryBuilder;
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    tableName: string,
    filters: QueryFilter[],
  ): SelectQueryBuilder<any> {
    filters.forEach((filter, index) => {
      const paramName = `param_${index}`;
      const column = `${tableName}.${filter.field}`;

      switch (filter.operator) {
        case 'eq':
          queryBuilder.andWhere(`${column} = :${paramName}`, {
            [paramName]: filter.value,
          });
          break;
        case 'ne':
          queryBuilder.andWhere(`${column} != :${paramName}`, {
            [paramName]: filter.value,
          });
          break;
        case 'gt':
          queryBuilder.andWhere(`${column} > :${paramName}`, {
            [paramName]: filter.value,
          });
          break;
        case 'gte':
          queryBuilder.andWhere(`${column} >= :${paramName}`, {
            [paramName]: filter.value,
          });
          break;
        case 'lt':
          queryBuilder.andWhere(`${column} < :${paramName}`, {
            [paramName]: filter.value,
          });
          break;
        case 'lte':
          queryBuilder.andWhere(`${column} <= :${paramName}`, {
            [paramName]: filter.value,
          });
          break;
        case 'like':
          queryBuilder.andWhere(`${column} LIKE :${paramName}`, {
            [paramName]: `%${filter.value}%`,
          });
          break;
        case 'in':
          queryBuilder.andWhere(`${column} IN (:...${paramName})`, {
            [paramName]: filter.value,
          });
          break;
        case 'isNull':
          queryBuilder.andWhere(`${column} IS NULL`);
          break;
        case 'isNotNull':
          queryBuilder.andWhere(`${column} IS NOT NULL`);
          break;
      }
    });

    return queryBuilder;
  }

  private applyTextSearch(
    queryBuilder: SelectQueryBuilder<any>,
    tableName: string,
    schema: any,
    searchTerm: string,
  ): SelectQueryBuilder<any> {
    const searchableColumns = schema.searchableColumns;

    if (searchableColumns.length > 0) {
      const conditions = searchableColumns
        .map((col: string) => `${tableName}.${col} LIKE :searchTerm`)
        .join(' OR ');

      queryBuilder.andWhere(`(${conditions})`, {
        searchTerm: `%${searchTerm}%`,
      });
    }

    return queryBuilder;
  }

  async findWithAutoJoin(params: AutoJoinQueryParams): Promise<any[]> {
    try {
      const path = this.schemaService.findPathBetweenEntities(
        params.sourceTable,
        params.targetTable,
      );

      if (!path || path.length < 2) {
        throw new Error(
          `Không tìm thấy relationship giữa ${params.sourceTable} và ${params.targetTable}`,
        );
      }

      this.logger.log(`🔗 Auto-join path: ${path.join(' -> ')}`);

      const sourceSchema = this.schemaService.getEntitySchema(
        params.sourceTable,
      );
      const metadata = this.schemaService.getEntityMetadata(params.sourceTable);
      const repository = this.dataSource.getRepository(metadata!.target);

      let queryBuilder = repository.createQueryBuilder(params.sourceTable);

      for (let i = 0; i < path.length - 1; i++) {
        const currentTable = path[i];
        const nextTable = path[i + 1];
        const schema = this.schemaService.getEntitySchema(currentTable);
        const relation = schema?.relations.find(
          (r) => r.targetEntity === nextTable,
        );

        if (relation) {
          queryBuilder.leftJoinAndSelect(
            `${currentTable}.${relation.name}`,
            relation.name,
          );
        }
      }

      if (params.filters) {
        queryBuilder = this.applyFilters(
          queryBuilder,
          params.sourceTable,
          params.filters,
        );
      }

      if (params.limit) {
        queryBuilder.take(params.limit);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(`Lỗi auto-join query: ${error.message}`);
      throw error;
    }
  }
}

export interface CountQueryParams {
  tableName: string;
  filters?: QueryFilter[];
}

export interface FindQueryParams {
  tableName: string;
  filters?: QueryFilter[];
  searchTerm?: string;
  includeRelations?: boolean | string[];
  selectColumns?: string[];
  limit?: number;
  offset?: number;
  orderBy?: Record<string, 'ASC' | 'DESC'>;
}

export interface FindOneQueryParams {
  tableName: string;
  filters?: QueryFilter[];
  includeRelations?: boolean | string[];
}

export interface AggregateQueryParams {
  tableName: string;
  groupBy?: string[];
  aggregations?: Aggregation[];
  filters?: QueryFilter[];
}

export interface Aggregation {
  function: 'count' | 'sum' | 'avg' | 'min' | 'max';
  column: string;
  alias?: string;
}

export interface QueryFilter {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'like'
    | 'in'
    | 'isNull'
    | 'isNotNull';
  value?: any;
}

export interface AutoJoinQueryParams {
  sourceTable: string;
  targetTable: string;
  filters?: QueryFilter[];
  limit?: number;
}
