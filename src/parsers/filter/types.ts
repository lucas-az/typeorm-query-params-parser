import { DataSource } from 'typeorm';

import { FilterOperator } from './operator';

export type FilterOperators = Record<string, new (dataSource: DataSource) => FilterOperator>;

export type LogicalMethod = 'andWhere' | 'orWhere';

export type LogicalOperators = Record<string, LogicalMethod>;

export type FilterOperatorParams = {
  _eq?: unknown;
  _neq?: unknown;
  _lt?: unknown;
  _lte?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _contains?: string;
  _starts_with?: string;
  _ends_with?: string;
  _null?: unknown;
  _empty?: unknown;
  _in?: unknown[];
  _between?: [unknown, unknown];
};

export type FilterParam =
  | { [field: string]: FilterParam | FilterOperatorParams }
  | { _and: FilterParam[] }
  | { _or: FilterParam[] };
