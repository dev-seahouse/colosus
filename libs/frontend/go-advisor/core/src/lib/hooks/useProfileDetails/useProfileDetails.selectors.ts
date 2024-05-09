import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { GetAdvisorProfileData, QueryArgs } from '@bambu/go-core';

import type { GetProfileDetailsData } from './useProfileDetails';
import { getProfileDetailsQuery } from './useProfileDetails';
import { useSelectHasUserUploadedDocumentQuery } from '../useGetUploadedDocuments/useGetUploadedDocuments.selectors';
import { useSelectKycStatus } from '../useGetTenantBrokerages/useGetTenantBrokerages.selectors';
import { SharedEnums } from '@bambu/shared';

/**
 * returns current user username
 */
export const useSelectUsernameQuery = (
  queryArgs?: QueryArgs<GetProfileDetailsData, string>
) => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!data) {
        return '-';
      }

      if (data.firstName && data.lastName) {
        return `${data.firstName} ${data.lastName}`;
      }

      return data.username;
    }, []),
    ...queryArgs,
  });
};

/**
 * returns current user firstname
 */
export const useSelectFirstNameQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!data) {
        return '-';
      }

      return data.firstName ?? '-';
    }, []),
  });
};

/**
 * hook to update (refetch) profile details query
 */
export const useSelectUpdateProfileDetailsQuery = () => {
  const queryClient = useQueryClient();
  const query = getProfileDetailsQuery();

  return useCallback(
    async () => queryClient.invalidateQueries(query.queryKey),
    [query.queryKey, queryClient]
  );
};

/**
 * hook to get current advisor initials
 */
export const useSelectAdvisorInitialsQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!data || !data.firstName || !data.lastName) {
        return '-';
      }

      return `${data?.firstName.charAt(0)}${data?.lastName.charAt(
        0
      )}`.toUpperCase();
    }, []),
  });
};

/**
 * hook to get current user profile status
 */
export const useSelectHasUserCompletedProfileQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!data || !data.firstName || !data.lastName || !data.subdomain) {
        return false;
      }

      return true;
    }, []),
  });
};

/**
 * hook to get current user branding task completion status
 */
export const useSelectHasUserCompletedBrandingQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData) =>
        data.platformSetupStatus?.hasUpdatedBranding ?? false,
      []
    ),
  });
};

/**
 * hook to get current user goal task completion status
 */
export const useSelectHasUserCompletedGoalsQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData) =>
        data.platformSetupStatus?.hasUpdatedGoals ?? false,
      []
    ),
  });
};

/**
 * hook to get current user portfolio task completion status
 */
export const useSelectHasUserCompletedPortfoliosQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData) =>
        data.platformSetupStatus?.hasUpdatedPortfolios ?? false,
      []
    ),
  });
};

/**
 * hook to get current user content task completion status
 */
export const useSelectHasUserCompletedContentQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData) =>
        data.platformSetupStatus?.hasUpdatedContent ?? false,
      []
    ),
  });
};

/**
 * query hook to get user subdomain
 */
export const useSelectSubdomainQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return data.subdomain;
    }, []),
  });
};

/**
 * hook to get current user subscription status
 */
export const useSelectHasActiveSubscriptionQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return data.hasActiveSubscription === true;
    }, []),
  });
};

/**
 * hook to get current user subscription status
 */
export const useSelectProfileQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      const {
        firstName,
        lastName,
        businessName,
        region,
        countryOfResidence,
        jobTitle,
      } = data;

      return {
        firstName,
        lastName,
        businessName,
        region,
        countryOfResidence,
        jobTitle,
      };
    }, []),
  });
};

/**
 * hook to get advisor's contact me content
 */
export const useSelectContactMeContentQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData) => ({
        contactMeReasonsRichText: data?.contactMeReasonsRichText,
        contactLink: data?.contactLink,
      }),
      []
    ),
  });
};

/**
 * hook to get advisor's profile summary content
 */
export const useSelectProfileSummaryContentQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return {
        profileBioRichText: data.profileBioRichText,
        fullProfileLink: data.fullProfileLink,
      };
    }, []),
  });
};

/**
 * hook to get advisor's profile summary content status
 */
export const useSelectHasUserCompletedProfileSummaryQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return data?.profileBioRichText && data?.profileBioRichText !== '';
    }, []),
  });
};

/**
 * hook to get advisor's contact me status
 */
export const useSelectHasUserCompletedContactMeQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return (
        data?.contactMeReasonsRichText && data?.contactMeReasonsRichText !== ''
      );
    }, []),
  });
};

/**
 * query hook to get user tenant URL
 */
export const useSelectTenantUrlQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (import.meta.env.DEV) {
        return 'http://127.0.0.1:4200';
      }

      return `https://${data.subdomain}${
        import.meta.env.VITE_ADVISOR_TENANT_URL_EXTENSION
      }.go-bambu.co`;
    }, []),
  });
};

/**
 * hook to get advisor's profile subscription type
 */
export const useSelectUserSubscriptionTypeQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!Array.isArray(data?.subscriptions) || !data.subscriptions.length)
        return null;
      return data.subscriptions[0].bambuGoProductId;
    }, []),
  });
};

/**
 * hook to get advisor's profile stripe subscription id
 */
export const useSelectUserSubscriptionIdQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!data?.subscriptions?.length) return null;
      return data.subscriptions[0].subscriptionId;
    }, []),
  });
};

/**
 * hook to get advisor's profile interest in transact flag
 */
export const useSelectUserInterestInTransactFlagQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      if (!data?.subscriptions?.length) return null;
      return data.subscriptions[0].isInterestedInTransact;
    }, []),
  });
};

/**
 * query hook to construct advisor profile data to be used by preview
 */
export const useSelectInitialAdvisorProfileForInvestorAppQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData): GetAdvisorProfileData => {
        return {
          canPerformTransactActions: false,
          firstName: data.firstName ?? '[Your first name]',
          lastName: data.lastName ?? '[Your last name]',
          tenantRealm: data.tenantRealm ?? '-',
          advisorSubscriptionIds: 'CONNECT',
          contactMeReasonsRichText: data.contactMeReasonsRichText,
          profileBioRichText: data.profileBioRichText,
          fullProfileLink: data.fullProfileLink ?? '',
          jobTitle: data.jobTitle ?? '[Your job title]',
          advisorSubscriptionInPlace: true,
          advisorProfilePictureUrl: data.advisorProfilePictureUrl,
          contactLink: data.contactLink ?? null,
          incomeThreshold: 0,
          retireeSavingsThreshold: 0,
        };
      },
      []
    ),
  });
};

/**
 * hook to get the index of unfinished task
 */
export const useSelectUnfinishedTaskIndexQuery = () => {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();
  const { data: hasUserCompletedBranding } =
    useSelectHasUserCompletedBrandingQuery();
  const { data: hasUserCompletedGoals } = useSelectHasUserCompletedGoalsQuery();
  const { data: hasUserCompletedPortfolios } =
    useSelectHasUserCompletedPortfoliosQuery();
  const { data: hasUserCompletedContent } =
    useSelectHasUserCompletedContentQuery();
  const { data: hasUserUploadedDocument } =
    useSelectHasUserUploadedDocumentQuery();
  const { data: hasActiveSubscription } = useSelectHasActiveSubscriptionQuery();

  return (
    [
      hasUserCompletedProfile,
      hasUserCompletedBranding,
      hasUserCompletedGoals,
      hasUserCompletedPortfolios,
      hasUserCompletedContent,
      hasUserUploadedDocument,
      hasActiveSubscription,
    ].findIndex((isCompleted) => !isCompleted) ?? 0
  );
};

/**
 * query hook to get advisor's public profile picture
 */
export const useSelectAdvisorPublicProfilePictureQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback(
      (data: GetProfileDetailsData) => data?.advisorProfilePictureUrl,
      []
    ),
  });
};

/**
 * hook to return if platform is ready for preview
 */
export const useSelectIsReadyForPreviewQuery = () => {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();
  const { data: hasUserCompletedBranding } =
    useSelectHasUserCompletedBrandingQuery();
  const { data: hasActiveSubscription } = useSelectHasActiveSubscriptionQuery();

  return (
    hasUserCompletedProfile && hasUserCompletedBranding && hasActiveSubscription
  );
};

/**
 * hook to return if user is ready to subscribe
 */
export const useSelectUserReadyToSubscribe = () => {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();
  const { data: hasUserCompletedBranding } =
    useSelectHasUserCompletedBrandingQuery();

  return hasUserCompletedProfile && hasUserCompletedBranding;
};

/**
 * hook to check if user has uploaded profile picture
 */
export const useSelectAdvisorHasProfilePictureQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return data.advisorInternalProfilePictureUrl !== null;
    }, []),
  });
};

/**
 * hook to get advisor's internal profile picture
 */
export const useSelectAdvisorInternalProfilePictureQuery = () => {
  return useQuery({
    ...getProfileDetailsQuery(),
    select: useCallback((data: GetProfileDetailsData) => {
      return data.advisorInternalProfilePictureUrl;
    }, []),
  });
};

export const useSelectIsReadyToConfigureTransactPortfolioQuery = () => {
  const {
    data: hasActiveSubscription,
    isLoading: isLoadingHasActiveSub,
    isError: isHasActiveSubError,
    isSuccess: isHasActiveSubSuccess,
  } = useSelectHasActiveSubscriptionQuery();
  const {
    data: kycStatus,
    isLoading: isKycLoading,
    isError: isKycError,
    isSuccess: isKycSuccess,
  } = useSelectKycStatus();

  const unfinishedTasks = useSelectUnfinishedTaskIndexQuery();

  const hasNoUnfinishedTask = unfinishedTasks < 0;

  const isKycActiveOrInProgress =
    kycStatus === SharedEnums.TenantTransactBrokerageStatusEnum.ACTIVE ||
    kycStatus === SharedEnums.TenantTransactBrokerageStatusEnum.KYC_IN_PROGRESS;

  return {
    data:
      hasActiveSubscription && hasNoUnfinishedTask && isKycActiveOrInProgress,
    isLoading: isKycLoading || isLoadingHasActiveSub,
    isError: isKycError || isHasActiveSubError,
    isSuccess: isKycSuccess || isHasActiveSubSuccess,
  };
};
