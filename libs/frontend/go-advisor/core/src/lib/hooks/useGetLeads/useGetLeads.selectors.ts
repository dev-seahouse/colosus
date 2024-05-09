import type {
  ConnectAdvisorGetLeadsRequestDto,
  ConnectAdvisorGetPortfoliosResponseDto,
  TLeadsCount,
  ConnectAdvisorGetLeadsResponseDto,
} from '@bambu/api-client';
import { LEADS_TYPES } from '@bambu/api-client';
import useGetLeads from './useGetLeads';
import { mapPortfolioIdToKeys } from '../utils/mapPortfolioIdToKeys';

type TPaginationCounts = Pick<
  ConnectAdvisorGetLeadsResponseDto,
  'filteredCount' | 'pageCount'
>;

// select data for pagination
export const useSelectLeadsPaginationCount = (
  args: ConnectAdvisorGetLeadsRequestDto,
  initialData?: ConnectAdvisorGetLeadsResponseDto
) => {
  return useGetLeads<TPaginationCounts>(args, {
    select: selectLeadsPaginationCount,
    initialData,
  });
};

// select data from filter (LeadsFilterTabs)
export const useSelectLeadsTotalCounts = (
  args: ConnectAdvisorGetLeadsRequestDto,
  initialData?: ConnectAdvisorGetLeadsResponseDto
) => {
  return useGetLeads<TLeadsCount>(args, {
    select: selectLeadsTypes,
    initialData,
  });
};

export const useSelectLeadsData = (
  args: ConnectAdvisorGetLeadsRequestDto,
  portfoliosData?: Partial<ConnectAdvisorGetPortfoliosResponseDto>, // undefined before portfolio api is called
  initialData?: ConnectAdvisorGetLeadsResponseDto
) => {
  return useGetLeads<ConnectAdvisorGetLeadsResponseDto['data']>(args, {
    enabled: !!portfoliosData, // query will not be called if portfolioData is undefined
    select: ({ data }) => mapPortfolioIdToKeys(data, portfoliosData),
    initialData,
  });
};

/* helpers */
function selectLeadsPaginationCount({
  pageCount,
  filteredCount,
}: Pick<ConnectAdvisorGetLeadsResponseDto, 'pageCount' | 'filteredCount'>) {
  return { pageCount, filteredCount };
}

function selectLeadsTypes({
  allTotalCount,
  transactTotalCount,
  qualifiedTotalCount,
}: Pick<
  ConnectAdvisorGetLeadsResponseDto,
  'allTotalCount' | 'transactTotalCount' | 'qualifiedTotalCount'
>) {
  return {
    [LEADS_TYPES.ALL]: allTotalCount,
    [LEADS_TYPES.TRANSACT]: transactTotalCount,
    [LEADS_TYPES.QUALIFIED]: qualifiedTotalCount,
  };
}
