import { useApiStore } from '@bambu/api-client';
import useCoreStore from './useCoreStore';

/**
 * returns user login status, currently based on existence of access token (hook)
 */
export const useSelectIsUserLoggedIn = () => {
  return useApiStore((state) => state.accessToken !== null);
};

/**
 * returns user login status, currently based on existence of access token (non-hook)
 */
export const selectIsUserLoggedIn = () => {
  return useApiStore.getState().accessToken !== null;
};

/**
 * hook to get function to set user data
 */
export const useSelectSetUserData = () => {
  return useCoreStore((state) => state.setUserData);
};

/**
 * hook to get function to get user subscription type
 */
export const useSelectUserSubscriptionType = () => {
  return useCoreStore((state) => state.subscriptionType);
};

/**
 * hook to get function to get user subscription type
 */
export const useSelectIsTransactUser = () => {
  return useCoreStore((state) => state.subscriptionType === 'TRANSACT');
};

/**
 * hook to get function to get user's interest in transact
 */
export const useSelectUserInterestInTransact = () => {
  return useCoreStore((state) => state.isInterestedInTransact);
};

/**
 * hook to get function to get which product type user clicked on from marketing website
 */
export const useSelectUserMarketingProductTypeInterest = () => {
  return useCoreStore((state) => state.marketingProductTypeInterest);
};

/**
 * hook to get function to get if user has configured robo settings
 */
export const useSelectUserIsRoboSettingsConfigured = () => {
  return useCoreStore((state) => state.isRoboSettingsConfigured);
};

/**
 * hook to get function to get reviewed questionnaire status
 */
export const useSelectUserIsQuestionnaireReviewed = () => {
  return useCoreStore((state) => state.isQuestionnaireReviewed);
};

/**
 * hook to get function to get kuc status
 */
export const useSelectUserKycStatus = () => {
  return useCoreStore((state) => state.kycStatus);
};

/**
 * hook to get function to get if user is ready to set up transact
 */
export const useSelectUserIsKycVerified = () => {
  return useCoreStore((state) => {
    const isSubscribedToConnect = state.subscriptionType === 'CONNECT';
    const isInterestedInTransact = state.isInterestedInTransact;
    const isKycStatusVerified = state.kycStatus === 'ACTIVE';

    return (
      isSubscribedToConnect && isInterestedInTransact && isKycStatusVerified
    );
  });
};
