import { z } from 'zod';

export const makeRiskScorePayloadSchema = (numRiskProfileQuestions = 7) =>
  z.object({
    questionnaireId: z.string(),
    questionnaireVersion: z.number(),
    answers: z
      .array(
        z.object({
          questionId: z.string(),
          answerId: z.string(),
          questionGroupingId: z.string(),
          answerScoreNumber: z.number().nullable(),
        })
      )
      .length(numRiskProfileQuestions),
  });

export type ComputeRiskScorePayloadSchema = z.infer<
  ReturnType<typeof makeRiskScorePayloadSchema>
>;
