import { render, screen } from '@bambu/react-test-utils';
import SetupContributionRecommendation from './SetupContributionRecommendation';
import { MIN_RECURRING_DEPOSIT } from '../SetupContributionForm/SetupRecommendationForm.definition';

describe('RetirementContributionRecommendation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SetupContributionRecommendation
        monthlySavings={1000}
        recommendedRSP={1000}
        userInputRSP={1000}
        isLoading={false}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display default recommendation message when userInputRSP is undefined', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={1000}
        recommendedRSP={1000}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('rsp-recommendation-default')).toBeTruthy();
  });

  test('recommendation message should display MIN_RECURRING_DEPOSIT if recommendation is below 25', () => {
    render(
      <SetupContributionRecommendation
        isLoading={false}
        monthlySavings={23}
        recommendedRSP={12}
      />
    );

    expect(
      screen.queryByText(new RegExp(`${MIN_RECURRING_DEPOSIT}`))
    ).toBeInTheDocument();
  });

  it('should display default recommendation message when userInputRSP is 0', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={1000}
        recommendedRSP={1000}
        isLoading={false}
        userInputRSP={0}
      />
    );

    expect(screen.queryByTestId('rsp-recommendation-default')).toBeTruthy();
  });

  it('should display <GoodRspInputMessage/> when userInputRSP is equal to recommendedRSP', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={1000}
        recommendedRSP={1000}
        userInputRSP={1001}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('rsp-recommendation-good')).toBeTruthy();
  });

  it('should display <GoodRspInputMessage/> when userInputRSP is greater than recommendedRSP', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={1000}
        recommendedRSP={1000}
        userInputRSP={1001}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('rsp-recommendation-good')).toBeTruthy();
  });

  it('should display <GoorRspInputMessage/> when user enters nothing for rsp and recommendedRSP is 0', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={1000}
        recommendedRSP={0}
        userInputRSP={0}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('rsp-recommendation-good')).toBeTruthy();
  });

  it('should display <LowMonthlySavingsMessage/> when recommendedRSP is greater than monthlyIncome', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={999}
        recommendedRSP={1000}
        userInputRSP={1000}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('rsp-recommendation-low')).toBeTruthy();
  });

  it('should display <GoodRspInputMessage/> when user has entered 0 for inputRsp and recommendedRSP is 0', () => {
    // handles the case when user has entered a very large initial investment amount enough to cover his entire investment without RSP
    render(
      <SetupContributionRecommendation
        monthlySavings={999}
        recommendedRSP={0}
        userInputRSP={0}
        isLoading={false}
      />
    );
    expect(screen.queryByTestId('rsp-recommendation-good')).toBeTruthy();
  });

  it('should display <GoodRspInputMessage/> when user did not enter anything for inputRsp and recommendedRSP is 0', () => {
    // handles the case when user has entered a very large initial investment amount enough to cover his entire investment without RSP
    render(
      <SetupContributionRecommendation
        monthlySavings={999}
        recommendedRSP={0}
        isLoading={false}
      />
    );
    expect(screen.queryByTestId('rsp-recommendation-good')).toBeTruthy();
  });

  it('should display loader when loading is true', () => {
    render(
      <SetupContributionRecommendation
        monthlySavings={999}
        recommendedRSP={1000}
        userInputRSP={1000}
        isLoading={true}
      />
    );

    expect(screen.queryByRole('status', { name: 'loading' })).toBeTruthy();
  });
});
