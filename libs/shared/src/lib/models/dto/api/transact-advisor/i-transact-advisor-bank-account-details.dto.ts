export interface ITransactAdvisorBankAccountMutableDto {
  accountNumber: string;
  accountName: string;
  sortCode: string;
  annualManagementFee: string;
  tenantId: string;
}

export type ITransactAdvisorBankAccountMutableForApiDto = Omit<
  ITransactAdvisorBankAccountMutableDto,
  'tenantId'
>;

export interface ITransactAdvisorBankAccountEmailPayloadDto
  extends ITransactAdvisorBankAccountMutableDto {
  tenantEmail: string;
}

export interface ITransactAdvisorBankAccountDto
  extends ITransactAdvisorBankAccountMutableDto {
  id: string;
  createdAt: Date | string;
  createdBy: string;
  updatedAt: Date | string;
  updatedBy: string;
}
