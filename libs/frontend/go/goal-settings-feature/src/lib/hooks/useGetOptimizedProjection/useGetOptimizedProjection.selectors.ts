import { useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  GetOptimizedProjectionData,
  UseGetOptimizedProjectionOptions,
} from './useGetOptimizedProjection';
import { getOptimizedProjectionQuery } from './useGetOptimizedProjection';

/**
 * hook to get contribution recommendation
 */
export const useSelectContributionRecommendationQuery = ({
  initialData,
}: UseGetOptimizedProjectionOptions = {}) => {
  const queryClient = useQueryClient();
  return useQuery({
    ...getOptimizedProjectionQuery(queryClient),
    initialData,
    select: (data) => {
      return Math.ceil(
        // here it is divided by 12 because recommendation returned is annual but we need monthly
        // check composeInputs.compounding in useGetOptimizedProjection.utils.ts
        // it is set to yearly to improve performance
        (data?.recommendations?.constantInfusion?.[0] ?? 0) / 12
      );
    },
  });
};

/**
 * hook to get contribution recommendation
 */
export const useSelectProjectedRecommendationQuery = ({
  initialData,
}: UseGetOptimizedProjectionOptions = {}) => {
  const queryClient = useQueryClient();
  return useQuery({
    ...getOptimizedProjectionQuery(queryClient),
    initialData,
    select: (data) => {
      if (!data?.projections?.length) return null;

      return data.projections[data.projections.length - 1];
    },
  });
};

/**
 * hook to get projections
 */
export const useSelectProjectionsQuery = () => {
  const queryClient = useQueryClient();
  return useQuery({
    ...getOptimizedProjectionQuery(queryClient),
    select: (data: GetOptimizedProjectionData) => {
      return data.projections ?? [];
    },
  });
};
