import {
  IBrokerageIntegrationListAllBaseResponseDto,
  IBrokerageIntegrationListAllQueryParamsBaseDto,
  IBrokerageIntegrationMoneyDto,
} from '@bambu/shared';

export interface ICashValuationDto {
  currency: string;
  value: IBrokerageIntegrationMoneyDto;
  amount: IBrokerageIntegrationMoneyDto;
  fxRate: number;
}

export interface IHoldingValuationDto {
  isin: string;
  quantity: number;
  price: IBrokerageIntegrationMoneyDto;
  value: IBrokerageIntegrationMoneyDto;
  fxRate: number;
}

export interface IBrokerageIntegrationValuationDto {
  portfolioId: string;
  date: string;
  value: IBrokerageIntegrationMoneyDto;
  cash: ICashValuationDto[];
  holdings: IHoldingValuationDto[];
  changedAt: string;
}

export interface IBrokerageIntegrationValuationListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  endDate?: string;
  portfolioId?: string;
  startDate?: string;
  updatedSince?: string;
}

export type IBrokerageIntegrationValuationListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationValuationDto[]
  >;
