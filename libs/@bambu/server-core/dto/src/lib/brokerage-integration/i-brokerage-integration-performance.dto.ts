export class IBrokerageIntegrationPerformanceDto {
  portfolioId: string;
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  accruedFees: number;
  netPerformance: number;
  grossPerformance: number;
  currency: string;
  calculatedAt: string;
}
