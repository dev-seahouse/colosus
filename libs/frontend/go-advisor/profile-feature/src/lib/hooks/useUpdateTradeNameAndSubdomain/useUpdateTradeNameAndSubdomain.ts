import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorBrandAndSubdomainApi } from '@bambu/api-client';
import type { ConnectAdvisorUpdateBrandAndSubdomainRequestDto } from '@bambu/api-client';

export const updateTradeNameAndSubdomainQuery = () => ({
  mutationKey: ['updateTradeNameAndSubdomain'],
  mutationFn: async (req: ConnectAdvisorUpdateBrandAndSubdomainRequestDto) => {
    const connectAdvisorBrandAndSubdomainApi =
      new ConnectAdvisorBrandAndSubdomainApi();
    const res =
      await connectAdvisorBrandAndSubdomainApi.updateBrandAndSubdomain(req);

    return res.data;
  },
});

export interface UseUpdateTradeNameAndSubdomainOptions {
  onSuccess?: () => void;
}

export function useUpdateTradeNameAndSubdomain({
  onSuccess,
}: UseUpdateTradeNameAndSubdomainOptions = {}) {
  return useMutation(
    updateTradeNameAndSubdomainQuery().mutationKey,
    updateTradeNameAndSubdomainQuery().mutationFn,
    { onSuccess }
  );
}

export default useUpdateTradeNameAndSubdomain;
