import { TypeUtils } from '../../../utils/type-utils';
import { FilterOperator } from '../operator';

export class NullFilterOperator extends FilterOperator {
  where(propertyPath: string, _: string[], beNull: unknown): string {
    if (TypeUtils.toBoolean(beNull)) {
      return `${propertyPath} IS NULL`;
    }

    return `${propertyPath} IS NOT NULL`;
  }
}
