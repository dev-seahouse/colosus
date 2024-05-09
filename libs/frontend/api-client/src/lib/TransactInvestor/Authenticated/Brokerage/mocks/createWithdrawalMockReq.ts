import { InvestorBrokerageIntegrationWithdrawalTypeEnum } from '../Brokerage.types';

export const createWithdrawalMockReq = {
  bankAccountId: 'string',
  consideration: {
    currency: 'GBP',
    amount: 1.14,
  },
  reference: '9394967',
  type: InvestorBrokerageIntegrationWithdrawalTypeEnum.SpecifiedAmount,
  closePortfolio: false,
  goalId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};
export default createWithdrawalMockReq;
