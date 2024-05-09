import type { ConnectInvestorGetInvestorPortfolioDetailsResponseDto } from '@bambu/api-client';
import { ConnectInvestorPortfolioDetailsApi } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';

export type GetInvestorPortfolioDetailsData =
  ConnectInvestorGetInvestorPortfolioDetailsResponseDto;

export interface GetInvestorPortfolioDetailsArgs {
  portfolioID: GetInvestorPortfolioDetailsData['id'];
}

export const getInvestorPortfolioDetailsQuery = (
  args: GetInvestorPortfolioDetailsArgs
) => ({
  queryKey: ['getInvestorPortfolioDetails', args.portfolioID],
  queryFn: async () => {
    const api = new ConnectInvestorPortfolioDetailsApi();
    const res = await api.getInvestorPortfolio({
      id: args.portfolioID,
    });
    return res.data;
  },
});
export const useGetInvestorPortfolioDetails = ({
  initialData,
  args,
}: {
  initialData?: GetInvestorPortfolioDetailsData;
  args: GetInvestorPortfolioDetailsArgs;
}) => {
  return useQuery({
    ...getInvestorPortfolioDetailsQuery(args),
    initialData,
  });
};
