export const authHeader = () => {
  //const apiServer = "https://localhost:7000/";
  const apiServer = "http://localhost:8080/";
  return apiServer;
};

/*
export interface Pagination {
    items: any;
    pageIndex: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

*/

export interface PaginationResponse<T> {
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
}