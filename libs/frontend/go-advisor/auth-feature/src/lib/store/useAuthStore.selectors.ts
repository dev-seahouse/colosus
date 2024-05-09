import useAuthStore from './useAuthStore';

/**
 * returns reset password username
 */
export const useSelectResetPasswordUsername = () => {
  return useAuthStore((state) => state.resetPassword.username);
};

export const useSelectSetResetPasswordUsername = () => {
  return useAuthStore((state) => state.setResetPasswordUsername);
};
