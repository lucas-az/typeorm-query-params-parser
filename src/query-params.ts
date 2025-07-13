export interface QueryParams {
  paginate?: boolean;
  page?: number;
  limit?: number;
  select?: string[];
  sort?: string[];
  relations?: string[];
  filter?: Record<string, unknown>;
}
