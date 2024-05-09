import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageIntegrationModelPortfolioComponentDto {
  isin: string;
  weight: number;
}

export interface IBrokerageIntegrationModelPortfolioDto {
  id: string;
  name: string;
  description: string;
  components: IBrokerageIntegrationModelPortfolioComponentDto[];
}

export interface IBrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  clientReference?: string;
  modelId?: string;
}

export type IBrokerageIntegrationModelPortfolioDtoListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationModelPortfolioDto[]
  >;
