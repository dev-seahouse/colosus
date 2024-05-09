import {
  InvestorBrokerageAccountStatusEnum,
  InvestorBrokerageApiResponseDto,
} from '@bambu/api-client';

export function isKycActive(
  platformData: InvestorBrokerageApiResponseDto | undefined
) {
  return (
    platformData?.accounts[0].status ===
    InvestorBrokerageAccountStatusEnum.ACTIVE
  );
}
