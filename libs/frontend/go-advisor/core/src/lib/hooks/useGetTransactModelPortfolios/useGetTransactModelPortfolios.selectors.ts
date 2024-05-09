import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { GetModelPortfolioResponseDto } from '@bambu/api-client';

import { getTransactModelPortfoliosQuery } from './useGetTransactModelPortfolios';

/**
 * hoook to return boolean if transact model portfolios have been configured
 */
export const useSelectTransactModelPortfolioIsConfigured = () => {
  return useQuery({
    ...getTransactModelPortfoliosQuery(),
    select: useCallback((data: GetModelPortfolioResponseDto[]) => {
      if (!data) return false;
      return data.length === 5;
    }, []),
  });
};

/**
 * hook to return configured portfolios by portfolio id
 */
export const useSelectTransactConfiguredModelPortfolios = () => {
  return useQuery({
    ...getTransactModelPortfoliosQuery(),
    select: useCallback((data: GetModelPortfolioResponseDto[]) => {
      if (!data) return false;
      return data.map((portfolio) => portfolio.id);
    }, []),
  });
};
