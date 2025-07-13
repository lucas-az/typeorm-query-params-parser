import { FilterOperator } from '../operator';

export class InFilterOperator extends FilterOperator {
  where(propertyPath: string, parameters: string[]): string {
    return `${propertyPath} IN (${parameters.join(', ')})`;
  }
}
