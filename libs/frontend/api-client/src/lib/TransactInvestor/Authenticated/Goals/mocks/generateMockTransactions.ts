import {
  InvestorBrokerageIntegrationTransactionDto,
  InvestorBrokerageIntegrationTransactionStatusEnum,
  InvestorBrokerageIntegrationTransactionTypeEnum,
} from '../Goals';

export function generateMockTransactions() {
  const mockData: InvestorBrokerageIntegrationTransactionDto[] = [];

  const transactionTypes = Object.values(
    InvestorBrokerageIntegrationTransactionTypeEnum
  );
  const transactionStatuses = Object.values(
    InvestorBrokerageIntegrationTransactionStatusEnum
  );

  const currentDate = new Date();

  for (let i = 0; i < 90; i++) {
    const pastDate = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000); // Date i days ago
    const formattedPastDate = pastDate.toISOString().split('T')[0];
    const numItems = Math.floor(Math.random() * 6); // Random number of items between 0 and 5

    for (let j = 0; j < numItems; j++) {
      const mockItem: InvestorBrokerageIntegrationTransactionDto = {
        type: transactionTypes[
          Math.floor(Math.random() * transactionTypes.length)
        ], // Random transaction type
        status:
          transactionStatuses[
            Math.floor(Math.random() * transactionStatuses.length)
          ], // Random transaction status
        price: {
          currency: 'USD',
          amount: 100.0,
        },
        portfolioId: `portfolioId_${i}_${j}`,
        isin: `ISIN_${i}_${j}`,
        quantity: Math.floor(Math.random() * 6), // Random quantity between 0 and 5
        consideration: {
          currency: 'USD',
          amount: 1000.0,
        },
        charges: {
          currency: 'USD',
          amount: 10.0,
        },
        bookCost: null,
        date: formattedPastDate,
        timestamp: pastDate.toISOString(),
        settledOn: formattedPastDate,
        updatedAt: pastDate.toISOString(),
        id: `transactionId_${i}_${j}`,
      };

      mockData.push(mockItem);
    }
  }
  return mockData;
}

export default generateMockTransactions;
