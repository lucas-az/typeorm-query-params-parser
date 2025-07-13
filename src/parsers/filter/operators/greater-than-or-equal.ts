import { FilterOperator } from '../operator';

export class GreaterThanOrEqualFilterOperator extends FilterOperator {
  where(propertyPath: string, parameters: string[]): string {
    return `${propertyPath} >= ${parameters[0]}`;
  }
}
