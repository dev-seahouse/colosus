import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export enum PortfolioStatusEnum {
  CREATED = 'Created',
  ACTIVE = 'Active',
  CLOSING = 'Closing',
  CLOSED = 'Closed',
}

// export interface IDiscretionaryMandate {
//   type: 'DiscretionaryMandate';
//   modelId: string;
// }
//
// export interface IExecutionOnlyMandate {
//   type: 'ExecutionOnlyMandate';
// }
//
// export interface IExecutionOnlyModelMandate {
//   type: 'ExecutionOnlyModelMandate';
//   modelId: string;
// }
//
// export interface INullMandate {
//   type: 'NullMandate';
// }
//
// export interface ISingleProductMandate {
//   type: 'SingleProductMandate';
//   isin: string;
// }
//
// export type Mandate =
//   | IDiscretionaryMandate
//   | IExecutionOnlyMandate
//   | IExecutionOnlyModelMandate
//   | INullMandate
//   | ISingleProductMandate;

export enum MandateTypeEnum {
  DISCRETIONARY_MANDATE = 'DiscretionaryMandate',
  EXECUTION_ONLY_MANDATE = 'ExecutionOnlyMandate',
  EXECUTION_ONLY_MODEL_MANDATE = 'ExecutionOnlyModelMandate',
  NULL_MANDATE = 'NullMandate',
  SINGLE_PRODUCT_MANDATE = 'SingleProductMandate',
}

export interface IMandateDto {
  type: string;
  isin?: string;
  modelId?: string;
}

export interface IBrokerageIntegrationPortfolioMutableDto {
  clientReference: string;
  name: string;
  accountId: string;
  currency: string;
  mandate: IMandateDto;
}

export interface IBrokerageIntegrationPortfolioDto
  extends IBrokerageIntegrationPortfolioMutableDto {
  id: string;
  createdAt: string;
  status: PortfolioStatusEnum;
}

export interface IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  accountId?: string;
  clientReference?: string;
  currency?: string;
  status?: string;
}

export type IBrokerageIntegrationListAllPortfoliosResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationPortfolioDto[]
  >;
