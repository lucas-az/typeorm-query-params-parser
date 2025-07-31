import {
  CacheParser,
  FilterParser,
  FilterParserOptions,
  PaginationParser,
  PaginationParserOptions,
  RelationsParser,
  SelectParser,
  WithDeletedParser,
} from './parsers';
import { SortParser } from './parsers/sort';
import { QueryParams } from './query-params';
import { QueryParser } from './query-parser';

export interface TypeORMQueryParserOptions {
  pagination?: PaginationParserOptions;
  filter?: FilterParserOptions;
}

export class TypeORMQueryParser<Entity> extends QueryParser<Entity, QueryParams, TypeORMQueryParserOptions> {
  parse(query: QueryParams) {
    this.parsers.forEach((parser) => parser.parse(query));
  }

  protected get parsers() {
    return [
      new RelationsParser(this.selectQueryBuilder),
      new SelectParser(this.selectQueryBuilder),
      new SortParser(this.selectQueryBuilder),
      new FilterParser(this.selectQueryBuilder, this.options?.filter),
      new PaginationParser(this.selectQueryBuilder, this.options?.pagination),
      new CacheParser(this.selectQueryBuilder),
      new WithDeletedParser(this.selectQueryBuilder),
    ];
  }
}
