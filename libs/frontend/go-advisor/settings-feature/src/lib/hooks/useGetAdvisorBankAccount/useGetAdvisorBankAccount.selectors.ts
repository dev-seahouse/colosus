import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { GetAdvisorBankAccountResponseDto } from '@bambu/api-client';

import { getAdvisorBankAccountDetailsQuery } from './useGetAdvisorBankAccount';

/**
 * hoook to return if robo settings have been configured
 */
export const useSelectIsRoboSettingsConfigured = () => {
  return useQuery({
    ...getAdvisorBankAccountDetailsQuery(),
    select: useCallback((data: GetAdvisorBankAccountResponseDto) => {
      if (!data) return false;

      return true;
    }, []),
  });
};
