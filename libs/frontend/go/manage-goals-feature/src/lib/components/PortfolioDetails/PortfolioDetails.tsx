import {
  CurrencyText,
  DataSheetLink,
  SkeletonLoading,
  useGetInvestorGoalDetails,
  useGetInvestorModelPortfolio,
} from '@bambu/go-core';
import {
  Box,
  Card,
  ErrorLoadingData,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@bambu/react-ui';
import React from 'react';

import { useGetInvestorGoalHoldings } from '../../hooks/useGetInvestorGoalHoldings/useGetInvestorGoalHoldings';
import { useParams } from 'react-router-dom';
import get from 'lodash/get';

const assetColumnHelper: {
  label: string;
  field: any;
  getDisplayValue?: (value: number) => React.ReactNode;
}[] = [
  {
    label: 'Ticker',
    field: 'Instrument.bloombergTicker',
  },
  {
    label: 'Units',
    field: 'units',
  },
  {
    label: 'Current Value',
    field: 'currentValue',
    getDisplayValue(value) {
      return value != null ? <CurrencyText value={value} /> : '-';
    },
  },
];

export function PortfolioDetails() {
  const { goalId } = useParams();
  const { data: goal } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );
  const { data: holdings, isLoading: isHoldingsloading } =
    useGetInvestorGoalHoldings(goalId ?? '', {
      enabled: !!goalId,
    });
  const portfolioSummaryId = goal?.connectPortfolioSummaryId;

  const {
    data: modelPortfolios,
    isError,
    isLoading,
  } = useGetInvestorModelPortfolio(portfolioSummaryId as string, {
    enabled: !!portfolioSummaryId,
  });

  return (
    <Card elevation={2}>
      <Box p={3}>
        <Stack>
          {isError && <ErrorLoadingData allowAction={true} />}
          {isLoading ? (
            <Typography>
              <SkeletonLoading />
            </Typography>
          ) : (
            <>
              <Typography fontWeight={700} mb={2} variant={'body2'}>
                {modelPortfolios?.name}
              </Typography>
              <Typography mb={2} fontWeight={400}>
                {modelPortfolios?.description}
              </Typography>
              <DataSheetLink
                name={modelPortfolios?.name}
                factSheetUrl={modelPortfolios?.factSheetUrl}
              />
              <Table>
                {isHoldingsloading ? (
                  <SkeletonLoading variant={'small'} />
                ) : (
                  holdings?.map((holding, index) => (
                    <React.Fragment key={holding?.Instrument?.name}>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={assetColumnHelper.length}
                            style={{
                              borderBottom: 'none',
                              paddingBottom: '0',
                            }}
                          >
                            <Typography fontWeight={700} variant={'body2'}>
                              {holding?.Instrument?.name}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {assetColumnHelper.map((columnDef) => {
                            const {
                              label,
                              getDisplayValue = (v) => (v == null ? '-' : v),
                            } = columnDef;
                            return (
                              <TableCell
                                key={columnDef.field}
                                style={
                                  index === holdings.length - 1
                                    ? { borderBottom: 'none' }
                                    : {}
                                }
                              >
                                <Typography variant="caption">
                                  {label}
                                </Typography>
                                <Typography fontWeight={700} variant={'body2'}>
                                  {getDisplayValue(
                                    get(holding, columnDef.field)
                                  )}
                                </Typography>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </React.Fragment>
                  ))
                )}
              </Table>
            </>
          )}
        </Stack>
      </Box>
    </Card>
  );
}

export default PortfolioDetails;
