import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';
import { SelectUtils } from '../utils';

type OrderPriority = 'ASC' | 'DESC';

const DESC_START_CHAR = '-';

export class SortParser<Entity> extends QueryParser<Entity, QueryParams> {
  private readonly selectUtils = new SelectUtils<Entity>(this.selectQueryBuilder);

  parse(query: QueryParams = {}): void {
    if (!query.sort?.length) {
      return;
    }

    this.selectQueryBuilder.orderBy(this.getOrderByCondition(query.sort));
  }

  private getOrderByCondition(sort: string[]): Record<string, OrderPriority> {
    return sort.reduce((orderBy, field) => {
      const orderPriority = this.getOrderPriority(field);
      const orderField = this.getOrderField(field);

      if (!orderField) {
        return orderBy;
      }

      return { ...orderBy, [orderField]: orderPriority };
    }, {});
  }

  private isDescending(field: string) {
    return field.startsWith(DESC_START_CHAR);
  }

  private getOrderPriority(field: string) {
    return this.isDescending(field) ? 'DESC' : 'ASC';
  }

  private getOrderField(field: string) {
    const fieldKey = this.isDescending(field) ? field.slice(1) : field;

    return this.selectUtils.getProperty(fieldKey);
  }
}
