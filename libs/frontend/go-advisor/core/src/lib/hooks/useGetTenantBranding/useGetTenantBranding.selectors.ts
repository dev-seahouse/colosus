import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { DEFAULT_BRANDING } from '@bambu/go-core';

import type { GetTenantBrandingData } from './useGetTenantBranding';
import { getTenantBrandingQuery } from './useGetTenantBranding';

/**
 * returns current tenant branding
 */
export const useSelectTenantBrandingQuery = () => {
  return useQuery({
    ...getTenantBrandingQuery(),
    select: useCallback((data: GetTenantBrandingData) => {
      return (
        data ?? {
          brandColor: DEFAULT_BRANDING.brandColor,
          logoUrl: DEFAULT_BRANDING.logoUrl,
          headerBgColor: DEFAULT_BRANDING.headerBgColor,
          tradeName: DEFAULT_BRANDING.tradeName,
        }
      );
    }, []),
  });
};

/**
 * query hook to get current tenant trade name
 */
export const useSelectTenantTradeNameQuery = () => {
  return useQuery({
    ...getTenantBrandingQuery(),
    select: useCallback((data: GetTenantBrandingData) => {
      return data.tradeName;
    }, []),
  });
};

/**
 * hook to update tenant branding data in query
 */
export const useSelectUpdateTenantBrandingDataQuery = () => {
  const queryClient = useQueryClient();

  return (branding: Partial<GetTenantBrandingData>) => {
    queryClient.setQueryData(getTenantBrandingQuery().queryKey, (oldData) =>
      oldData ? { ...oldData, ...branding } : oldData
    );
  };
};

/**
 * hook to invalidate tenant branding data query
 */
export const useSelectRefreshTenantBrandingDataQuery = () => {
  const queryClient = useQueryClient();

  return async () =>
    queryClient.invalidateQueries(getTenantBrandingQuery().queryKey);
};
