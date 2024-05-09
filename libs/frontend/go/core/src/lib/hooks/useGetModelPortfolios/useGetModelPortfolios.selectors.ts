import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getModelPortfoliosQuery } from './useGetModelPortfolios';
import type { GetModelPortfoliosData } from './useGetModelPortfolios';

/**
 * hook to return the model portfolios data
 */
export const useSelectModelPortfoliosQuery = () => {
  return useQuery({
    ...getModelPortfoliosQuery(),
    select: (data: GetModelPortfoliosData) => {
      if (!data || data.length === 0) {
        return [];
      }

      return data;
    },
  });
};

/**
 * hook to return the model portfolio data by key
 */
export const useSelectModelPortfolioByRiskProfileId = ({
  riskProfileId,
  initialData,
}: {
  riskProfileId: string;
  initialData?: GetModelPortfoliosData;
}) => {
  return useQuery({
    ...getModelPortfoliosQuery(),
    ...(initialData && { initialData }),
    select: useCallback(
      (data: GetModelPortfoliosData) => {
        if (!data || data.length === 0) {
          return null;
        }

        return data.find(
          (modelPortfolio) => modelPortfolio.riskProfileId === riskProfileId
        );
      },
      [riskProfileId]
    ),
  });
};

export function useSelectModelPortfolioById({
  id,
  enabled = true,
}: {
  id: string | undefined | null;
  enabled?: boolean;
}) {
  return useQuery({
    ...getModelPortfoliosQuery(),
    select: (data: GetModelPortfoliosData) => data.find((d) => d.id === id),
    enabled,
  });
}
