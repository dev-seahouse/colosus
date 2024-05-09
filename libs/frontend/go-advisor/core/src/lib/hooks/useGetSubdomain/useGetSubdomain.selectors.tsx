import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getSubdomainQuery } from './useGetSubdomain';
import type { GetSubdomainData } from './useGetSubdomain';

/**
 * returns the status of the subdomain registration
 */
export const useSelectHasRegisteredSubdomainQuery = () => {
  return useQuery({
    ...getSubdomainQuery(),
    select: useCallback((data: GetSubdomainData) => {
      return data.subdomain !== null;
    }, []),
  });
};

/**
 * returns current tenant subdomain and tradename
 */
export const useSelectSubdomainDataQuery = () => {
  return useQuery({
    ...getSubdomainQuery(),
    select: useCallback((data: GetSubdomainData) => {
      return data;
    }, []),
  });
};
