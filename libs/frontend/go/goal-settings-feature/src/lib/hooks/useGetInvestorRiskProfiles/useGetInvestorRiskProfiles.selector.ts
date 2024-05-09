import type { UseQueryOptions } from '@tanstack/react-query';
import useGetInvestorRiskProfiles, {
  getInvestorRiskProfilesQuery,
} from './useGetInvestorRiskProfiles';
import type {
  ConnectInvestorGetInvestorRiskProfilesResponseDto,
  ConnectInvestorRiskProfileTypes,
} from '@bambu/api-client';
import { transformRiskProfileDescription } from '../../utils/transformRiskProfileDescription/transformRiskProfileDescription';

export type InvestorRiskProfileNamesMap = {
  [key in ConnectInvestorRiskProfileTypes]: {
    name: key;
    description: string[];
  };
};

// returns investor risk profiles keyed by name, e.g data['Very Conservative']
export function useSelectInvestorRiskProfilesNamesMap(
  options?: UseQueryOptions<
    ConnectInvestorGetInvestorRiskProfilesResponseDto,
    unknown,
    InvestorRiskProfileNamesMap,
    string[]
  >
) {
  return useGetInvestorRiskProfiles({
    queryKey: getInvestorRiskProfilesQuery.queryKey,
    queryFn: getInvestorRiskProfilesQuery.queryFn,
    select: (data) => transformRiskProfiles(data),
    ...options,
  });
}

export function transformRiskProfiles(
  data: ConnectInvestorGetInvestorRiskProfilesResponseDto
): InvestorRiskProfileNamesMap {
  return data.reduce((acc: any, item) => {
    acc[item.riskProfileName] = {
      name: item.riskProfileName,
      description: transformRiskProfileDescription(item.riskProfileDescription),
    };
    return acc;
  }, {} as InvestorRiskProfileNamesMap);
}

export function transFormRiskProfileToIdMap(
  data: ConnectInvestorGetInvestorRiskProfilesResponseDto
): TransformToIdMap<ConnectInvestorGetInvestorRiskProfilesResponseDto> {
  return data.reduce((acc: any, item) => {
    acc[item.id] = {
      ...item,
    };
    return acc;
  }, {});
}

type TransformToIdMap<T extends Array<{ id: string }>> = {
  [K in T[number]['id']]: Extract<T[number], { id: K }>;
};
