import {
  hasActiveDirectDebitMandates,
  isKycActive,
  useGetBrokerageProfileForInvestor,
  useGetDirectDebitMandates,
  useGetInvestorProfile,
} from '@bambu/go-core';
import { InvestorBrokerageAccountStatusEnum } from '@bambu/api-client';

export function useDashboardData() {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    isSuccess: isProfileSuccess,
  } = useGetInvestorProfile({
    refetchOnMount: true, // do not turn this off
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
  const {
    data: mandatesData,
    isLoading: isLoadingMandate,
    isFetching: isFetchingMandates,
  } = useGetDirectDebitMandates({
    refetchOnMount: true, // do not turn this off
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
  const {
    data: platformData,
    isLoading: isLoadingPlatform,
    isFetching: isFetchingPlatform,
  } = useGetBrokerageProfileForInvestor({
    refetchOnMount: true, // do not turn this off
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    refetchInterval: (data) => {
      return data?.accounts?.[0]?.status ===
        InvestorBrokerageAccountStatusEnum.PENDING
        ? 8000
        : false;
    },
  });
  return {
    profileData,
    isLoadingProfile,
    isProfileSuccess,
    mandatesData,
    isLoadingMandate,
    platformData,
    isLoadingPlatform,
    isLoading: isLoadingProfile || isLoadingMandate || isLoadingPlatform,
    isFetching: isFetchingMandates || isFetchingPlatform || isFetchingProfile,
    isReadyToInvest:
      hasActiveDirectDebitMandates(mandatesData) && isKycActive(platformData),
  };
}
