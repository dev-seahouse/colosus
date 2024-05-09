export interface IBrokerageIntegrationListAllBaseResponseDto<T> {
  paginationToken: string | null;
  results: T;
}
