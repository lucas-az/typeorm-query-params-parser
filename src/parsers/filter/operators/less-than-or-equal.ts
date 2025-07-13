import { FilterOperator } from '../operator';

export class LessThanOrEqualFilterOperator extends FilterOperator {
  where(propertyPath: string, parameters: string[]): string {
    return `${propertyPath} <= ${parameters[0]}`;
  }
}
