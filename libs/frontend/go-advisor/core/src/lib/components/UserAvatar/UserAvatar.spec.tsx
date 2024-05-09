import { render, screen } from '@bambu/react-test-utils';
import UserAvatar from './UserAvatar';

vi.mock(
  '../../hooks/useProfileDetails/useProfileDetails.selectors',
  async () => {
    return {
      useSelectHasUserCompletedProfileQuery: vi
        .fn()
        .mockReturnValueOnce({ data: false })
        .mockReturnValueOnce({ data: true })
        .mockReturnValueOnce({ data: true }),
      useSelectAdvisorInternalProfilePictureQuery: vi
        .fn()
        .mockReturnValueOnce({ data: null })
        .mockReturnValueOnce({ data: null })
        .mockReturnValueOnce({ data: 'https://i.pravatar.cc/300' }),
      useSelectAdvisorInitialsQuery: vi
        .fn()
        .mockReturnValueOnce({ data: null })
        .mockReturnValueOnce({ data: 'AB' })
        .mockReturnValueOnce({ data: 'AB' }),
    };
  }
);

describe('UserAvatar', () => {
  beforeEach(() => {
    render(<UserAvatar />);
  });

  it('should render profile icon when user has not completed profile', () => {
    expect(screen.getByTestId('profile-icon')).toBeDefined();
  });

  it('should render advisor initials when user has not uploaded profile picture', () => {
    expect(screen.getByTestId('advisor-initials')).toBeDefined();
  });

  it('should render advisor profile picture when user has uploaded profile picture', () => {
    expect(screen.getByTestId('advisor-profile-picture')).toBeDefined();
  });
});
