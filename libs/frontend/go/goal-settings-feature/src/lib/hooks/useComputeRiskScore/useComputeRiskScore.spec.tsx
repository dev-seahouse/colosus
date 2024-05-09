import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useComputeRiskProfileScore from './useComputeRiskScore';
import type { ConnectInvestorComputeRiskProfileScoreRequestDto } from '@bambu/api-client';

const args = {
  questionnaireId: 'cbacafa5-7d7e-4d39-9bc3-6ce1839e3266',
  questionnaireVersion: 1,
  answers: [
    {
      questionGroupingId: '7ca3ad84-fa07-4bbf-8e5e-d21f5347df47',
      questionId: 'c0b51a4b-4f17-42c9-8e63-2fa78dc52dc3',
      answerId: '',
      answerScoreNumber: 21,
    },
  ],
} satisfies ConnectInvestorComputeRiskProfileScoreRequestDto;

describe('useComputeRiskProfileScore', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useComputeRiskProfileScore(), {
      wrapper: queryClientWrapper,
    });

    const { mutate } = result.current;
    mutate(args);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
