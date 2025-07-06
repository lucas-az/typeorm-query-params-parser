import { DataSource, DataSourceOptions } from 'typeorm';

type TestingDataSourceOptions = Pick<DataSourceOptions, 'entities'>;

export class TestingDataSourceUtils {
  static create(options: TestingDataSourceOptions): Promise<DataSource> {
    return new DataSource({
      type: 'better-sqlite3',
      database: ':memory:',
      synchronize: true,
      ...options,
    }).initialize();
  }

  static close(dataSource: DataSource): Promise<void> {
    return dataSource.destroy();
  }
}
