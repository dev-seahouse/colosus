import { useGetInvestmentStyleQuestionnaire } from './useGetInvestmentStyleQuestionnaire';
import {
  ConnectGetInvestorRiskQuestionnaireResponseDto,
  ConnectInvestorRiskQuestionnaireGroupingNames,
  ConnectInvestorRiskQuestionnaireGrouping,
} from '@bambu/api-client';

export type TransformedInvestorRiskQuestionnaireGrouping =
  ConnectInvestorRiskQuestionnaireGrouping & {
    riskQuestionnaireId: string;
    riskQuestionnaireVersion: number;
  };

export function getSortedQuestionnaires(
  key: ConnectInvestorRiskQuestionnaireGroupingNames
) {
  return (
    data: ConnectGetInvestorRiskQuestionnaireResponseDto
  ): TransformedInvestorRiskQuestionnaireGrouping | null => {
    const filteredGroup = data.Questionnaire.find(byGroupingName(key));

    if (filteredGroup) {
      const sortedQuestions = [...filteredGroup.Questions].sort(bySortKey);

      return {
        riskQuestionnaireId: data.id,
        riskQuestionnaireVersion: data.activeVersion,
        ...filteredGroup,
        Questions: sortedQuestions.map((question) => ({
          ...question,
          Answers: [...question.Answers].sort(bySortKey),
        })),
      };
    }

    console.error("Couldn't find questionnaire by key: " + key);

    return null;
  };
}

/**
 * hook to return the investment style questionnaire data by key
 * Page 1 & 2-> 'RISK_COMFORT_LEVEL'
 * Page 3 -> 'FINANCIAL_KNOWLEDGE'
 * Page 4 -> 'FINANCIAL_HEALTH'
 */
export const useSelectInvestorQuestionnaireGroupByKey = ({
  key,
  initialData,
}: {
  initialData?: ConnectGetInvestorRiskQuestionnaireResponseDto;
  key: ConnectInvestorRiskQuestionnaireGroupingNames;
}) =>
  // key: ConnectInvestorRiskQuestionnaireGroupingNames
  {
    return useGetInvestmentStyleQuestionnaire({
      initialData,
      select: getSortedQuestionnaires(key),
    });
  };
const byGroupingName = (key: string) => (group: { groupingName: string }) =>
  group.groupingName === key;

function bySortKey(a: { sortKey: number }, b: { sortKey: number }) {
  return a.sortKey - b.sortKey;
}
