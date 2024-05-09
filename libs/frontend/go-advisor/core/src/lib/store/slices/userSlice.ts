import type { CoreStoreStateCreator } from '../useCoreStore';

export interface UserState {
  subscriptionType: string | null;
  isInterestedInTransact: boolean | null;
  marketingProductTypeInterest: string | null;
  isQuestionnaireReviewed: boolean | null;
  isRoboSettingsConfigured: boolean | null;
  kycStatus: string | null;
}

export interface UserAction {
  setUserData: (user: Partial<UserState>) => void;
}

export type UserSlice = UserState & UserAction;

// Will place robo settings and isQuestionnaireReviewed status in user slice for now. Will shift this elsewhere in the future
const initialState: UserState = {
  subscriptionType: null,
  isInterestedInTransact: null,
  marketingProductTypeInterest: null,
  isQuestionnaireReviewed: null,
  isRoboSettingsConfigured: null,
  kycStatus: null,
};

export const userSlice: CoreStoreStateCreator<UserSlice> = (set) => ({
  ...initialState,
  setUserData: (newUserData) => set(() => ({ ...newUserData })),
});

export default userSlice;
