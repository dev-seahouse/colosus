import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getConnectPortfoliosQuery } from './useGetConnectPortfolios';
import type { GetConnectPortfoliosData } from './useGetConnectPortfolios';

/**
 * hoook to return available portfolios
 */
export const useSelectConnectPortfolios = () => {
  return useQuery({
    ...getConnectPortfoliosQuery(),
    select: useCallback((data: GetConnectPortfoliosData) => {
      if (!data || !data.portfolioSummaries) {
        return [];
      }

      return data.portfolioSummaries ?? [];
    }, []),
  });
};
