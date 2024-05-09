import {
  InvestorBrokerageAccountStatusEnum,
  InvestorBrokerageApiResponseDto,
} from '@bambu/api-client';

export function isKycPending(
  platformData: InvestorBrokerageApiResponseDto | undefined
) {
  return (
    platformData?.accounts[0].status ===
    InvestorBrokerageAccountStatusEnum.PENDING
  );
}
