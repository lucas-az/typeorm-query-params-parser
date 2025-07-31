export interface QueryParams {
  paginate?: boolean | string;
  page?: number | string;
  limit?: number | string;
  select?: string[];
  sort?: string[];
  relations?: string[];
  filter?: Record<string, unknown>;
  cache?: boolean | number | string | [string, number | string];
  withDeleted?: boolean | string;
}
