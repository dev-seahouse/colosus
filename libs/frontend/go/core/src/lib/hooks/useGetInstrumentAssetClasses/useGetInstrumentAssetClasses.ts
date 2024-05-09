import type { InvestorGetInstrumentAssetClassesResponseDto } from '@bambu/api-client';
import { TransactInvestorInstrumentsApi } from '@bambu/api-client';
import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

const getInstrumentAssetClassesQuery = {
  queryKey: ['getInstrumentAssetClasses'],
  queryFn: fetchInstrumentAssetClasses,
};
export function useGetInstrumentAssetClasses<
  T = InvestorGetInstrumentAssetClassesResponseDto
>(
  args?: UseQueryOptions<
    InvestorGetInstrumentAssetClassesResponseDto,
    AxiosError,
    T,
    typeof getInstrumentAssetClassesQuery.queryKey
  >
) {
  return useQuery({
    ...getInstrumentAssetClassesQuery,
    ...args,
  });
}

export const instrumentAssetClassLoader =
  (queryClient: QueryClient) => async () => {
    return (
      queryClient.getQueryData(getInstrumentAssetClassesQuery.queryKey) ??
      (await queryClient.fetchQuery(getInstrumentAssetClassesQuery))
    );
  };

async function fetchInstrumentAssetClasses() {
  const investorInstrumentsApi = new TransactInvestorInstrumentsApi();
  const res = await investorInstrumentsApi.getInstrumentAssetClasses();
  return res.data;
}

export default useGetInstrumentAssetClasses;
