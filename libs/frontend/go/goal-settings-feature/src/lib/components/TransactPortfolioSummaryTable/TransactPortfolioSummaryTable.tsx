import type { ITransactPortfolioInstrumentWithInstrumentDto } from '@bambu/shared';
import { Box, IconButton, ReactTable, Typography } from '@bambu/react-ui';
import DocumentIcon from '../TransactPortfolioSummary/DocumentIcon';
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table';
import {
  ErrorLoadingCard,
  LoadingCard,
  useGetInvestorModelPortfolio,
} from '@bambu/go-core';

const columnHelper =
  createColumnHelper<ITransactPortfolioInstrumentWithInstrumentDto>();

const columns = [
  columnHelper.accessor('Instrument', {
    header: () => (
      <Typography fontSize={'12px'} fontWeight={500}>
        Product Name
      </Typography>
    ),
    size: 500,
    cell: (info) => (
      <>
        <Typography variant={'body2'}>
          {info.getValue()?.bloombergTicker ?? '-'}
        </Typography>
        <Box
          sx={{
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
          }}
        >
          <Typography variant={'body2'}>
            {info.getValue()?.name ?? '-'}
          </Typography>
        </Box>
      </>
    ),
  }),
  columnHelper.accessor('weightage', {
    header: () => (
      <Typography fontSize={'12px'} fontWeight={500}>
        Weight
      </Typography>
    ),
    cell: (info) =>
      (info.getValue() ?? 0).toLocaleString('en', { style: 'percent' }),
  }),
  columnHelper.accessor('Instrument.InstrumentFactSheets', {
    header: () => (
      <Typography fontSize={'12px'} fontWeight={500}>
        Link
      </Typography>
    ),
    cell: (info) =>
      info.getValue()?.[0]?.url ? (
        <IconButton
          sx={{
            padding: 0,
          }}
          onClick={() =>
            window.open(info.getValue()?.[0]?.url, '_blank', 'noopener')
          }
        >
          <DocumentIcon />
        </IconButton>
      ) : null,
  }),
];

export function TransactPortfolioSummaryTable({
  connectPortfolioId,
}: {
  connectPortfolioId: string;
}) {
  const {
    data: modelPortfolio,
    isLoading: isModelPortfolioLoading,
    isError: isModelPortfolioError,
  } = useGetInvestorModelPortfolio(connectPortfolioId ?? '', {
    enabled: !!connectPortfolioId,
  });

  if (isModelPortfolioLoading) {
    return <LoadingCard />;
  }

  if (isModelPortfolioError) {
    return <ErrorLoadingCard />;
  }

  return (
    <ReactTable
      options={{
        data: modelPortfolio.TransactModelPortfolioInstruments ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
      }}
    />
  );
}

export default TransactPortfolioSummaryTable;
