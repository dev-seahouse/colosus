import type { AuthStoreStateCreator } from '../useProfileCreationStore';

export interface AdvisorDetailsState {
  firstName: string;
  lastName: string;
  finra: string;
  jobTitle: string;
  countryOfResidence: string;
}

export interface AdvisorDetailsAction {
  setAdvisorDetails: (advisorDetails: Partial<AdvisorDetailsState>) => void;
}

export type AdvisorDetailsSlice = AdvisorDetailsState & AdvisorDetailsAction;

export const createAdvisorDetailsSlice: AuthStoreStateCreator<
  AdvisorDetailsSlice
> = (set) => ({
  countryOfResidence: '',
  finra: '',
  firstName: '',
  lastName: '',
  jobTitle: '',
  setAdvisorDetails: (advisorDetails) =>
    set(
      (state) => ({ ...state, ...advisorDetails }),
      false,
      'setAdvisorDetails'
    ),
});
