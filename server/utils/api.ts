export const createResponse = {
  success: <T>(
    data: T,
    metadata?: { pagination?: PaginationObject },
  ): ResponseResult<T> => {
    return { data, ...metadata };
  },

  raw: <T>(response: RawResponseResult<T>): RawResponseResult<T> => response,
};

type ResponseResult<T> = {
  data: T | null;
  pagination?: PaginationObject;
};

type RawResponseResult<T> =
  | {
      data: T;
      [key: string]: unknown;
    }
  | T
  | null;

type PaginationObject = {
  page: number;
  perPage: number;
  total: number;
};
