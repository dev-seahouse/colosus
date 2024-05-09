import {
  ConnectGetInvestorRiskQuestionnaireResponseDto,
  ConnectInvestorRiskQuestionnaireAnswer,
} from '@bambu/api-client';
import type { CoreStoreStateCreator } from '../useCoreStore';
import { TransformedInvestorRiskQuestionnaireGrouping } from '../../hooks/useGetInvestmentStyleQuestionnaire/useGetInvestmentStyleQuestionnaire.selectors';

export interface UserState {
  name: string | null;
  email: string | null;
  zipCode: string | null;
  age: number | null;
  incomePerAnnum: number | null;
  monthlySavings: number | null;
  currentSavings: number | null;
  riskAppetite: string | null; // TODO: this should be proper tuple /enum , not string
  riskProfileId: string | null;
  hasSelectedRiskQuestionnaire: boolean;
  riskQuestionnaire: RiskQuestionnaire | null;
}

export interface UserAction {
  setUserData: (user: Partial<UserState>) => void;
  updateRiskQuestionnaire: (payload: UpdateRiskQuestionnairePayload) => void;
  setHasSelectedRiskQuestionnaire: (isSelected: boolean) => void;
}
export type UserSlice = UserState & UserAction;
export type RiskQuestionnaire = {
  questionnaireId: string;
  questionnaireVersion: ConnectGetInvestorRiskQuestionnaireResponseDto['activeVersion'];
  questionnaireAnswers: ReadonlyArray<ConnectInvestorRiskQuestionnaireAnswer>;
};
type UpdateRiskQuestionnairePayload = Pick<
  ConnectInvestorRiskQuestionnaireAnswer,
  'questionId' | 'answerId' | 'answerScoreNumber'
> & {
  questionnaireGroup: TransformedInvestorRiskQuestionnaireGrouping;
};

const initialState: UserState = {
  name: null,
  zipCode: null,
  email: null,
  age: null,
  incomePerAnnum: null,
  monthlySavings: null,
  currentSavings: null,
  riskAppetite: null, // actually risk profile name. TODO: remove this and retrieve from riskProfileId
  riskProfileId: null,
  hasSelectedRiskQuestionnaire: false,
  riskQuestionnaire: null,
};

export const userSlice: CoreStoreStateCreator<UserSlice> = (set) => ({
  ...initialState,
  setUserData: (newUserData) => set(() => ({ ...newUserData })),
  updateRiskQuestionnaire: ({
    questionnaireGroup,
    answerId,
    questionId,
    answerScoreNumber,
  }) =>
    set((state) => {
      const questionnaireId = questionnaireGroup.riskQuestionnaireId;
      const questionnaireVersion = questionnaireGroup.riskQuestionnaireVersion;
      const questionGroupingId = questionnaireGroup.id;

      const answer = {
        answerId,
        questionId,
        questionGroupingId,
        answerScoreNumber,
      } satisfies ConnectInvestorRiskQuestionnaireAnswer;

      if (!answer || !questionnaireVersion || !questionnaireId) {
        console.error(
          'no questionnaire answer data provided when calling updateRiskQuestionnaire'
        );
        return state;
      }

      const newQuestionnaireAnswers =
        state.riskQuestionnaire?.questionnaireAnswers ?? [];

      return {
        ...state,
        riskQuestionnaire: {
          questionnaireId,
          questionnaireVersion,
          questionnaireAnswers: [
            ...newQuestionnaireAnswers.filter(byQuestionId(answer)),
            answer,
          ],
        },
      };
    }),
  setHasSelectedRiskQuestionnaire: (isSelected: boolean) =>
    set((state) => ({
      ...state,
      hasSelectedRiskQuestionnaire: isSelected,
    })),
});

export default userSlice;

function byQuestionId(a: ConnectInvestorRiskQuestionnaireAnswer) {
  return (b: ConnectInvestorRiskQuestionnaireAnswer) =>
    b.questionId !== a.questionId;
}
