import type {
  ConnectAdvisorGetLeadsResponseDto,
  ConnectAdvisorGetPortfoliosResponseDto,
} from '@bambu/api-client';
import { fromIdToKey } from './fromIdToKey';

interface TRiskAppetiteMap {
  [id: string]: string; //{id: "xxxx-xxx", key:"Conservative"}
}

export function mapPortfolioIdToKeys(
  leadsData: ConnectAdvisorGetLeadsResponseDto['data'],
  portfolioData?: Partial<ConnectAdvisorGetPortfoliosResponseDto>
) {
  if (!leadsData) {
    throw new Error('unexpected , leads data is null or undefined');
  }

  // if portfolio is not available return data first
  if (!portfolioData?.portfolioSummaries) return leadsData;

  // for type assertion, portfolioSummaries should always exist
  if (!portfolioData.portfolioSummaries.length) {
    throw new Error('portfolioSummary length is empty');
  }

  const portfolioSummaries = portfolioData.portfolioSummaries;

  const riskAppetiteMap = portfolioSummaries.reduce(
    fromIdToKey,
    {} as TRiskAppetiteMap
  );

  return leadsData.map((data) => ({
    ...data,
    riskAppetite: riskAppetiteMap[data.riskAppetite],
  }));
}
