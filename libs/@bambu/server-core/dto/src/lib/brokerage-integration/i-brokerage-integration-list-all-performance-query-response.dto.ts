import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationPerformanceDto } from './i-brokerage-integration-performance.dto';

export type IBrokerageIntegrationListAllPerformanceQueryResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationPerformanceDto[]
  >;
