// noinspection ES6PreferShortImport

import {
  BrokerageIntegrationWithdrawalStatusEnum,
  BrokerageIntegrationWithdrawalTypeEnum,
} from '../../../../enums';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  reference?: string;
  status?: BrokerageIntegrationWithdrawalStatusEnum;
  type?: BrokerageIntegrationWithdrawalTypeEnum;
}

export interface IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  extends IBrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto {
  portfolioId?: string;
}

export interface IColossusListAllWithdrawalsQueryParamsDto
  extends IBrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto {
  goalId: string;
}
