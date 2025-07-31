import { SelectQueryBuilder } from 'typeorm';

import { CacheParser } from '../src/parsers/cache';
import { User } from './entities/user';

describe('CacheParser', () => {
  let parser: CacheParser<User>;
  let mockSelectQueryBuilder: jest.Mocked<SelectQueryBuilder<User>>;

  beforeEach(() => {
    mockSelectQueryBuilder = {
      cache: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<User>>;
    parser = new CacheParser(mockSelectQueryBuilder);
  });

  it('should not call cache if query.cache is not defined', () => {
    parser.parse({});
    expect(mockSelectQueryBuilder.cache).not.toHaveBeenCalled();
  });

  it('should enable cache if query.cache is true', () => {
    parser.parse({ cache: true });
    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith(true);
  });

  it('should enable cache if query.cache is string true', () => {
    parser.parse({ cache: 'true' });
    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith(true);
  });

  it('should disable cache if query.cache is false', () => {
    parser.parse({ cache: false });
    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith(false);
  });

  it('should disable cache if query.cache is string false', () => {
    parser.parse({ cache: 'false' });
    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith(false);
  });

  it('should enables cache and sets expire milliseconds if query.cache is number', () => {
    parser.parse({ cache: 5000 });
    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith(5000);
  });

  it('should enables cache and sets expire milliseconds if query.cache is string number', () => {
    parser.parse({ cache: '5000' });
    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith(5000);
  });

  it('should enacle cache and sets cache id and expire milliseconds if query.cache is an array', () => {
    parser.parse({ cache: ['my-cache-id', 1000] });

    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith('my-cache-id', 1000);
  });

  it('should enacle cache and sets cache id and expire milliseconds if query.cache is an array of string', () => {
    parser.parse({ cache: ['my-cache-id', '1000'] });

    expect(mockSelectQueryBuilder.cache).toHaveBeenCalledWith('my-cache-id', 1000);
  });
});
