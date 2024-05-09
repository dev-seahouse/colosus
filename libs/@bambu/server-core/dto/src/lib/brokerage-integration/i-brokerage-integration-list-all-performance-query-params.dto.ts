import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageIntegrationListAllPerformanceQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  aggregate?: boolean;
  endDate?: string;
  portfolioId?: string;
  startDate?: string;
  updatedSince?: string;
}
