import useSelectGetDirectDebitMandates from './useGetDirectDebitMandates';
import type { QueryArgs } from '../../types/utils';
import type {
  InvestorBrokerageDirectDebitMandateItem,
  InvestorBrokerageGetDirectDebitMandatesResponseDto,
} from '@bambu/api-client';
import { getActiveMandate } from '../../utils/getActiveMandate/getActiveMandate';

export function useSelectActiveDirectDebitMandate(
  queryOptions?: QueryArgs<
    InvestorBrokerageGetDirectDebitMandatesResponseDto,
    InvestorBrokerageDirectDebitMandateItem | undefined
  >
) {
  return useSelectGetDirectDebitMandates({
    ...queryOptions,
    select: (data) => getActiveMandate(data),
  });
}

export default useSelectActiveDirectDebitMandate;
