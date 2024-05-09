import { InvestorBrokerageUkDirectDebitCreatePaymentReqDto } from '../Brokerage.types';

export const createDirectDebitPaymentMockReq = {
  amount: {
    amount: 1000,
    currency: 'GBP',
  },
  mandateId: 'ddm-123456789',
  goalId: 'f254692e-900a-412f-a000-155e4117c346',
} satisfies InvestorBrokerageUkDirectDebitCreatePaymentReqDto;

export default createDirectDebitPaymentMockReq;
