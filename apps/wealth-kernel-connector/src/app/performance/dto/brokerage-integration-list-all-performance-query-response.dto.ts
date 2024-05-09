import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

import { BrokerageIntegrationPerformanceDto } from './brokerage-integration-performance.dto';

export class BrokerageIntegrationListAllPerformanceQueryResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryResponseDto
{
  paginationToken: string | null;
  results: BrokerageIntegrationPerformanceDto[];
}
