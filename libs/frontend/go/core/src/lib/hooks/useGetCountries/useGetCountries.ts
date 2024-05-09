import { BambuApiLibraryIntegrationCountryMetadataApi } from '@bambu/api-client';
import type { GetCountriesResponseDto } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

const getCountriesQuery = {
  queryKey: ['getCountries'],
  queryFn: fetchCountries,
};
async function fetchCountries() {
  const bambuApiLibraryIntegrationCountryMetadataApi =
    new BambuApiLibraryIntegrationCountryMetadataApi();
  const res = await bambuApiLibraryIntegrationCountryMetadataApi.getCountries();
  return res.data;
}

export function useGetCountries<T = GetCountriesResponseDto>(
  options?: QueryArgs<GetCountriesResponseDto, T>
) {
  return useQuery({
    ...getCountriesQuery,
    ...options,
  });
}

export const getCountriesLoader = (queryClient: QueryClient) => async () => {
  const query = getCountriesQuery;
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

// currently countries options have duplicates
export const selectCountryOptions = (countries: GetCountriesResponseDto) =>
  countries.reduce((options: { label: string; value: string }[], country) => {
    const existingOption = options.find(
      (option) => option.label === country.name
    );
    if (!existingOption) {
      options.push({ label: country.name, value: country.cca2 });
    }
    return options;
  }, []);

// currently countries api have duplicates issue, need to find out solution
export const selectNationalityOptions = (
  countries: GetCountriesResponseDto
): { label: string; value: string }[] => {
  const uniqueLabels: { [label: string]: boolean } = {};

  // remove duplicated labels
  return countries
    .map((c: { demonym: string; cca2: string }) => ({
      label: c.demonym,
      value: c.cca2,
    }))
    .filter((option) => {
      if (!uniqueLabels[option.label]) {
        uniqueLabels[option.label] = true;
        return true;
      }
      return false;
    });
};

export default useGetCountries;
