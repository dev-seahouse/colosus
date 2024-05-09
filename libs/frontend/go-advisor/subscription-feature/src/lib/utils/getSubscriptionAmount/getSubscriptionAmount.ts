/**
 * Get the subscription amount, converting from cents to dollars
 */
export const getSubscriptionAmount = (amount: string | number | null) => {
  if (!amount) {
    return 0;
  }
  return Number(amount) / 100;
};

export default getSubscriptionAmount;
