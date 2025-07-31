import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';
import { TypeUtils } from '../utils/type-utils';

export interface PaginationParserOptions {
  /** The default number of items per page if not specified. Defaults to 25. */
  defaultLimit?: number;
  /** The default page number if not specified. Defaults to 1. */
  defaultPage?: number;
}

const defaultOptions: PaginationParserOptions = {
  defaultLimit: 25,
  defaultPage: 1,
};

export class PaginationParser<Entity> extends QueryParser<Entity, QueryParams, PaginationParserOptions> {
  parse(query: QueryParams = {}): void {
    if (TypeUtils.toBoolean(query.paginate) === false) {
      return;
    }

    const options = { ...defaultOptions, ...this.options };
    const limit = TypeUtils.toInt(query.limit) || options.defaultLimit;
    const page = TypeUtils.toInt(query.page) || options.defaultPage;
    const skip = limit * (page - 1);
    const take = limit;

    this.selectQueryBuilder.skip(skip).take(take);
  }
}
