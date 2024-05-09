import { useQuery } from '@tanstack/react-query';

import { useCallback } from 'react';

import { getPricesQuery } from './useGetPrices';
import type { GetPricesData } from './useGetPrices';

/**
 * hoook to return available prices
 */
export const useSelectPricesQuery = () => {
  return useQuery({
    ...getPricesQuery(),
    select: useCallback((data: GetPricesData) => {
      if (!data || !data.data) {
        return [];
      }

      return data.data ?? [];
    }, []),
  });
};
