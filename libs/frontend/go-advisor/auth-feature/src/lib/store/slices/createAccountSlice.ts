import type { AuthStoreStateCreator } from '../useAuthStore';

export interface AccountSlice {
  resetPassword: { username: string };
  setResetPasswordUsername: (username: string) => void;
}

export const createAccountSlice: AuthStoreStateCreator<AccountSlice> = (
  set
) => ({
  resetPassword: {
    username: '',
  },

  setResetPasswordUsername: (username) =>
    set(
      (state) => ({ resetPassword: { ...state.resetPassword, username } }),
      false,
      'setResetPasswordUsername'
    ),
});
