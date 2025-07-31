import { SelectQueryBuilder } from 'typeorm';

import { WithDeletedParser } from '../src/parsers/with-deleted';
import { User } from './entities/user';

describe('WithDeletedParser', () => {
  let parser: WithDeletedParser<User>;
  let mockSelectQueryBuilder: jest.Mocked<SelectQueryBuilder<User>>;

  beforeEach(() => {
    mockSelectQueryBuilder = {
      withDeleted: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<User>>;
    parser = new WithDeletedParser(mockSelectQueryBuilder);
  });

  it('should call withDeleted when query.withDeleted is true', () => {
    parser.parse({ withDeleted: true });
    expect(mockSelectQueryBuilder.withDeleted).toHaveBeenCalled();
  });

  it('should call withDeleted when query.withDeleted is string true', () => {
    parser.parse({ withDeleted: 'true' });
    expect(mockSelectQueryBuilder.withDeleted).toHaveBeenCalled();
  });

  it('should not call withDeleted when query.withDeleted is false', () => {
    parser.parse({ withDeleted: false });
    expect(mockSelectQueryBuilder.withDeleted).not.toHaveBeenCalled();
  });

  it('should not call withDeleted when query.withDeleted is string false', () => {
    parser.parse({ withDeleted: 'false' });
    expect(mockSelectQueryBuilder.withDeleted).not.toHaveBeenCalled();
  });

  it('should not call withDeleted when query.withDeleted is not defined', () => {
    parser.parse({});
    expect(mockSelectQueryBuilder.withDeleted).not.toHaveBeenCalled();
  });
});
