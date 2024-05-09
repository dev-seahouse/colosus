import { SharedEnums } from '@bambu/shared';
import PortfolioSummary from '../PortfolioSummary/PortfolioSummary';
import { useSelectAdvisorSubscriptionTypeQuery } from '@bambu/go-core';
import TransactPortfolioSummary from '../TransactPortfolioSummary/TransactPortfolioSummary';

export function ProductRecommendationTabs() {
  const { data: subscriptionType } = useSelectAdvisorSubscriptionTypeQuery();
  return (
    <>
      {subscriptionType === SharedEnums.BambuGoProductIdEnum.TRANSACT ? (
        <TransactPortfolioSummary />
      ) : (
        <PortfolioSummary />
      )}
    </>
  );
}

export default ProductRecommendationTabs;
