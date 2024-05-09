import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getUploadedDocumentsQuery } from './useGetUploadedDocuments';
import type { GetUploadedDocumentsData } from './useGetUploadedDocuments';

/**
 * returns current tenant privacy policy document
 */
export const useSelectPrivacyPolicyDocumentUrlQuery = () => {
  return useQuery({
    ...getUploadedDocumentsQuery(),
    select: useCallback((data: GetUploadedDocumentsData) => {
      return data?.privacyPolicyUrl ?? '';
    }, []),
  });
};

/**
 * query hook to return if privacy policy document exists
 */
export const useSelectPrivacyPolicyDocumentExistsQuery = () => {
  return useQuery({
    ...getUploadedDocumentsQuery(),
    select: useCallback((data: GetUploadedDocumentsData) => {
      return data?.privacyPolicyUrl !== null;
    }, []),
  });
};

/**
 * returns current tenant terms and conditions document
 */
export const useSelectTermsAndConditionsDocumentUrlQuery = () => {
  return useQuery({
    ...getUploadedDocumentsQuery(),
    select: useCallback((data: GetUploadedDocumentsData) => {
      // discuss this to make it as URL
      return data?.termsAndConditionsUrl ?? '';
    }, []),
  });
};

/**
 * query hook to return if T&C document exists
 */
export const useSelectTermsAndConditionsDocumentExistsQuery = () => {
  return useQuery({
    ...getUploadedDocumentsQuery(),
    select: useCallback((data: GetUploadedDocumentsData) => {
      return data?.termsAndConditionsUrl !== null;
    }, []),
  });
};

/**
 * returns user document status
 */
export const useSelectHasUserUploadedDocumentQuery = () => {
  return useQuery({
    ...getUploadedDocumentsQuery(),
    select: useCallback((data: GetUploadedDocumentsData) => {
      // discuss this to make it as URL
      return (
        data?.termsAndConditionsUrl !== null && data?.privacyPolicyUrl !== null
      );
    }, []),
  });
};

/**
 * hook to update (refetch) uploaded documents query
 */
export const useSelectRefreshGetUploadedDocumentQuery = () => {
  const queryClient = useQueryClient();
  const query = getUploadedDocumentsQuery();

  return useCallback(
    async () => queryClient.invalidateQueries(query.queryKey),
    [query.queryKey, queryClient]
  );
};
