import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getConnectPortfolioByKeyQuery } from './useGetConnectPortfolioByKey';

/**
 * hoook to return currently selected portfolio
 */
export const useSelectConnectPortfolioByKey = (key: string) => {
  return useQuery({
    ...getConnectPortfolioByKeyQuery(key),
    select: (data) => data,
  });
};

/**
 * hoook to return currently selected portfolio id
 */
export const useSelectConnectPortfolioIdByKey = (key: string) => {
  return useQuery({
    ...getConnectPortfolioByKeyQuery(key),
    select: (data) => data?.id,
  });
};

/**
 * hook to invalidate current portfolio by key
 */
export const useSelectInvalidateConnectPortfolioByKey = (key: string) => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries(getConnectPortfolioByKeyQuery(key).queryKey);
  };
};
