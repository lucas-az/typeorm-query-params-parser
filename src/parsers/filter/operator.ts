import { DataSource, ObjectLiteral } from 'typeorm';

export abstract class FilterOperator {
  constructor(public readonly dataSource: DataSource) {}

  abstract where<T = unknown>(propertyPath: string, parameters: string[], value: T): string;

  parameters<T = unknown>(parameters: string[], value: T): ObjectLiteral {
    const arrayValue = [].concat(value);

    return [].concat(parameters).reduce(
      (object, param, index) => ({
        ...object,
        [this.makeParameterKey(param)]: this.makeParameterValue(arrayValue[index]),
      }),
      {},
    );
  }

  protected makeParameterKey(parameter: string) {
    return parameter.replace(':', '');
  }

  protected makeParameterValue(value: unknown) {
    return value;
  }

  get driver() {
    return this.dataSource.driver;
  }
}
