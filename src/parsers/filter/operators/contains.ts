import { FilterOperator } from '../operator';

export class ContainsFilterOperator extends FilterOperator {
  where(propertyPath: string, parameters: string[]): string {
    if (this.supportsIlike) {
      return `${propertyPath} ILIKE ${parameters[0]}`;
    }

    return `UPPER(${propertyPath}) LIKE UPPER(${parameters[0]})`;
  }

  protected makeParameterValue(value: unknown) {
    return `%${value}%`;
  }

  private get supportsIlike() {
    return this.driver.options.type === 'postgres' || this.driver.options.type === 'cockroachdb';
  }
}
