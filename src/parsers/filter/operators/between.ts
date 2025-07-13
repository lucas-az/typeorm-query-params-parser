import { FilterOperator } from '../operator';

export class BetweenFilterOperator extends FilterOperator {
  where(propertyPath: string, parameters: string[]): string {
    return `${propertyPath} BETWEEN ${parameters[0]} AND ${parameters[1]}`;
  }
}
