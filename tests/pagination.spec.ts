import { SelectQueryBuilder } from 'typeorm';

import { PaginationParser, PaginationParserOptions } from '../src/parsers/pagination';

describe('PaginationParser', () => {
  const mockSelectQueryBuilder = {
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<SelectQueryBuilder<unknown>>;

  const getPaginationParser = (options?: PaginationParserOptions) =>
    new PaginationParser(mockSelectQueryBuilder, options);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not call skip/take if paginate is false', () => {
    const parser = getPaginationParser();

    parser.parser({ paginate: false });
    expect(parser.selectQueryBuilder.skip).not.toHaveBeenCalled();
    expect(parser.selectQueryBuilder.take).not.toHaveBeenCalled();
  });

  it('should call skip/take if paginate is not defined', () => {
    const parser = getPaginationParser();

    parser.parser({});
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalled();
    expect(parser.selectQueryBuilder.take).toHaveBeenCalled();
  });

  it('should use default limit and page if not specified', () => {
    const parser = getPaginationParser();

    parser.parser({ paginate: true });
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(parser.selectQueryBuilder.take).toHaveBeenCalledWith(25);
  });

  it('should use provided limit and page from query', () => {
    const parser = getPaginationParser();

    parser.parser({ paginate: true, limit: 10, page: 3 });
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalledWith(20);
    expect(parser.selectQueryBuilder.take).toHaveBeenCalledWith(10);
  });

  it('should use default limit if only page is provided', () => {
    const parser = getPaginationParser();

    parser.parser({ paginate: true, page: 2 });
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalledWith(25);
    expect(parser.selectQueryBuilder.take).toHaveBeenCalledWith(25);
  });

  it('should use default page if only limit is provided', () => {
    const parser = getPaginationParser();

    parser.parser({ paginate: true, limit: 15 });
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(parser.selectQueryBuilder.take).toHaveBeenCalledWith(15);
  });

  it('should use custom default options if provided', () => {
    const parser = getPaginationParser({ defaultLimit: 5, defaultPage: 4 });

    parser.parser({ paginate: true });
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalledWith(15);
    expect(parser.selectQueryBuilder.take).toHaveBeenCalledWith(5);
  });

  it('should call skip/take if query is undefined', () => {
    const parser = getPaginationParser();

    parser.parser(undefined);
    expect(parser.selectQueryBuilder.skip).toHaveBeenCalled();
    expect(parser.selectQueryBuilder.take).toHaveBeenCalled();
  });
});
