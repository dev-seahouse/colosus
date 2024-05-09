import { EnumSortOrder, LeadsEnums } from '../../../../enums';

export interface IConnectAdvisorLeadsApiRequestSortingItemDto {
  columnName: string;
  sortOrder: EnumSortOrder;
}

export interface IConnectAdvisorLeadsApiRequestDto {
  pageSize: number;
  pageIndex: number;
  nameFilter: string;
  qualifiedFilter: LeadsEnums.EnumLeadsQualifiedFilter;
  sortOrder?: IConnectAdvisorLeadsApiRequestSortingItemDto[];
}

export interface IConnectAdvisorLeadsRequestDto
  extends IConnectAdvisorLeadsApiRequestDto {
  tenantId: string;
  userId: string;
}

export interface IConnectAdvisorRetrieveDbLeadsParamsDto
  extends IConnectAdvisorLeadsRequestDto {
  minimumIncome: number;
  minimumSavings: number;
}

export * from './i-connect-leads.dto';
