import { Brackets, WhereExpressionBuilder } from 'typeorm';

import { ALIAS_SEPARATOR } from '../../constants';
import { QueryParams } from '../../query-params';
import { QueryParser } from '../../query-parser';
import { SelectUtils } from '../../utils';
import { TypeUtils } from '../../utils/type-utils';
import { filterOperators, logicalOperators } from './operators';
import { FilterParam, FilterOperators, LogicalMethod, LogicalOperators } from './types';

export interface FilterParserOptions {
  filterOperators?: FilterOperators;
  logicalOperators?: LogicalOperators;
}

const defaultOptions: FilterParserOptions = {
  filterOperators: filterOperators,
  logicalOperators: logicalOperators,
};

export class FilterParser<Entity> extends QueryParser<Entity, QueryParams, FilterParserOptions> {
  private readonly selectUtils = new SelectUtils<Entity>(this.selectQueryBuilder);

  private parameterIndex = 0;

  parse(query: QueryParams = {}): void {
    if (!query.filter) {
      return;
    }

    this.selectQueryBuilder.where(
      new Brackets((qb) => {
        this.buildFilter(qb, query.filter, this.mainAlias);
      }),
    );
  }

  private buildFilter(
    builder: WhereExpressionBuilder,
    filter: FilterParam,
    fieldPath: string,
    logical: LogicalMethod = 'andWhere',
  ) {
    Object.keys(filter).forEach((key: keyof FilterParam) => {
      const value = filter[key] as unknown;
      const isDefined = TypeUtils.isDefined(value);
      const isArray = TypeUtils.isArray(value);
      const isObject = TypeUtils.isObject(value);
      const isLogicalOperator = this.isLogicalOperator(key);

      if (!isDefined || (isArray && !value.length)) {
        return;
      }

      if (!isObject || (isArray && !isLogicalOperator)) {
        const operator = this.getFilterOperator(key);
        const propertyPath = this.selectUtils.getProperty(fieldPath);
        const parameters = this.makeParameters(value);
        const where = operator.where(propertyPath, parameters, value);
        const objectParameters = operator.parameters(parameters, value);

        builder[logical](where, objectParameters);

        return;
      }

      if (isArray && isLogicalOperator) {
        builder[logical](
          new Brackets((qb) => {
            value.forEach((filterInArray) => {
              this.buildFilter(qb, filterInArray, fieldPath, logicalOperators[key]);
            });
          }),
        );

        return;
      }

      this.buildFilter(builder, value as FilterParam, this.makeFieldPath(fieldPath, key), logical);
    });
  }

  private isLogicalOperator(key: string) {
    return Object.keys(this.logicalOperators).includes(key);
  }

  private makeFieldPath(fieldPath: string, field: string) {
    return `${fieldPath}${ALIAS_SEPARATOR}${field}`;
  }

  private makeParameters(value: unknown) {
    return [].concat(value).map(() => `:param_${this.parameterIndex++}`);
  }

  private getFilterOperator(key: string) {
    const FilterOperator = this.filterOperators[key];

    return new FilterOperator(this.selectQueryBuilder.connection);
  }

  private get mainAlias() {
    return this.selectQueryBuilder.alias;
  }

  private get filterOperators() {
    return this.parserOptions.filterOperators;
  }

  private get logicalOperators() {
    return this.parserOptions.logicalOperators;
  }

  private get parserOptions() {
    return {
      ...defaultOptions,
      ...this.options,
    };
  }
}
