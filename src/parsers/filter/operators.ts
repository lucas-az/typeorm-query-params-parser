import { BetweenFilterOperator } from './operators/between';
import { ContainsFilterOperator } from './operators/contains';
import { EmptyFilterOperator } from './operators/empty';
import { EndsWithFilterOperator } from './operators/ends-with';
import { EqualFilterOperator } from './operators/equal';
import { GreaterThanFilterOperator } from './operators/greater-than';
import { GreaterThanOrEqualFilterOperator } from './operators/greater-than-or-equal';
import { InFilterOperator } from './operators/in';
import { LessThanFilterOperator } from './operators/less-than';
import { LessThanOrEqualFilterOperator } from './operators/less-than-or-equal';
import { NotEqualFilterOperator } from './operators/not-equal';
import { NullFilterOperator } from './operators/null';
import { StartsWithFilterOperator } from './operators/starts-with';
import { FilterOperators, LogicalOperators } from './types';

export const logicalOperators: LogicalOperators = {
  _or: 'orWhere',
  _and: 'andWhere',
};

export const filterOperators: FilterOperators = {
  _eq: EqualFilterOperator,
  _neq: NotEqualFilterOperator,
  _lt: LessThanFilterOperator,
  _lte: LessThanOrEqualFilterOperator,
  _gt: GreaterThanFilterOperator,
  _gte: GreaterThanOrEqualFilterOperator,
  _contains: ContainsFilterOperator,
  _starts_with: StartsWithFilterOperator,
  _ends_with: EndsWithFilterOperator,
  _null: NullFilterOperator,
  _empty: EmptyFilterOperator,
  _in: InFilterOperator,
  _between: BetweenFilterOperator,
};
