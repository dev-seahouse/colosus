import { InvestorBrokerUkDirectDebitMandateStatusEnum } from '../Brokerage.enum';
import type { InvestorBrokerageGetDirectDebitMandatesResponseDto } from '../Brokerage.types';

export const getDirectDebitMandateMockRes = [
  {
    bankAccountId: 'string',
    partyId: 'string',
    id: 'string',
    reason: 'string',
    reference: 'string',
    status: InvestorBrokerUkDirectDebitMandateStatusEnum.ACTIVE,
  },
] satisfies InvestorBrokerageGetDirectDebitMandatesResponseDto;

export default getDirectDebitMandateMockRes;
