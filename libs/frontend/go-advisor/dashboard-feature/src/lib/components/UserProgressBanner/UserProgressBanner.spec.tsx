import { render, screen } from '@bambu/react-test-utils';

import UserProgressBanner from './UserProgressBanner';
import { beforeEach } from 'vitest';

vi.mock('@bambu/go-advisor-core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@bambu/go-advisor-core')>(
    '@bambu/go-advisor-core'
  );
  return {
    ...mod,
    useSelectUserReadyToSubscribe: vi
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false),
    useSelectIsReadyForPreviewQuery: vi
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false),
    useSelectUnfinishedTaskIndexQuery: vi
      .fn()
      .mockReturnValueOnce(-1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1),
  };
});

describe('UserProgressBanner', () => {
  beforeEach(() => {
    render(<UserProgressBanner />);
  });

  it('should render ready to share banner when the user has completed all tasks', () => {
    expect(screen.getByTestId('ready-to-share-banner')).toBeDefined();
  });

  it('should render ready for preview banner when the user has completed main tasks +  has subscription', () => {
    expect(screen.getByTestId('ready-for-preview-banner')).toBeDefined();
  });

  it('should render ready to subscribe banner when the user has completed main tasks', () => {
    expect(screen.getByTestId('ready-to-subscribe-banner')).toBeDefined();
  });

  it('should render new user banner for a first time user', () => {
    expect(screen.getByTestId('new-user-banner')).toBeDefined();
  });
});
