import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationPerformanceDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryResponseDto>;
}
