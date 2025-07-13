import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';

export class WithDeletedParser<Entity> extends QueryParser<Entity> {
  parse(query: QueryParams = {}): void {
    if (!query.withDeleted) {
      return;
    }

    this.selectQueryBuilder.withDeleted();
  }
}
