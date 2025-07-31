import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';
import { TypeUtils } from '../utils/type-utils';

export class WithDeletedParser<Entity> extends QueryParser<Entity> {
  parse(query: QueryParams = {}): void {
    if (!query.withDeleted || TypeUtils.toBoolean(query.withDeleted) === false) {
      return;
    }

    this.selectQueryBuilder.withDeleted();
  }
}
