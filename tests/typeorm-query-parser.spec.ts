import { DataSource, SelectQueryBuilder } from 'typeorm';

import { QueryParams } from '../src';
import { TypeORMQueryParser, TypeORMQueryParserOptions } from '../src/typeorm-query-parser';
import { TestingDataSourceUtils } from './data-source-utils';
import { User } from './entities/user';

describe('TypeORMQueryParser', () => {
  let dataSource: DataSource;
  let selectQueryBuilder: SelectQueryBuilder<User>;

  function getTypeORMQueryParser(options?: TypeORMQueryParserOptions) {
    return new TypeORMQueryParser(selectQueryBuilder, options);
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
    selectQueryBuilder = dataSource.createQueryBuilder(User, 'user');
  });

  it('should load correctly parsers', () => {
    const parser = getTypeORMQueryParser();
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "user"."nameFirst" AS "user_nameFirst", "profile"."gender" AS "profile_gender", "photo"."src" AS "photo_src" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId" WHERE ("user"."age" >= :param_0 AND UPPER("profile"."gender") LIKE UPPER(:param_1)) ORDER BY "user_age" DESC, "user_nameFirst" ASC';

    parser.parse({
      select: ['id', 'age', 'name.first', 'profile.gender', 'photo.src'],
      relations: ['profile', 'profile.photo'],
      sort: ['-age', 'name.first'],
      filter: {
        age: {
          _gte: 18,
        },
        profile: {
          gender: {
            _contains: 'gender',
          },
        },
      },
      paginate: false,
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should load parsers with pagination', () => {
    const parser = getTypeORMQueryParser();
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age" FROM "user" "user" WHERE ("user"."age" >= :param_0) ORDER BY "user_age" DESC LIMIT 20 OFFSET 40';

    parser.parse({
      select: ['id', 'age'],
      sort: ['-age'],
      filter: {
        age: {
          _gte: 18,
        },
      },
      page: 3,
      limit: 20,
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should use custom default options if provided', () => {
    const parser = getTypeORMQueryParser({
      pagination: { defaultLimit: 5, defaultPage: 4 },
    });
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age" FROM "user" "user" WHERE ("user"."age" >= :param_0) ORDER BY "user_age" DESC LIMIT 5 OFFSET 15';

    parser.parse({
      select: ['id', 'age'],
      sort: ['-age'],
      filter: {
        age: {
          _gte: 18,
        },
      },
    });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should load correctly parsers when string options', () => {
    const parser = getTypeORMQueryParser();
    const expected = 'SELECT "user"."age" AS "user_age" FROM "user" "user" ORDER BY "user_age" DESC LIMIT 10 OFFSET 10';
    const query: QueryParams = {
      select: ['age'],
      sort: ['-age'],
      page: '2',
      limit: '10',
    };

    parser.parse(query);

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });
});
