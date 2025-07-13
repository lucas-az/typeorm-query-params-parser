import { DataSource, EntityPropertyNotFoundError, SelectQueryBuilder } from 'typeorm';

import { SortParser } from '../src/parsers/sort';
import { TestingDataSourceUtils } from './data-source-utils';
import { User } from './entities/user';

describe('SortParser', () => {
  let dataSource: DataSource;
  let selectQueryBuilder: SelectQueryBuilder<User>;
  let parser: SortParser<User>;

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
    parser = new SortParser<User>(selectQueryBuilder);
  });

  it('should sort ascending for a single field', () => {
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" ORDER BY "user"."age" ASC';

    parser.parse({ sort: ['age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort descending for a single field with "-" prefix', () => {
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" ORDER BY "user"."age" DESC';

    parser.parse({ sort: ['-age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort ascending for a single field with alias', () => {
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" ORDER BY "user"."age" ASC';

    parser.parse({ sort: ['user.age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort descending for a single field with alias and "-" prefix', () => {
    const expected = 'SELECT "user"."id" AS "user_id" FROM "user" "user" ORDER BY "user"."age" DESC';

    parser.parse({ sort: ['-user.age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort by fields from relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId" ORDER BY "profile"."id" ASC';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parse({ sort: ['profile.id'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort by fields from relations with alias', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId" ORDER BY "profile"."id" ASC';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parse({ sort: ['user.profile.id'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort by field from deep relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId" ORDER BY "photo"."src" ASC';

    selectQueryBuilder.leftJoin('user.profile', 'profile').leftJoin('profile.photo', 'photo');
    parser.parse({ sort: ['photo.src'] });
    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort by field from deep relations with alias', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId" ORDER BY "photo"."src" ASC';

    selectQueryBuilder.leftJoin('user.profile', 'profile').leftJoin('profile.photo', 'photo');
    parser.parse({ sort: ['profile.photo.src'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort with multiple fields and correct priorities', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId" ORDER BY "user"."age" DESC, "user"."nameFirst" ASC, "profile"."id" ASC';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parse({ sort: ['-age', 'name.first', 'profile.id'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort with multiple fields and correct priorities with aliases', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId" ORDER BY "user"."age" DESC, "user"."nameFirst" ASC, "profile"."id" ASC';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parse({ sort: ['-user.age', 'user.name.first', 'user.profile.id'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should sort by embedded fields', () => {
    const expected =
      'SELECT "user"."id" AS "user_id" FROM "user" "user" ORDER BY "user"."nameFirst" DESC, "user"."nameLast" ASC';

    parser.parse({ sort: ['-name.first', 'name.last'] });
    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should throw EntityPropertyNotFoundError when field do not exist', () => {
    expect(() => parser.parse({ sort: ['-age', 'nonexistent'] })).toThrow(EntityPropertyNotFoundError);
  });
});
