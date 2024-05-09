import type { GetPricesData } from '../../hooks/useGetPrices/useGetPrices';

export const getInitialValue = (prices?: GetPricesData['data']) => {
  if (!prices) {
    return null;
  }

  const activePrice = prices.find((price) => price.active);

  return activePrice?.id ?? null;
};
