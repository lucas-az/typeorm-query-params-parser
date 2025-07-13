import { DataSource, SelectQueryBuilder } from 'typeorm';

import { FilterParser } from '../src/parsers/filter';
import { TestingDataSourceUtils } from './data-source-utils';
import { User } from './entities/user';

describe('FilterParser', () => {
  let dataSource: DataSource;
  let selectQueryBuilder: SelectQueryBuilder<User>;
  let parser: FilterParser<User>;

  beforeAll(async () => {
    dataSource = await TestingDataSourceUtils.create({
      entities: [`${__dirname}/entities/*.ts`],
    });
  });

  afterAll(async () => {
    await TestingDataSourceUtils.close(dataSource);
  });

  beforeEach(() => {
    selectQueryBuilder = dataSource.createQueryBuilder(User, 'user').select('user.id');
    parser = new FilterParser<User>(selectQueryBuilder);
  });

  it('should filter using provided options', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" WHERE ("user"."nameFirst" = :param_0 AND "user"."nameFirst" != :param_1 AND UPPER("user"."nameFirst") LIKE UPPER(:param_2) AND UPPER("user"."nameFirst") LIKE UPPER(:param_3) AND UPPER("user"."nameFirst") LIKE UPPER(:param_4) AND "user"."nameLast" IS NOT NULL AND "user"."nameLast" != \'\' AND "user"."age" < :param_7 AND "user"."age" <= :param_8 AND "user"."age" > :param_9 AND "user"."age" >= :param_10 AND "user"."age" BETWEEN :param_11 AND :param_12 AND "user"."age" IN (:param_13, :param_14, :param_15, :param_16) AND "user"."profileId" IS NULL AND "user"."profileId" = \'\')';
    const expectedParameters = expect.objectContaining({
      param_0: 'first name',
      param_1: 'other',
      param_2: '%name%',
      param_3: 'first%',
      param_4: '%name',
      param_7: 40,
      param_8: 39,
      param_9: 18,
      param_10: 19,
      param_11: 19,
      param_12: 39,
      param_13: 20,
      param_14: 21,
      param_15: 37,
      param_16: 38,
    });

    parser.parse({
      filter: {
        name: {
          first: {
            _eq: 'first name',
            _neq: 'other',
            _contains: 'name',
            _starts_with: 'first',
            _ends_with: 'name',
          },
          last: {
            _null: false,
            _empty: false,
          },
        },
        age: {
          _lt: 40,
          _lte: 39,
          _gt: 18,
          _gte: 19,
          _between: [19, 39],
          _in: [20, 21, 37, 38],
        },
        profile: {
          _null: true,
          _empty: true,
        },
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using "or" logical operator', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" WHERE (("user"."age" <= :param_0 OR "user"."age" >= :param_1))';
    const expectedParameters = {
      param_0: 39,
      param_1: 18,
    };

    parser.parse({
      filter: {
        _or: [
          {
            age: {
              _lte: 39,
            },
          },
          {
            age: {
              _gte: 18,
            },
          },
        ],
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using "and" logical operator', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" WHERE (("user"."age" <= :param_0 AND "user"."age" >= :param_1))';
    const expectedParameters = {
      param_0: 39,
      param_1: 18,
    };

    parser.parse({
      filter: {
        _and: [
          {
            age: {
              _lte: 39,
            },
          },
          {
            age: {
              _gte: 18,
            },
          },
        ],
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using both "or" and "and" logical operators', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" WHERE (((("user"."nameFirst" = :param_0 OR "user"."nameFirst" != :param_1) AND "user"."age" >= :param_2) OR "user"."age" > :param_3))';
    const expectedParameters = {
      param_0: 'first name',
      param_1: 'other',
      param_2: 18,
      param_3: 40,
    };

    parser.parse({
      filter: {
        _or: [
          {
            _and: [
              {
                _or: [
                  {
                    'name.first': {
                      _eq: 'first name',
                    },
                  },
                  {
                    'name.first': {
                      _neq: 'other',
                    },
                  },
                ],
              },
              {
                age: {
                  _gte: 18,
                },
              },
            ],
          },
          {
            age: {
              _gt: 40,
            },
          },
        ],
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using fields from relations', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId" WHERE (("user"."age" >= :param_0 OR "profile"."gender" = :param_1))';
    const expectedParameters = {
      param_0: 18,
      param_1: 'gender',
    };

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parse({
      filter: {
        _or: [
          {
            age: {
              _gte: 18,
            },
          },
          {
            profile: {
              gender: {
                _eq: 'gender',
              },
            },
          },
        ],
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using fields from deep relations', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId" WHERE (("profile"."gender" = :param_0 OR "photo"."src" IS NOT NULL))';
    const expectedParameters = expect.objectContaining({
      param_0: 'gender',
    });

    selectQueryBuilder.leftJoin('user.profile', 'profile').leftJoin('profile.photo', 'photo');
    parser.parse({
      filter: {
        _or: [
          {
            profile: {
              gender: {
                _eq: 'gender',
              },
            },
          },
          {
            photo: {
              src: {
                _null: false,
              },
            },
          },
        ],
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using embedded fields', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" WHERE ("user"."nameFirst" = :param_0 AND "user"."nameLast" = :param_1)';
    const expectedParameters = {
      param_0: 'first',
      param_1: 'last',
    };

    parser.parse({
      filter: {
        name: {
          first: {
            _eq: 'first',
          },
          last: {
            _eq: 'last',
          },
        },
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should filter using embedded fields with alias separator', () => {
    const expectedQuery =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" WHERE ("user"."nameFirst" = :param_0 AND "user"."nameLast" = :param_1)';
    const expectedParameters = {
      param_0: 'first',
      param_1: 'last',
    };

    parser.parse({
      filter: {
        'name.first': {
          _eq: 'first',
        },
        'name.last': {
          _eq: 'last',
        },
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expectedQuery);
    expect(selectQueryBuilder.getParameters()).toEqual(expectedParameters);
  });

  it('should not execute parser if filter option is not defined', () => {
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user"';

    parser.parse();

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });
});
