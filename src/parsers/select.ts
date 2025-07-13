import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';
import { SelectUtils } from '../utils';

const MULTISELECT_TOKEN = '*';

export class SelectParser<Entity> extends QueryParser<Entity, QueryParams> {
  private readonly selectUtils = new SelectUtils<Entity>(this.selectQueryBuilder);

  parse(query: QueryParams = {}): void {
    if (!query.select?.length) {
      return;
    }

    const selection = Array.from(new Set(query.select.flatMap((field) => this.selectProperties(field))));

    this.selectQueryBuilder.select(selection);
  }

  private selectProperties(field: string) {
    if (field.includes(MULTISELECT_TOKEN)) {
      return this.selectUtils.getAllProperties(field);
    }

    return [this.selectUtils.getProperty(field)];
  }
}
