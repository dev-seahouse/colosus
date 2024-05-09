import { useQueryClient, useQuery } from '@tanstack/react-query';

import { getBrandingQuery } from './useGetBranding';
import type { GetBrandingData } from './useGetBranding';

/**
 * hook to return the platform name
 */
export const useSelectPlatformNameQuery = () => {
  return useQuery({
    ...getBrandingQuery(),
    staleTime: Infinity,
    select: (data: GetBrandingData) => data.tradeName,
  });
};

/**
 * hook to return the platform name
 */
export const useSelectLogoQuery = () => {
  return useQuery({
    ...getBrandingQuery(),
    staleTime: Infinity,
    select: (data: GetBrandingData) => data.logoUrl,
  });
};

/**
 * hook to update the branding data in query
 */
export const useSelectUpdateBrandingQuery = () => {
  const queryClient = useQueryClient();

  return (newBranding: Partial<GetBrandingData>) => {
    const query = getBrandingQuery();

    queryClient.setQueryData(query.queryKey, (oldData) =>
      oldData ? { ...oldData, ...newBranding } : newBranding
    );
  };
};
