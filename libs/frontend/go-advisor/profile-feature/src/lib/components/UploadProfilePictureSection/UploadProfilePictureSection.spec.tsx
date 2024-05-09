import { render, screen } from '@bambu/react-test-utils';

import UploadProfilePictureSection from './UploadProfilePictureSection';

vi.mock('@bambu/go-advisor-core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@bambu/go-advisor-core')>(
    '@bambu/go-advisor-core'
  );
  return {
    ...mod,
    useSelectAdvisorHasProfilePictureQuery: vi
      .fn()
      .mockReturnValueOnce({ data: false })
      .mockReturnValueOnce({ data: true }),
  };
});

describe('UploadProfilePictureSection', () => {
  beforeEach(() => {
    render(<UploadProfilePictureSection />);
  });

  it('should display upload button if user does not have profile picture', () => {
    expect(screen.getByTestId('upload-profile-picture-btn')).toBeDefined();
  });

  it('should display remove button if user has profile picture', () => {
    expect(screen.getByTestId('remove-profile-picture-btn')).toBeDefined();
  });
});
