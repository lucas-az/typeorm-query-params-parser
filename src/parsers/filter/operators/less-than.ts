import { FilterOperator } from '../operator';

export class LessThanFilterOperator extends FilterOperator {
  where(propertyPath: string, parameters: string[]): string {
    return `${propertyPath} < ${parameters[0]}`;
  }
}
