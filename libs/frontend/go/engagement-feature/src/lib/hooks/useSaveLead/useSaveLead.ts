import { useMutation } from '@tanstack/react-query';
import { ConnectInvestorLeadsApi } from '@bambu/api-client';
import type { ConnectInvestorSaveLeadRequestDto } from '@bambu/api-client';

export const saveLeadQuery = () => ({
  mutationKey: ['saveLead'],
  mutationFn: async (req: ConnectInvestorSaveLeadRequestDto) => {
    const connectInvestorLeadsApi = new ConnectInvestorLeadsApi();

    const res = await connectInvestorLeadsApi.saveLead(req);
    return res.data;
  },
});

export interface UseSaveLeadOptions {
  onSuccess?: () => void;
}

/**
 * query hook to save leads
 */
export function useSaveLead({ onSuccess }: UseSaveLeadOptions = {}) {
  return useMutation(saveLeadQuery().mutationKey, saveLeadQuery().mutationFn, {
    onSuccess,
  });
}

export default useSaveLead;
