import { InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum } from '../Brokerage.types';

export const createDirectDebitSubscriptionMockReq = {
  mandateId: '34343',
  goalId: '34343',
  amount: {
    currency: 'GBP',
    amount: 100,
  },
  interval: InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum.MONTHYL,
  dayOfMonth: 1,
  month: 'JANUARY',
  startDate: '2021-01-01',
};

export default createDirectDebitSubscriptionMockReq;
