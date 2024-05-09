import PaymentSettingsContributionDetailsCard from './PaymentSettingsContributionDetailsCard';
import { ReactHookFormWrapper, render } from '@bambu/react-test-utils';

describe('PaymentSettingsContributionDetailsCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReactHookFormWrapper>
        <PaymentSettingsContributionDetailsCard />
      </ReactHookFormWrapper>
    );
    expect(baseElement).toBeTruthy();
  });
});
