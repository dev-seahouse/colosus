import { z } from 'zod';

export const MAX_CHARACTERS = 300;

export const transactPortfolioSchema = z.object({
  factSheet: z.object({
    formData: z.any(),
    url: z.string(),
    hasUploaded: z.boolean().optional(),
  }),

  rebalancingThreshold: z
    .number({
      required_error: 'Rebalancing threshold is required',
    })
    .max(100, 'Rebalancing threshold must be between 0% and 100%')
    .optional(),
  totalWeight: z
    .number()
    .nullable()
    .refine((val) => val === 100, {
      message: 'Total weight must equal 100%',
    }),
  instruments: z.array(
    z
      .object({
        instrumentId: z.string().refine((val) => val !== '-', {
          message: 'Please remove empty products.',
        }),
        ticker: z.string(),
        name: z.string(),
        currency: z.string(),
        type: z.string(),
        weightage: z.number(),
        inputData: z
          .object({
            instrumentId: z.string(),
            ticker: z.string(),
            name: z.string(),
            currency: z.string(),
            type: z.string(),
          })
          .optional(),
      })
      .superRefine((val, ctx) => {
        if (val.type === 'Cash' && val.weightage < 1) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Cash weightage must be equal or greater than 1%',
            path: ['weightage'],
          });
        }
      })
  ),
});

export const getPortfolioDetailsSchema = ({
  isTransact,
}: {
  isTransact: boolean;
}) =>
  z.object({
    key: z.string(),
    name: z.string().min(1, 'A portfolio name is required'),
    description: z
      .string()
      .min(1, 'A portfolio description is required')
      .max(MAX_CHARACTERS),
    expectedReturnPercent: z.preprocess(
      (val) => String(val),
      z.string().min(1, 'Expected return is required.')
    ),
    expectedVolatilityPercent: z.preprocess(
      (val) => String(val),
      z.string().min(1, 'Expected volatility is required')
    ),
    reviewed: z.boolean(),
    showSummaryStatistics: z.boolean(),
    assetClassAllocation: z.array(
      z.object({
        assetClass: z.string(),
        percentOfPortfolio: z.string(),
        included: z.boolean(),
      })
    ),
    ...(isTransact && {
      transact: transactPortfolioSchema,
    }),
  });
