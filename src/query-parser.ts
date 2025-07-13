import { SelectQueryBuilder } from 'typeorm';

import { QueryParams } from './query-params';

export abstract class QueryParser<Entity, Query = QueryParams, ParserOptions = Record<string, unknown>> {
  constructor(
    public readonly selectQueryBuilder: SelectQueryBuilder<Entity>,
    public readonly options?: ParserOptions,
  ) {}

  abstract parse(query: Query): void;
}
