import type {
  InvestorBrokerageIntegrationTransactionDto,
  InvestorBrokerageIntegrationTransactionsListAllResponseDto,
} from '@bambu/api-client';

const byDescendingDate = (a: string, b: string) =>
  new Date(b).getTime() - new Date(a).getTime();
export function groupDataByDate(
  data: InvestorBrokerageIntegrationTransactionsListAllResponseDto[] | undefined
) {
  if (!data) return {};

  const groupedData: {
    [date: string]: InvestorBrokerageIntegrationTransactionDto[];
  } = {};

  for (const dataArray of data) {
    for (const item of dataArray.results) {
      const { date } = item;

      if (groupedData[date]) {
        groupedData[date].push(item);
      } else {
        groupedData[date] = [item];
      }
    }
  }

  const sortedDates = Object.keys(groupedData).sort(byDescendingDate);

  for (const date of sortedDates) {
    groupedData[date] = groupedData[date].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return groupedData;
}
