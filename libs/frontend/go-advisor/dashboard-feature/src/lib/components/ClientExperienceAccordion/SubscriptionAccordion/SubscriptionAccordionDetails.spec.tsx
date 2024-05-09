import { screen, render } from '@bambu/react-test-utils';
import SubscriptionAccordionDetails from './SubscriptionAccordionDetails';

vi.mock('@bambu/go-advisor-core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@bambu/go-advisor-core')>(
    '@bambu/go-advisor-core'
  );
  return {
    ...mod,
    useSelectHasActiveSubscriptionQuery: vi
      .fn()
      .mockReturnValueOnce({ data: true })
      .mockReturnValueOnce({ data: false }),
  };
});

describe('SubscriptionAccordionDetails', () => {
  beforeEach(() => {
    render(<SubscriptionAccordionDetails />);
  });

  it('should show active subscription details if user has active subscription', () => {
    expect(screen.getByTestId('active-subscription-details')).toBeDefined();
  });

  it('should show inactive subscription details if user does not have active subscription', () => {
    expect(screen.getByTestId('inactive-subscription-details')).toBeDefined();
  });
});
