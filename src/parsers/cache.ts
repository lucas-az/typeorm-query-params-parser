import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';

export class CacheParser<Entity> extends QueryParser<Entity> {
  parse(query: QueryParams = {}): void {
    if (!query.cache && query.cache !== false) {
      return;
    }

    if (Array.isArray(query.cache)) {
      this.selectQueryBuilder.cache(query.cache[0], query.cache[1]);
    } else {
      this.selectQueryBuilder.cache(query.cache);
    }
  }
}
