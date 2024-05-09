import { useQueryClient, useQuery } from '@tanstack/react-query';

import { getAdvisorProfileQuery } from './useGetAdvisorProfile';
import type { GetAdvisorProfileData } from './useGetAdvisorProfile';

/**
 * hook to get advisor bio
 */
export const useSelectAdvisorBioQuery = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => {
      return {
        content: data.profileBioRichText ?? '',
        fullProfileLink: data.fullProfileLink ?? '',
      };
    },
  });
};

/**
 * hook to get advisor's reasons to contact me
 */
export const useSelectAdvisorReasonsToContactMeQuery = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) =>
      data.contactMeReasonsRichText ?? '',
  });
};

/**
 * hook to get advisor first name
 */
export const useSelectAdvisorFirstNameQuery = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => data.firstName ?? '',
  });
};

/**
 * hook to get advisor job title
 */
export const useSelectAdvisorJobTitle = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => data.jobTitle ?? 'your job title',
  });
};

/**
 * hook to get advisor advisorProfilePictureUrl
 */
export const useSelectAdvisorProfilePicture = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) =>
      data.advisorProfilePictureUrl ?? '',
  });
};

/**
 * hook to get advisor full name
 */
export const useSelectAdvisorFullNameQuery = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) =>
      data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : '[Your name]',
  });
};

/**
 * hook to update the advisor profile data in query
 */
export const useSelectUpdateAdvisorProfileQuery = () => {
  const queryClient = useQueryClient();

  return (newAdvisorProfile: Partial<GetAdvisorProfileData>) => {
    const query = getAdvisorProfileQuery();

    queryClient.setQueryData(query.queryKey, (oldData) =>
      oldData ? { ...oldData, ...newAdvisorProfile } : newAdvisorProfile
    );
  };
};

/**
 * hook to get advisor's subscription status'
 */
export const useSelectAdvisorHasActiveSubscriptionQuery = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => data.advisorSubscriptionInPlace,
  });
};

/**
 * hook to get advisor's contact link status
 */
export const useSelectAdvisorHasContactLink = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => data.contactLink !== null,
  });
};

/**
 * hook to get advisor's contact link
 */
export const useSelectAdvisorContactLink = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => data.contactLink ?? '/',
  });
};

export interface UseSelectIsGoodLeadQueryOptions {
  incomePerAnnum: number;
  annualSavings: number;
}

/**
 * query hook to check if the lead is a good lead
 */
export const useSelectIsGoodLeadQuery = ({
  incomePerAnnum = 0,
  annualSavings = 0,
}: UseSelectIsGoodLeadQueryOptions) => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) =>
      incomePerAnnum >= data.incomeThreshold ||
      annualSavings >= data.retireeSavingsThreshold,
  });
};

/**
 * hook to get advisor subscription type
 */
export const useSelectAdvisorSubscriptionTypeQuery = () => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    select: (data: GetAdvisorProfileData) => data?.advisorSubscriptionIds?.[0],
  });
};
