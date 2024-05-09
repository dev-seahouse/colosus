import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { BambuApiLibraryIntegrationCountryMetadataApi } from '@bambu/api-client';
import type {
  GetCountryRatesResponseDto,
  GetCountryRatesRequestDto,
} from '@bambu/api-client';

export type GetCountryRateData = GetCountryRatesResponseDto;

export const getCountryRateQuery = (
  countryCode: GetCountryRatesRequestDto['countryAlpha2Code']
) => ({
  queryKey: ['getCountryRate', countryCode],
  queryFn: async () => {
    const bambuApiLibraryIntegrationCountryMetadataApi =
      new BambuApiLibraryIntegrationCountryMetadataApi();
    const res =
      await bambuApiLibraryIntegrationCountryMetadataApi.getCountryRates({
        countryAlpha2Code: countryCode,
      });

    return res.data;
  },
});

export const getCountryRateLoader =
  (queryClient: QueryClient) => async (): Promise<GetCountryRateData> => {
    const query = getCountryRateQuery('US');

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetCountryRateOptions {
  initialData?: Partial<GetCountryRateData>;
}

/**
 * hook to get country rate data
 */
export const useGetCountryRate = ({
  initialData,
}: UseGetCountryRateOptions = {}) => {
  return useQuery({
    ...getCountryRateQuery('US'),
    initialData,
  });
};

export default useGetCountryRate;
