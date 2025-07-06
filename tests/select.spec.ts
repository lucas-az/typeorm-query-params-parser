import { DataSource, SelectQueryBuilder } from 'typeorm';

import { SelectParser } from '../src/parsers/select';
import { TestingDataSourceUtils } from './data-source-utils';
import { User } from './entities/user';

describe('SelectParser', () => {
  let dataSource: DataSource;
  let selectQueryBuilder: SelectQueryBuilder<User>;
  let parser: SelectParser<User>;

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
    parser = new SelectParser<User>(selectQueryBuilder);
  });

  it('should select only specified fields', () => {
    const expected = 'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age" FROM "user" "user"';

    parser.parser({ select: ['id', 'age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select fields only specified fields with aliases', () => {
    const expected = 'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age" FROM "user" "user"';

    parser.parser({ select: ['user.id', 'user.age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select one field from duplicated fields', () => {
    const expected = 'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age" FROM "user" "user"';

    parser.parser({ select: ['id', 'age', 'age'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select all fields', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "user"."profileId" AS "user_profileId", "user"."nameFirst" AS "user_nameFirst", "user"."nameLast" AS "user_nameLast" FROM "user" "user"';

    parser.parser({ select: ['*'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select fields from relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "profile"."id" AS "profile_id", "profile"."gender" AS "profile_gender" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parser({ select: ['id', 'age', 'profile.id', 'profile.gender'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select fields from relations with aliases', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "profile"."id" AS "profile_id", "profile"."gender" AS "profile_gender" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parser({ select: ['user.id', 'user.age', 'user.profile.id', 'user.profile.gender'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select all fields from relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "profile"."id" AS "profile_id", "profile"."gender" AS "profile_gender", "profile"."photoId" AS "profile_photoId" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"';

    selectQueryBuilder.leftJoin('user.profile', 'profile');
    parser.parser({ select: ['id', 'age', 'profile.*'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select fields in deep relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "profile"."id" AS "profile_id", "photo"."src" AS "photo_src" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId"';

    selectQueryBuilder.leftJoin('user.profile', 'profile').leftJoin('profile.photo', 'photo');
    parser.parser({ select: ['id', 'age', 'profile.id', 'photo.src'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select all fields in deep relations with aliases', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "profile"."id" AS "profile_id", "photo"."src" AS "photo_src" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId"';

    selectQueryBuilder.leftJoin('user.profile', 'profile').leftJoin('profile.photo', 'photo');
    parser.parser({ select: ['id', 'age', 'profile.id', 'profile.photo.src'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select all fields in deep relations', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "profile"."id" AS "profile_id", "photo"."id" AS "photo_id", "photo"."src" AS "photo_src", "photo"."alt" AS "photo_alt" FROM "user" "user" LEFT JOIN "profile" "profile" ON "profile"."id"="user"."profileId"  LEFT JOIN "image" "photo" ON "photo"."id"="profile"."photoId"';

    selectQueryBuilder.leftJoin('user.profile', 'profile').leftJoin('profile.photo', 'photo');
    parser.parser({ select: ['id', 'age', 'profile.id', 'photo.*'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select specified embedded fields', () => {
    const expected =
      'SELECT "user"."nameFirst" AS "user_nameFirst", "user"."nameLast" AS "user_nameLast" FROM "user" "user"';

    parser.parser({ select: ['name.first', 'name.last'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select all embedded fields with aliases', () => {
    const expected =
      'SELECT "user"."nameFirst" AS "user_nameFirst", "user"."nameLast" AS "user_nameLast" FROM "user" "user"';

    parser.parser({ select: ['user.name.first', 'user.name.last'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should select all embedded fields', () => {
    const expected =
      'SELECT "user"."nameFirst" AS "user_nameFirst", "user"."nameLast" AS "user_nameLast" FROM "user" "user"';

    parser.parser({ select: ['name.*'] });

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });

  it('should not execute parser if select option is not defined', () => {
    const expected =
      'SELECT "user"."id" AS "user_id", "user"."age" AS "user_age", "user"."profileId" AS "user_profileId", "user"."nameFirst" AS "user_nameFirst", "user"."nameLast" AS "user_nameLast" FROM "user" "user"';

    parser.parser();

    expect(selectQueryBuilder.getQuery()).toEqual(expected);
  });
});
