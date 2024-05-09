import { Paper, ReactTable, Typography } from '@bambu/react-ui';
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import useGetRiskProfiles from '../../hooks/useGetRiskProfiles/useGetRiskProfiles';
import type { GetRiskProfilesData } from '../../hooks/useGetRiskProfiles/useGetRiskProfiles';
import { useMemo } from 'react';
import RiskProfileTableDescriptionCell from './RiskProfileTableDescriptionCell';

export interface RiskProfilesTableProps {
  initialRiskProfiles?: GetRiskProfilesData;
}

export const RISK_PROFILES_TABLE_ID = 'risk-profiles-table';

const columnHelper = createColumnHelper<
  GetRiskProfilesData[number] | undefined
>();

export function RiskProfilesTable({
  initialRiskProfiles,
}: RiskProfilesTableProps) {
  const { data: riskProfiles } = useGetRiskProfiles({
    ...(initialRiskProfiles && { initialData: initialRiskProfiles }),
  });
  const columns = useMemo(
    () => [
      columnHelper.accessor('riskProfileName', {
        header: 'Risk Profile',
        cell: (info) => (
          <Typography as="span" sx={{ textTransform: 'capitalize' }}>
            {info.getValue().toLowerCase()}
          </Typography>
        ),
        size: 1,
      }),
      columnHelper.accessor('riskProfileDescription', {
        header: 'Description',
        cell: (info) => (
          <RiskProfileTableDescriptionCell description={info.getValue()} />
        ),
        size: 300,
      }),
    ],
    []
  ) as ColumnDef<GetRiskProfilesData[number] | undefined>[];

  return (
    <Paper>
      {riskProfiles ? (
        <ReactTable
          options={{
            data: riskProfiles!,
            columns,
            getCoreRowModel: getCoreRowModel(),
          }}
          id={RISK_PROFILES_TABLE_ID}
          data-testid={RISK_PROFILES_TABLE_ID}
          aria-label={RISK_PROFILES_TABLE_ID}
        />
      ) : null}
    </Paper>
  );
}

export default RiskProfilesTable;
