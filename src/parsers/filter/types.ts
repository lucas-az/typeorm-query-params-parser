import { DataSource } from 'typeorm';

import { FilterOperator } from './operator';

export type FilterOperators = Record<string, new (dataSource: DataSource) => FilterOperator>;

export type LogicalMethod = 'andWhere' | 'orWhere';

export type LogicalOperators = Record<string, LogicalMethod>;
