import { useCallback } from 'react';
import type { TenantTransactBrokerageResponseDto } from '@bambu/api-client';
import { SharedEnums } from '@bambu/shared';

import { useGetTenantBrokeragesQuery } from './useGetTenantBrokerages';

/**
 * returns current user username
 */
export const useSelectKycStatus = () => {
  return useGetTenantBrokeragesQuery<
    SharedEnums.TenantTransactBrokerageStatusEnum | null | undefined
  >({
    select: useCallback((data: TenantTransactBrokerageResponseDto) => {
      if (!data || !data.length) return;

      return data[0].status;
    }, []),
  });
};
