import { z } from 'zod';
import type { ConfigurePortfolioFormState } from './ConfigurePortfolioForm.types';
import type { TransactModelPortfolioSummaryDto } from '@bambu/api-client';

const payloadSchema = z.object({
  connectPortfolioSummaryId: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  description: z.string(),
  expectedAnnualReturn: z.number(),
  expectedAnnualVolatility: z.number(),
  factSheetUrl: z.string(),
  id: z.string(),
  name: z.string(),
  rebalancingThreshold: z.number(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

interface ComposeTransactPortfolioPayloadArgs {
  formData: ConfigurePortfolioFormState;
  connectPortfolioId: string;
}
export function composeTransactPortfolioPayload({
  formData,
  connectPortfolioId,
}: ComposeTransactPortfolioPayloadArgs) {
  const {
    name,
    description,
    expectedReturnPercent,
    expectedVolatilityPercent,
    transact: { rebalancingThreshold, factSheet },
  } = formData;

  const payload: TransactModelPortfolioSummaryDto = Object.assign(
    {
      connectPortfolioSummaryId: connectPortfolioId,
      createdAt: new Date().toISOString(),
      createdBy: '',
      updatedAt: new Date().toISOString(),
      updatedBy: '',
      description,
      expectedAnnualReturn: Number(expectedReturnPercent),
      expectedAnnualVolatility: Number(expectedVolatilityPercent),
      factSheetUrl: factSheet?.url ?? '',
      id: connectPortfolioId,
      name,
      rebalancingThreshold: Number(rebalancingThreshold) / 100,
    },
    {}
  );

  const res = payloadSchema.safeParse(payload);

  if (!res.success) {
    console.log(res.error);
  }

  return payloadSchema.safeParse(payload);
}
