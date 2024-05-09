import { useQuery } from '@tanstack/react-query';

import type { AdvisorGetInstrumentsResponseDto } from '@bambu/api-client';
import type { AdvisorGetInstrumentsRequestDto } from '@bambu/api-client';
import type { QueryArgs } from '@bambu/go-core';
import { TransactAdvisorInstrumentsApi } from '@bambu/api-client';
import { useState } from 'react';
import { useDebounce } from '@bambu/react-ui';

export const getTransactInstrumentsQuery = (
  args: AdvisorGetInstrumentsRequestDto
) => ({
  queryKey: ['getTransactInstruments', args],
  keepPreviousData: true,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  staleTime: Infinity,
  queryFn: () => fetchTransactInstruments(args),
});

export function useGetTransactInstruments<T>(
  args: AdvisorGetInstrumentsRequestDto,
  options?: QueryArgs<AdvisorGetInstrumentsResponseDto, T>
) {
  return useQuery({
    ...getTransactInstrumentsQuery(args),
    ...options,
  });
}

export function useSearchTransactInstruments<T>(
  options?: QueryArgs<AdvisorGetInstrumentsResponseDto, T>
) {
  const [searchString, setSearchString] = useState<string>();
  const [debouncedSearchString] = useDebounce(searchString, 312);
  const query = useQuery({
    enabled: Boolean(debouncedSearchString),
    queryKey: ['searchInstruments', debouncedSearchString],
    queryFn: () =>
      fetchTransactInstruments({
        searchString: debouncedSearchString ?? '',
        pageIndex: 0,
        pageSize: 100,
      }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 5000,
    ...options,
  });

  return [query, { searchString, setSearchString }] as const;
}

export async function fetchTransactInstruments(
  args: AdvisorGetInstrumentsRequestDto
) {
  const transactAdvisorInstrumentsApi = new TransactAdvisorInstrumentsApi();
  const res = await transactAdvisorInstrumentsApi.getInstruments(args);
  return res.data;
}

export default useGetTransactInstruments;
