import { render, screen } from '@bambu/react-test-utils';

import InAppPreviewUserBanner from './InAppPreviewUserBanner';

vi.mock('@bambu/go-advisor-core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@bambu/go-advisor-core')>(
    '@bambu/go-advisor-core'
  );
  return {
    ...mod,
    useSelectUnfinishedTaskIndexQuery: vi
      .fn()
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(-1)
      .mockReturnValueOnce(1),
    useSelectHasActiveSubscriptionQuery: vi
      .fn()
      .mockReturnValueOnce({ data: false })
      .mockReturnValueOnce({ data: undefined })
      // Hook seems to runs twice, hence the need to mock twice
      .mockReturnValueOnce({ data: true })
      .mockReturnValueOnce({ data: true })
      .mockReturnValueOnce({ data: true })
      .mockReturnValueOnce({ data: true }),
  };
});

describe('InAppPreviewUserBanner', () => {
  beforeEach(() => {
    render(<InAppPreviewUserBanner />);
  });

  it('should render a banner prompting unpaid user to subscribe', () => {
    expect(screen.getByTestId('unpaid-user-banner')).toBeDefined();
  });

  it('should render ready for sharing banner when the user is subscribed and has completed main tasks +  has subscription', () => {
    expect(
      screen.getByTestId('subscribed-user-banner-with-robo-setup-completed')
    ).toBeDefined();
  });

  it('should render subscribed user banner prompting user to complete robo setup', () => {
    expect(
      screen.getByTestId('subscribed-user-banner-with-robo-setup-incomplete')
    ).toBeDefined();
  });
});
