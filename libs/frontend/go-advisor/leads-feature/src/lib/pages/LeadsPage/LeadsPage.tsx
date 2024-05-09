import { Box, Paper, Stack } from '@bambu/react-ui';
import {
  Heading,
  SearchBox,
  useGetPreferences,
  useSelectLeadsData,
  useSelectLeadsPaginationCount,
  useSelectLeadsTotalCounts,
} from '@bambu/go-advisor-core';
import LeadsTable from '../../components/LeadsTable/LeadsTable';
import LeadsFilterHeaderDataLoader from '../../components/LeadsFilterHeader/LeadsFilterHeaderDataLoader';
import { columns } from '../../components/LeadsTable/LeadsTable.columns';
import useLeadsTableStates from '../../hooks/useLeadsTableStates/useLeadsTableStates';
import { useGetConnectPortfolios } from '@bambu/go-advisor-portfolios-feature';
import type { ConnectAdvisorGetPreferencesResponseDto } from '@bambu/api-client';
import LeadsFilterDropdownMenu from '../../components/LeadsFilterDropdownMenu/LeadsFilterDropdownMenu';

interface LeadsPageInitialData {
  leadsSetting: ConnectAdvisorGetPreferencesResponseDto;
}

interface LeadsPageProps {
  initialData?: LeadsPageInitialData;
}

export function LeadsPage({ initialData }: LeadsPageProps) {
  const {
    filter,
    setFilter,
    search,
    debouncedSearch,
    setSearch,
    pageIndex,
    pageSize,
    pagination,
    setPaginationState,
  } = useLeadsTableStates();

  const queryArgs = {
    pageIndex,
    pageSize,
    nameFilter: debouncedSearch,
    qualifiedFilter: filter,
  };

  const { data: portfoliosData } = useGetConnectPortfolios();

  const { data: leadsData, isLoading: isLeadsLoading } = useSelectLeadsData(
    queryArgs,
    portfoliosData
  );
  const { data: totalCounts } = useSelectLeadsTotalCounts(queryArgs);
  const { data: paginationCounts } = useSelectLeadsPaginationCount(queryArgs);

  const { data: preferencesData } = useGetPreferences({
    initialData: initialData?.leadsSetting,
  });
  return (
    <Stack spacing={4}>
      <Heading title={'Leads'} />
      <Stack spacing={4}>
        <LeadsFilterHeaderDataLoader />
        <Paper sx={{ px: 1 }}>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ px: 3, py: 2 }}>
                <LeadsFilterDropdownMenu
                  leadsCount={totalCounts}
                  updateFilter={(e) => {
                    setFilter(e);
                    setPaginationState({
                      ...pagination,
                      pageIndex: 0,
                    });
                  }}
                />
              </Box>
              <Box sx={{ px: 2, py: 2, width: '243px' }}>
                <SearchBox
                  name="search-leads"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    /* when user starts searching ,reset to page 1,
                     because if there is only 1 record and user is currently at page 99,
                     there will not be any data
                  */
                    setPaginationState({
                      ...pagination,
                      pageIndex: 0,
                    });
                  }}
                  onCancelSearch={() => setSearch('')}
                  disabled={!leadsData?.length}
                />
              </Box>
            </Stack>

            <LeadsTable
              columns={columns}
              data={leadsData || []}
              totalCount={paginationCounts?.filteredCount ?? 0}
              pageCount={paginationCounts?.pageCount ?? 0}
              pagination={pagination}
              onPaginationChange={setPaginationState}
              isLoading={isLeadsLoading}
              globalFilter={search}
              onGlobalFilterChange={setSearch}
            />
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default LeadsPage;
