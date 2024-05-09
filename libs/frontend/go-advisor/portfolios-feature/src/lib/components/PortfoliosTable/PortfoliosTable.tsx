import {
  Paper,
  ReactTable,
  Stack,
  TableContainer,
  Typography,
} from '@bambu/react-ui';
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import {
  EditButton,
  PendingActionButton,
  useSelectIsReadyToConfigureTransactPortfolioQuery,
  useSelectTransactConfiguredModelPortfolios,
} from '@bambu/go-advisor-core';

import type { GetConnectPortfoliosData } from '../../hooks/useGetConnectPortfolios/useGetConnectPortfolios';
import { useSelectConnectPortfolios } from '../../hooks/useGetConnectPortfolios/useGetConnectPortfolios.selectors';

const columnHelper =
  createColumnHelper<GetConnectPortfoliosData['portfolioSummaries'][number]>();

export function PortfoliosTable() {
  const navigate = useNavigate();
  const { data } = useSelectConnectPortfolios();
  const { data: configuredPortfolios } =
    useSelectTransactConfiguredModelPortfolios();

  const {
    data: isReadyToConfigureTransactPortfolio,
    isLoading: isLoadingIsReadyToConfigurePortfolio,
  } = useSelectIsReadyToConfigureTransactPortfolioQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor('key', {
        header: 'Investment Style',
        cell: (info) => (
          <Typography as="span" sx={{ textTransform: 'capitalize' }}>
            {info.getValue().toLowerCase()}
          </Typography>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Portfolio Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('expectedReturnPercent', {
        header: 'Expected Return (%)',
        cell: (info) => (
          <NumericFormat
            value={info.getValue()}
            displayType="text"
            decimalScale={1}
            fixedDecimalScale
          />
        ),
      }),
      columnHelper.accessor('expectedVolatilityPercent', {
        header: 'Expected  Volatility (%)',
        cell: (info) => (
          <NumericFormat
            value={info.getValue()}
            displayType="text"
            decimalScale={1}
            fixedDecimalScale
          />
        ),
      }),
      columnHelper.accessor('key', {
        id: 'edit-cta',
        header: '',
        cell: (info) => (
          <Typography align="right">
            {isReadyToConfigureTransactPortfolio ? (
              Array.isArray(configuredPortfolios) &&
              configuredPortfolios.includes(
                info.cell.row.original.id as string
              ) ? (
                <EditButton onClick={() => navigate(info.getValue())} />
              ) : (
                <PendingActionButton
                  onClick={() => navigate(info.getValue())}
                />
              )
            ) : (
              <EditButton onClick={() => navigate(info.getValue())} />
            )}
          </Typography>
        ),
      }),
    ],
    [navigate, configuredPortfolios, isReadyToConfigureTransactPortfolio]
  );

  if (isLoadingIsReadyToConfigurePortfolio) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Typography>
        Configure your portfolios below to ensure your robo-advisor presents the
        appropriate solution.
      </Typography>
      <TableContainer component={Paper}>
        <ReactTable
          options={{
            data: data as GetConnectPortfoliosData['portfolioSummaries'],
            columns,
            getCoreRowModel: getCoreRowModel(),
          }}
          aria-label="portfolios table"
        />
      </TableContainer>
    </Stack>
  );
}

export default PortfoliosTable;
