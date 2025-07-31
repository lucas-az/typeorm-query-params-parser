import { DataSource, SelectQueryBuilder } from 'typeorm';

import { PaginationParser, PaginationParserOptions } from '../src/parsers/pagination';
import { TestingDataSourceUtils } from './data-source-utils';
import { User } from './entities/user';

describe('PaginationParser', () => {
  let dataSource: DataSource;
  let selectQueryBuilder: SelectQueryBuilder<User>;

  function getSelectQueryBuilder(): SelectQueryBuilder<User> {
    return dataSource.createQueryBuilder(User, 'user').select('user.id');
  }

  function getPaginationParser(options?: PaginationParserOptions) {
    return new PaginationParser(selectQueryBuilder, options);
  }

  beforeAll(async () => {
    dataSource = await TestingDataSourceUtils.create({
      entities: [`${__dirname}/entities/*.ts`],
    });
  });

  afterAll(async () => {
    await TestingDataSourceUtils.close(dataSource);
  });

  beforeEach(() => {
    selectQueryBuilder = getSelectQueryBuilder();
  });

  it('should not paginate if paginate option is false', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user"';

    parser.parse({ paginate: false });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should paginate if paginate option is not defined', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 25 OFFSET 0';

    parser.parse({});

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use default limit and page if not specified', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 25 OFFSET 0';

    parser.parse({ paginate: true });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use provided limit and page from query', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 10 OFFSET 20';

    parser.parse({ paginate: true, limit: 10, page: 3 });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use default limit if only page is provided', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 25 OFFSET 25';

    parser.parse({ paginate: true, page: 2 });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use default page if only limit is provided', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 15 OFFSET 0';

    parser.parse({ paginate: true, limit: 15 });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use custom default options if provided', () => {
    const parser = getPaginationParser({ defaultLimit: 5, defaultPage: 4 });
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 5 OFFSET 15';

    parser.parse({ paginate: true });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should paginate if query is not defined', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 25 OFFSET 0';

    parser.parse(undefined);

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should not paginate if paginate option is string false', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user"';

    parser.parse({
      paginate: 'false',
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use provided string limit and page from query', () => {
    const parser = getPaginationParser();
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" LIMIT 10 OFFSET 20';

    parser.parse({ paginate: 'true', limit: '10', page: '3' });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });
});
