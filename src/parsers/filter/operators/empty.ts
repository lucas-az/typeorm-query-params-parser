import { TypeUtils } from '../../../utils/type-utils';
import { FilterOperator } from '../operator';

export class EmptyFilterOperator extends FilterOperator {
  where(propertyPath: string, _: string[], beEmpty: unknown): string {
    if (TypeUtils.toBoolean(beEmpty)) {
      return `${propertyPath} = ''`;
    }

    return `${propertyPath} != ''`;
  }
}
