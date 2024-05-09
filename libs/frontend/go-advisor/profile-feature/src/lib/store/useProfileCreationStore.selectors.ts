import { shallow } from 'zustand/shallow';
import useProfileCreationStore from './useProfileCreationStore';

/**
 * returns the values of the advisor details
 */
export const useSelectAdvisorDetailsValues = () => {
  return useProfileCreationStore(
    ({ countryOfResidence, finra, firstName, lastName, jobTitle }) => ({
      countryOfResidence,
      finra,
      firstName,
      lastName,
      jobTitle,
    }),
    shallow
  );
};

/**
 * returns function to set advisor details
 */
export const useSelectSetAdvisorDetails = () => {
  return useProfileCreationStore((state) => state.setAdvisorDetails);
};

/**
 * returns the onboarding progress value
 */
export const useSelectOnboardingProgress = () => {
  return useProfileCreationStore((state) => state.layout.progress);
};

/**
 * returns function to set onboarding progress
 */
export const useSelectSetOnboardingProgress = () => {
  return useProfileCreationStore((state) => state.layout.setProgress);
};

/**
 * returns the show back button value
 */
export const useSelectShowBackButton = () => {
  return useProfileCreationStore((state) => state.layout.showBackButton);
};

/**
 * returns function to set show back button
 */
export const useSelectSetShowBackButton = () => {
  return useProfileCreationStore((state) => state.layout.setShowBackButton);
};

/**
 * returns function to reset layout state
 */
export const useSelectResetLayoutState = () => {
  return useProfileCreationStore((state) => state.layout.resetLayoutState);
};
