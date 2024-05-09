import type { InvestorBrokerageCreateDirectDebitMandateResponseDto } from '../Brokerage.types';
import { InvestorBrokerUkDirectDebitMandateStatusEnum } from '../Brokerage.enum';

export const createDirectDebitMandateMockRes = {
  bankAccountId: 'string',
  partyId: 'string',
  id: 'string',
  reason: 'string',
  reference: 'string',
  status: InvestorBrokerUkDirectDebitMandateStatusEnum.PENDING,
} satisfies InvestorBrokerageCreateDirectDebitMandateResponseDto;

export default createDirectDebitMandateMockRes;
