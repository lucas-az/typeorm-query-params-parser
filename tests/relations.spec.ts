import { DataSource, SelectQueryBuilder } from 'typeorm';

import { RelationsParser } from '../src/parsers/relations';
import { TestingDataSourceUtils } from './data-source-utils';
import { User } from './entities/user';

describe('RelationsParser', () => {
  let dataSource: DataSource;
  let selectQueryBuilder: SelectQueryBuilder<User>;
  let parser: RelationsParser<User>;

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
    parser = new RelationsParser<User>(selectQueryBuilder);
  });

  it('should left join provided relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"';

    parser.parser({ relations: ['profile'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should left join provided relations with aliases', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"';

    parser.parser({ relations: ['user.profile'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should left join cascaded relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId"';

    parser.parser({ relations: ['profile', 'profile.photo'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should left join cascaded relations with aliases', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId"';

    parser.parser({ relations: ['user.profile', 'user.profile.photo'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should left join multiple relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId"';

    parser.parser({ relations: ['profile', 'profile.photo'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should not execute parser if no relations are provided', () => {
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user"';

    parser.parser();

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });
});
