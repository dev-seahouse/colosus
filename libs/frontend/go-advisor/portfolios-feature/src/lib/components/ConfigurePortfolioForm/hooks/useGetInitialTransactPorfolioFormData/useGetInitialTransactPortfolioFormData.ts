import useGetTransactInstruments from '../../../../hooks/useGetTransactInstruments/useGetTransactInstruments';
import type {
  AdvisorGetInstrumentsResponseDto,
  GetModelPortfolioResponseDto,
} from '@bambu/api-client';
import type { ConfigurePortfolioFormState } from '../../ConfigurePortfolioForm.types';
import { useGetTransactModelPortfolios } from '@bambu/go-advisor-core';

const INDEX_OF_CASH_INSTRUMENT = 0;

// main
export function useGetInitialTransactPortfolioFormData({
  connectPortfolioId,
}: {
  connectPortfolioId: string;
}) {
  const {
    data: cashInstrument,
    isLoading: isCashInstrumentLoading,
    isError: isCashInstrumentError,
  } = useGetTransactInstruments<
    AdvisorGetInstrumentsResponseDto['data'][number]
  >(
    {
      pageIndex: 0,
      pageSize: 1,
      searchString: 'Cash - Pound Sterling',
    },
    { select: selectCashInstrument }
  );

  const {
    data: transactPortfolioAssetAllocationFormData,
    isLoading: isTransactPortfolioLoading,
    isError: isTransactPortfoliosError,
  } = useGetTransactModelPortfolios<
    | ReturnType<ReturnType<typeof selectTransactAssetAllocationFormData>>
    | undefined
  >({
    select: selectTransactAssetAllocationFormData(connectPortfolioId),
    enabled: !!connectPortfolioId,
    refetchOnMount: true, // !important do not turn off
    refetchOnWindowFocus: false, //!important do not turn off
  });

  return {
    data: hasNoPortfoliosYet(transactPortfolioAssetAllocationFormData)
      ? getInitialFormDataForEmptyPortfolio(cashInstrument)
      : transactPortfolioAssetAllocationFormData?.[0],
    isLoading: isCashInstrumentLoading || isTransactPortfolioLoading,
    isError: isCashInstrumentError || isTransactPortfoliosError,
  };
}

// methods
function hasNoPortfoliosYet(
  arg: Pick<ConfigurePortfolioFormState, 'transact'>[] | undefined
) {
  return Array.isArray(arg) && arg.length === 0;
}

function selectCashInstrument(res: AdvisorGetInstrumentsResponseDto) {
  return res.data?.[INDEX_OF_CASH_INSTRUMENT];
}

function selectTransactAssetAllocationFormData(connectPortfolioId: string) {
  return (data: GetModelPortfolioResponseDto[]) => {
    if (!Array.isArray(data)) return [];
    return (
      data?.filter(byConnectPortfolioId(connectPortfolioId)).map((p) => ({
        transact: {
          instruments:
            p.TransactModelPortfolioInstruments?.map((i) => ({
              instrumentId: i.instrumentId,
              ticker: i.Instrument?.bloombergTicker ?? '',
              name: i.Instrument?.name ?? '',
              currency: i.Instrument?.InstrumentCurrency?.iso4217Code ?? '',
              type: i.Instrument?.InstrumentAssetClass?.name ?? '',
              weightage: Math.round(i.weightage * 100),
            })).sort(moveCashToFirst) ?? [],
          rebalancingThreshold: Math.round(
            Number(p.rebalancingThreshold) * 100
          ),
          totalWeight: Math.round(
            (p.TransactModelPortfolioInstruments?.reduce(
              sumItemInObj('weightage'),
              0
            ) ?? 0) * 100
          ),
          factSheet: {
            hasUploaded: !!p.factSheetUrl?.length,
            url: p.factSheetUrl ?? '',
          },
        },
      })) ?? []
    );
  };
}

function byConnectPortfolioId(connectPortfolioId: string) {
  return (p: { id: string }) => p.id === connectPortfolioId;
}

function getInitialFormDataForEmptyPortfolio(
  cashInstrument: AdvisorGetInstrumentsResponseDto['data'][number] | undefined
) {
  return {
    transact: {
      instruments: [
        {
          instrumentId: cashInstrument?.id ?? '',
          ticker: cashInstrument?.bloombergTicker ?? '',
          name: cashInstrument?.name ?? '',
          currency: cashInstrument?.InstrumentCurrency?.iso4217Code ?? '',
          type: cashInstrument?.InstrumentAssetClass?.name ?? '',
          weightage: Math.round(0.02 * 100),
        },
      ],
      rebalancingThreshold: Math.round(0.1 * 100),
      totalWeight: Math.round(0.02 * 100),
      factSheet: {
        hasUploaded: false,
        url: '',
      },
    },
  } satisfies Pick<ConfigurePortfolioFormState, 'transact'>;
}

export function sumItemInObj<T extends object, Tkey extends keyof T>(
  varName: Tkey
) {
  return (acc: number, curr: T) => {
    return acc + curr[varName];
  };
}

function moveCashToFirst<T extends { type: string }>(a: T, b: T) {
  if (a.type === 'Cash' && b.type !== 'Cash') {
    return -1;
  } else if (a.type !== 'Cash' && b.type === 'Cash') {
    return 1;
  } else {
    return 0; // Maintain the original order
  }
}

export default useGetInitialTransactPortfolioFormData;
